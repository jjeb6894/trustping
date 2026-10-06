#!/usr/bin/env python3
"""Local trend dashboard (stdlib only, zero tokens). http://127.0.0.1:8765

Every 5 min: Google Trends -> per trend: history (times trended, volume), visits (Wikipedia
pageviews), mentions (news, HN), what's sold (Amazon/eBay autocomplete), keyword intent %,
and asset gaps (Google demand vs marketplace supply).
"""
import argparse, datetime as dt, json, re, sqlite3, threading, time, urllib.parse
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import scanner

HERE = Path(__file__).parent
HT = "{https://trends.google.com/trending/rss}"
WIKI_UA = "trend-scanner/1.0 (personal research tool)"
ASSETS = ["template", "svg", "printable", "wallpaper", "png", "sticker", "font", "logo", "tshirt",
          "meme", "coloring page", "planner", "poster", "cheat sheet"]
ASSET_WORDS = {"tshirt": ["shirt", "tee"], "coloring page": ["coloring"], "cheat sheet": ["cheat"],
               "printable": ["printable", "print"], "poster": ["poster", "print"]}
INTENT = {
    "transactional": r"\b(buy|price|cheap|sale|shop|merch|shirt|tshirt|hoodie|poster|print|printable|template|"
                     r"download|free|svg|png|sticker|order|coupon|vinyl|cd|tickets?|costume|gift|mug)\b",
    "commercial": r"\b(best|top|review|reviews|vs|compare|alternative|ranking|worth)\b",
    "navigational": r"\b(login|official|website|app|youtube|instagram|twitter|facebook|tiktok|reddit)\b|\.com",
}
STATE = {"trends": [], "updated": 0, "error": "", "next": 0}
CACHE = {}
LOCK = threading.Lock()
DB = sqlite3.connect(HERE / "history.db", check_same_thread=False)
DB.execute("CREATE TABLE IF NOT EXISTS snap(ts REAL, term TEXT, rank INT, traffic INT)")
DB.execute("CREATE INDEX IF NOT EXISTS i ON snap(term, ts)")


def cached(key, ttl, fn):
    hit = CACHE.get(key)
    if hit and time.time() - hit[0] < ttl:
        return hit[1]
    try:
        val = fn()
    except Exception:
        val = hit[1] if hit else None
    CACHE[key] = (time.time(), val)
    return val


def traffic_num(s):
    s = (s or "").upper().replace("+", "").replace(",", "")
    mult = 1000 if s.endswith("K") else 1_000_000 if s.endswith("M") else 1
    try:
        return int(float(s.rstrip("KM")) * mult)
    except ValueError:
        return 0


def fmt(n):
    return f"{n/1e6:.1f}M" if n >= 1e6 else f"{n/1e3:.0f}K" if n >= 1e3 else str(n)


def google_ac(q):
    return cached(("g", q), 3600, lambda: scanner.fetch(
        "https://suggestqueries.google.com/complete/search?client=firefox&q=" + urllib.parse.quote(q))[1]) or []


def amazon_ac(q):
    def go():
        d = scanner.fetch("https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix="
                          + urllib.parse.quote(q))
        return [s["value"] for s in d.get("suggestions", [])]
    return cached(("a", q), 3600, go) or []


def ebay_ac(q):
    def go():
        raw = scanner.fetch("https://autosug.ebay.com/autosug?sId=0&_jgr=1&sc=1&callback=cb&kwd="
                            + urllib.parse.quote(q), False).decode()
        return json.loads(raw[raw.index("(") + 1:raw.rindex(")")])["res"]["sug"]
    return cached(("e", q), 3600, go) or []


def wiki_info(term):
    def go():
        h = {"User-Agent": WIKI_UA}
        def get(url):
            import urllib.request
            with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=15, context=scanner.CTX) as r:
                return json.loads(r.read())
        s = get("https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search="
                + urllib.parse.quote(term))
        if not s[1]:
            return {}
        title = s[1][0]
        art = urllib.parse.quote(title.replace(" ", "_"), safe="")
        about = get("https://en.wikipedia.org/api/rest_v1/page/summary/" + art).get("extract", "")[:320]
        end = dt.date.today() - dt.timedelta(days=1)
        start = end - dt.timedelta(days=13)
        pv = get(f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/"
                 f"{art}/daily/{start:%Y%m%d}/{end:%Y%m%d}")
        views = [i["views"] for i in pv["items"]]
        return {"title": title, "about": about, "views": views}
    return cached(("w", term), 1800, go) or {}


def news_mentions(term):
    def go():
        out = {}
        for tag, when in (("d1", "1d"), ("d7", "7d")):
            q = urllib.parse.quote(f'"{term}" when:{when}')
            root = ET.fromstring(scanner.fetch(
                f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en", False))
            out[tag] = len(list(root.iter("item")))
        return out
    return cached(("n", term), 1800, go) or {}


def hn_mentions(term):
    def go():
        since = int(time.time()) - 86400
        q = urllib.parse.quote(f'"{term}"')
        d = scanner.fetch(f"https://hn.algolia.com/api/v1/search?query={q}&tags=story&numericFilters=created_at_i>{since}")
        return d.get("nbHits", 0)
    return cached(("h", term), 1800, go) or 0


def classify(keywords):
    c = {"informational": 0, "commercial": 0, "transactional": 0, "navigational": 0}
    for k in keywords:
        for name, rx in INTENT.items():
            if re.search(rx, k.lower()):
                c[name] += 1
                break
        else:
            c["informational"] += 1
    tot = sum(c.values()) or 1
    return {k: round(100 * v / tot) for k, v in c.items()}


def history(term):
    rows = DB.execute("SELECT ts, rank, traffic FROM snap WHERE term=? ORDER BY ts", (term,)).fetchall()
    if not rows:
        return {}
    runs, prev = 0, None
    for ts, _, _ in rows:
        if prev is None or ts - prev > 1800:
            runs += 1
        prev = ts
    return {"first": rows[0][0], "last": rows[-1][0], "snaps": len(rows), "runs": runs,
            "best_rank": min(r[1] for r in rows), "spark": [r[2] for r in rows][-30:],
            "peak": max(r[2] for r in rows)}


def deep(term, size):
    """Slower per-term enrichment: keywords, intent, marketplace supply, gaps."""
    base = [q for q in google_ac(term) if q.lower() != term.lower()]
    extra = []
    with ThreadPoolExecutor(8) as ex:
        res = list(ex.map(lambda a: (a, google_ac(f"{term} {a}")), ASSETS))
        for q in ex.map(lambda s: google_ac(f"{term} {s}"), ["how", "best", "buy", "vs", "free"]):
            extra += q
    sold_a, sold_e = amazon_ac(term), ebay_ac(term)
    sold = list(dict.fromkeys(sold_a + sold_e))[:12]
    sold_text = " ".join(sold).lower()
    demand = {}
    for a, r in res:
        hits = [q for q in r if a.split()[0] in q.lower() or any(w in q.lower() for w in ASSET_WORDS.get(a, []))]
        if hits:
            demand[a] = hits
    rows = []
    for a, hits in demand.items():
        words = ASSET_WORDS.get(a, [a.split()[0]])
        supply = sum(1 for s in sold if any(w in s.lower() for w in words))
        supply += len([s for s in amazon_ac(f"{term} {a}") + ebay_ac(f"{term} {a}") if any(w in s.lower() for w in words)])
        rows.append({"asset": a, "demand": len(hits), "supply": supply, "queries": hits[:3],
                     "status": "OPEN" if supply == 0 else "contested" if supply < 4 else "crowded"})
    rows.sort(key=lambda r: (r["supply"], -r["demand"]))
    keywords = list(dict.fromkeys(base + extra + [q for _, r in res for q in r]))
    kw = [{"kw": k, "pos": i + 1, "sold": k.lower() in sold_text} for i, k in enumerate(base[:10])]
    untapped = [k["kw"] for k in kw if not k["sold"]][:6]
    return {"keywords": kw, "intent": classify(keywords), "sold": sold, "gaps": rows,
            "untapped": untapped, "speculative": [a for a, r in res if not r][:8],
            "note": ("Big: heavy competition, win on speed + narrow angle." if size == "big"
                     else "Small: little competition, one good asset can own it.")}


def score(t):
    s = 0
    s += max(0, 30 - t["age_min"] / 4)
    s += min(25, t["volume"] / 20000)
    d = t.get("deep") or {}
    s += 8 * sum(1 for g in d.get("gaps", []) if g["status"] == "OPEN")
    s += 0.2 * d.get("intent", {}).get("transactional", 0)
    s -= 2 * len(d.get("sold", []))
    return max(0, min(100, round(s)))


def google_trends():
    root = ET.fromstring(scanner.fetch(f"https://trends.google.com/trending/rss?geo={scanner.GEO}", False))
    out = []
    for rank, it in enumerate(root.iter("item"), 1):
        news = [{"title": n.findtext(HT + "news_item_title") or "", "source": n.findtext(HT + "news_item_source") or "",
                 "url": n.findtext(HT + "news_item_url") or ""} for n in it.findall(HT + "news_item")][:4]
        out.append({"term": (it.findtext("title") or "").strip(), "rank": rank,
                    "traffic": traffic_num(it.findtext(HT + "approx_traffic")), "news": news})
    return out


def refresh():
    now = time.time()
    g = google_trends()
    DB.executemany("INSERT INTO snap VALUES(?,?,?,?)", [(now, t["term"], t["rank"], t["traffic"]) for t in g])
    DB.commit()
    DB.execute("DELETE FROM snap WHERE ts < ?", (now - 14 * 86400,)); DB.commit()
    trends = []
    for t in g:
        h = history(t["term"])
        trends.append({"term": t["term"], "rank": t["rank"], "volume": t["traffic"], "volume_fmt": fmt(t["traffic"]),
                       "size": "big" if t["traffic"] >= 100_000 else "small", "news": t["news"], "hist": h,
                       "age_min": int((now - h["first"]) / 60)})
    def enrich(t):
        w = wiki_info(t["term"])
        v = w.get("views", [])
        t["about"] = w.get("about", "")
        t["wiki"] = {"title": w.get("title", ""), "yesterday": v[-1] if v else 0,
                     "avg": round(sum(v[:-1]) / max(1, len(v) - 1)) if v else 0, "series": v}
        t["mentions"] = {"news": news_mentions(t["term"]), "hn": hn_mentions(t["term"])}
    with ThreadPoolExecutor(5) as ex:
        list(ex.map(enrich, trends))
    with ThreadPoolExecutor(4) as ex:
        for t, d in zip(trends[:15], ex.map(lambda x: deep(x["term"], x["size"]), trends[:15])):
            t["deep"] = d
    for t in trends:
        t["score"] = score(t)
    trends.sort(key=lambda t: -t["score"])
    with LOCK:
        STATE.update(trends=trends, updated=now, error="")


def loop(interval):
    while True:
        try:
            refresh()
        except Exception as e:
            STATE["error"] = str(e)
            print("refresh failed:", e)
        STATE["next"] = time.time() + interval
        time.sleep(interval)


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, body, ctype):
        b = body.encode()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path == "/api/trends":
            with LOCK:
                self.send(json.dumps(STATE), "application/json")
        elif u.path == "/api/deep":
            term = urllib.parse.parse_qs(u.query).get("term", [""])[0]
            size = next((t["size"] for t in STATE["trends"] if t["term"] == term), "small")
            self.send(json.dumps(deep(term, size)), "application/json")
        elif u.path == "/":
            self.send((HERE / "dashboard.html").read_text(), "text/html; charset=utf-8")
        else:
            self.send_error(404)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=8765)
    p.add_argument("--interval", type=int, default=300)
    a = p.parse_args()
    threading.Thread(target=loop, args=(a.interval,), daemon=True).start()
    print(f"dashboard on http://127.0.0.1:{a.port}")
    ThreadingHTTPServer(("127.0.0.1", a.port), H).serve_forever()
