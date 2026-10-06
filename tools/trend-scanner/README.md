# Local trend scanner (no tokens, no API keys)

Stdlib-only Python. Polls Google Trends RSS, Reddit rising, Hacker News and Wikipedia top pages,
remembers every term in `trends.db`, and alerts on terms never seen before that show up in 2+ sources
(or 3+ items, or on Google Trends). Alerts go to the console, `alerts.jsonl`, a macOS notification, and an optional webhook (`WEBHOOK` in the script).

    python3 scanner.py              # one scan (first run only stores a baseline)
    python3 scanner.py --loop       # every 5 minutes

Cron alternative: `*/5 * * * * cd /path/to/tools/trend-scanner && python3 scanner.py >> scan.log 2>&1`

Set `GEO` for another country. Run a trademark/brand filter before generating assets.

## Dashboard (zero tokens)

    python3 dashboard.py            # http://127.0.0.1:8765, rescans every 5 min (--port, --interval)

Per trend: opportunity score, Google volume + sparkline, times trended (history.db), Wikipedia visits/day
vs 13-day average, news and HN mentions, what's sold (Amazon/eBay autocomplete), search-intent %,
keywords (autocomplete rank = relative volume; green = searched but not seen in marketplaces) and asset gaps
(Google demand vs marketplace supply: OPEN / contested / crowded). Click a row for details.

Caveats: Google gives bucketed volumes only (5K+, 100K+); autocomplete rank is a relative proxy; Etsy blocks scraping so
supply comes from Amazon/eBay suggestions. Brand/celebrity trends carry trademark risk, so prefer generic angles.

## Dock launcher

    ./make_app.sh   # builds ~/Applications/Trend Radar.app (copies scripts to ~/.trend-radar)

Drag the app to the Dock. Click it: starts the server if needed and opens the dashboard. Re-run after editing the scripts.

## eBay listing drafts

Expanded rows include a copy-paste eBay draft (title, cost+markup price, price after eBay fees, description) for each reference item.
Only list items you own, with your own photos; dropshipping from other retailers violates eBay policy.
