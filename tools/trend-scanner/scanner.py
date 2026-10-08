#!/usr/bin/env python3
"""Zero-token local trend scanner. Stdlib only, no API keys, no LLM.

Polls free sources, stores sightings in SQLite, and flags terms that are NEW
(never seen before) and appear in 2+ sources or 2+ items. Run once (cron/launchd)
or with --loop for a 5 minute daemon.
"""
import argparse, datetime as dt, json, re, sqlite3, ssl, subprocess, sys, time, urllib.request
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).parent
DB = HERE / "trends.db"
OUT = HERE / "alerts.jsonl"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
GEO = "US"
WEBHOOK = ""  # optional: Discord/Slack-style webhook URL for alerts
STOP = set("""a an and are as at be but by for from has have how i in is it its of on or our
that the their this to was we were what when where who why will with you your new vs not after
before about into over more most just can could would should says say said out up down off than
then them they he she his her him do does did been being get gets got one two three first""".split())


def _ctx():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    ctx = ssl.create_default_context()
    if not ctx.cert_store_stats().get("x509_ca"):
        ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem")  # macOS system bundle
    return ctx


CTX = _ctx()


def fetch(url, as_json=True):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=15, context=CTX) as r:
        body = r.read()
    return json.loads(body) if as_json else body


def src_google():
    root = ET.fromstring(fetch(f"https://trends.google.com/trending/rss?geo={GEO}", False))
    for it in root.iter("item"):
        t = (it.findtext("title") or "").strip()
        traffic = (it.findtext("{https://trends.google.com/trending/rss}approx_traffic") or "0")
        yield t, int(re.sub(r"\D", "", traffic) or 0)


def src_reddit():
    root = ET.fromstring(fetch("https://www.reddit.com/r/all/rising/.rss?limit=50", False))
    for e in root.iter("{http://www.w3.org/2005/Atom}entry"):
        yield (e.findtext("{http://www.w3.org/2005/Atom}title") or "").strip(), 0


def src_hn():
    url = "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=60&numericFilters=points>3"
    for h in fetch(url)["hits"]:
        if h.get("title"):
            yield h["title"], h.get("points", 0)


def src_wiki():
    d = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=1)
    url = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/{d:%Y/%m/%d}"
    for a in fetch(url)["items"][0]["articles"][:80]:
        t = a["article"].replace("_", " ")
        if not t.startswith(("Main Page", "Special:", "Wikipedia:", "Portal:", "-")):
            yield t, a["views"]


SOURCES = {"google": src_google, "reddit": src_reddit, "hn": src_hn, "wiki": src_wiki}


def terms(title, whole=False):
    if whole:
        return {title.lower()}
    words = [w for w in re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]+", title.lower())]
    out = set()
    for n in (2, 3):
        for i in range(len(words) - n + 1):
            g = words[i:i + n]
            if g[0] not in STOP and g[-1] not in STOP:
                out.add(" ".join(g))
    return out


def notify(msg):
    if sys.platform == "darwin":
        subprocess.run(["osascript", "-e", f'display notification {json.dumps(msg)} with title "Trend"'], check=False)
    if WEBHOOK:
        try:
            req = urllib.request.Request(WEBHOOK, json.dumps({"content": msg, "text": msg}).encode(),
                                         {"Content-Type": "application/json", "User-Agent": UA})
            urllib.request.urlopen(req, timeout=10, context=CTX)
        except Exception as e:
            print("webhook failed:", e)


def scan(args):
    db = sqlite3.connect(DB)
    db.execute("CREATE TABLE IF NOT EXISTS seen(term TEXT PRIMARY KEY, first_ts REAL)")
    now = time.time()
    hits = defaultdict(lambda: {"sources": set(), "items": 0, "weight": 0, "example": ""})
    for name, fn in SOURCES.items():
        try:
            for title, weight in fn():
                for t in terms(title, whole=name in ("google", "wiki")):
                    h = hits[t]
                    h["sources"].add(name); h["items"] += 1
                    h["weight"] += weight; h["example"] = h["example"] or title
        except Exception as e:
            print(f"[{name}] failed: {e}", file=sys.stderr)
    first_run = db.execute("SELECT COUNT(*) FROM seen").fetchone()[0] == 0
    alerts = []
    for t, h in hits.items():
        if db.execute("SELECT 1 FROM seen WHERE term=?", (t,)).fetchone():
            continue
        db.execute("INSERT INTO seen VALUES(?,?)", (t, now))
        strong = len(h["sources"]) >= 2 or h["items"] >= args.min_items or "google" in h["sources"]
        if strong and not first_run:
            alerts.append((len(h["sources"]) * 10 + h["items"], t, h))
    db.commit()
    db.execute("DELETE FROM seen WHERE first_ts < ?", (now - 30 * 86400,)); db.commit()
    alerts.sort(key=lambda a: -a[0])
    with OUT.open("a") as f:
        for score, t, h in alerts[:args.top]:
            rec = {"ts": int(now), "term": t, "score": score, "sources": sorted(h["sources"]),
                   "items": h["items"], "example": h["example"]}
            f.write(json.dumps(rec) + "\n")
            print(f"NEW  {score:>4}  {t:<35} {','.join(rec['sources'])}  | {h['example'][:70]}")
    if alerts:
        notify("; ".join(t for _, t, _ in alerts[:3]))
    elif first_run:
        print(f"baseline stored ({len(hits)} terms); alerts start next run")
    else:
        print("no new terms")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--loop", action="store_true", help="run forever")
    p.add_argument("--interval", type=int, default=300, help="seconds between scans")
    p.add_argument("--top", type=int, default=15)
    p.add_argument("--min-items", type=int, default=3)
    a = p.parse_args()
    while True:
        scan(a)
        if not a.loop:
            break
        time.sleep(a.interval)
