# TrustPing

> Paste a link to any listing or profile. Get a Trust Score. Insure the transaction.
>
> **Note:** "TrustPing" is a working/package name used throughout this repo (package name,
> folder names, etc.). It's a placeholder — feel free to rebrand without heavy surgery; the
> name mostly lives in `package.json`, page copy, and a few component strings.

## What this is

A full-stack scaffold for a marketplace/profile trust-verification platform:

- Users paste a link (eBay, Amazon, Gumtree, Facebook Marketplace, AutoTrader, Cars.com,
  LinkedIn, Fiverr, Instagram, Facebook/influencer pages, ...) or search by platform.
- The app detects the platform from the URL, runs a **Trust Check pipeline** (reverse image
  search, AI-generated image detection, cross-platform identity match, account age/history,
  review sentiment), and produces a **Trust Score (0-100)**.
- Score ≥ 90 → **Insured Verified** (TrustPing financially backs the transaction; claims form
  included). Score 70-89 → **Trusted**. Users can request paid **Human Validation** for a
  manual review.
- Sellers can subscribe to keep listings continuously checked; one-off checks and human
  validation are also purchasable — both via Stripe Checkout (test mode).

**Every external integration in this scaffold is stubbed** with clear `// TODO:` comments —
reverse image search, AI image detection, cross-platform matching, account history, review
sentiment, and Stripe secret keys. Scores are generated deterministically from the URL so the
UI is fully demoable without any real API keys.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Cloudflare Pages** for hosting, via `@cloudflare/next-on-pages`
- **Cloudflare D1** (SQLite at the edge) for `users`, `listings`, `scores`, `claims`,
  `subscriptions`
- **Stripe** for one-off verification fees and seller subscriptions (test mode)

## Project structure

```
app/                     Next.js App Router pages + API routes
  page.tsx               Home (hero, live ticker, how-it-works, testimonials)
  search/page.tsx        Paste-link / search tool
  results/page.tsx        Trust Score results page (circular gauge + breakdown)
  pricing/page.tsx        One-off checks + seller subscription plans (Stripe)
  dashboard/page.tsx      Profile dashboard (mock data)
  claims/page.tsx         Insured Verified claim submission form
  admin/page.tsx          Admin review queue (mock data)
  api/
    check/route.ts                  Orchestrates the full Trust Check pipeline
    check/reverse-image/route.ts    Stubbed reverse image search check
    check/ai-image/route.ts         Stubbed AI-generated image detection
    check/cross-platform/route.ts   Stubbed cross-platform identity match
    check/account-history/route.ts  Stubbed account age/history check
    check/review-sentiment/route.ts Stubbed review sentiment analysis
    stripe/checkout/route.ts        Creates a Stripe Checkout session
    stripe/webhook/route.ts         Stubbed Stripe webhook receiver
    claims/route.ts                 Accepts claim submissions

adapters/                One JSON file per supported platform (see below)
components/              TrustBadge, ScoreGauge, PlatformMegaMenu, LiveTicker, Navbar, Footer,
                          Hero, HowItWorks, Testimonials
lib/
  adapters.ts             Loads adapters, detects platform from a URL, groups by category
  scoring.ts              Tier thresholds, mock check pipeline, score aggregation
  db.ts                   D1 binding accessor (TODO: wire to @cloudflare/next-on-pages)
  mock-data.ts            Seed data for the live-activity ticker
migrations/0001_init.sql  D1 schema (users, listings, scores, claims, subscriptions)
types/index.ts            Shared TypeScript types
wrangler.toml              Cloudflare Pages/D1 configuration
```

## Platform adapter system

Every supported site is defined entirely by a JSON config in `/adapters` — **no code
changes are needed to add a new platform**. An adapter looks like:

```json
{
  "id": "ebay",
  "name": "eBay",
  "category": "marketplace",
  "domains": ["ebay.com", "www.ebay.com"],
  "urlPatterns": ["ebay\\.[a-z.]+/itm/"],
  "icon": "🛒",
  "description": "Auction and fixed-price listings, plus seller profiles.",
  "selectors": {
    "title": { "selector": "h1.x-item-title__mainTitle", "description": "Listing title" }
  },
  "checks": ["reverseImageSearch", "aiImageDetection", "accountAgeHistory", "reviewSentiment", "priceAnomalyDetection"]
}
```

- `domains` / `urlPatterns` — used by `detectPlatform()` in `lib/adapters.ts` to match a
  pasted URL to a platform.
- `category` — one of `marketplace`, `car-sales`, `professional`, `social-influencer`; drives
  the grouped mega-menu.
- `selectors` — CSS selectors (+ optional `attribute`) describing what to extract once a real
  scraper/fetcher is wired up.
- `checks` — which of the **15** pipeline checks apply to this platform (each adapter only
  enables the checks that make sense for its category — see table below).

### Adding a new platform

1. Create `adapters/<platform-id>.json` following the shape above.
2. Import it in `lib/adapters.ts` and add it to the `ADAPTERS` array.
3. That's it — the mega-menu, search page, platform detection, and Trust Check pipeline all
   pick it up automatically.

Currently included: **eBay, Amazon, Gumtree, Facebook Marketplace, AutoTrader, Cars.com,
LinkedIn, Fiverr, Instagram, Facebook/influencer pages.**

## Trust Score tiers

| Score   | Tier               |
|---------|---------------------|
| 90-100  | Insured Verified 🛡️ |
| 70-89   | Trusted ✅           |
| 40-69   | Caution ⚠️           |
| 0-39    | High Risk ⛔         |

Tier colors/labels live in `lib/scoring.ts` (`TIER_THRESHOLDS`, `TIER_STYLES`).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real keys as you wire up integrations
npm run dev                  # http://localhost:3000
```

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (also what Cloudflare Pages runs)
```

## The 15 Trust Check pipeline checks

Every check is a stand-in (`stubbed: true`) for a real integration — each route has a
`// TODO:` comment pointing at a suggested real provider. An adapter's `checks` array
controls which of these run for that platform (e.g. a LinkedIn profile doesn't need a
shipping-policy check; an eBay listing doesn't need follower-authenticity analysis).

| Check | Route | Suggested real provider |
|---|---|---|
| Reverse Image Search | `app/api/check/reverse-image` | Google Vision Web Detection, TinEye |
| AI-Generated Image Detection | `app/api/check/ai-image` | Hive Moderation, Sightengine |
| Cross-Platform Identity Match | `app/api/check/cross-platform` | Custom identity-graph matching |
| Account Age & History | `app/api/check/account-history` | Platform APIs, VIN history (vehicles) |
| Review Sentiment Analysis | `app/api/check/review-sentiment` | NLP sentiment over scraped reviews |
| Price Anomaly Detection | `app/api/check/price-anomaly` | Keepa, eBay sold-items median |
| Photo Metadata Forensics | `app/api/check/metadata-forensics` | exifr / exiftool EXIF parsing |
| Domain Age & WHOIS Lookup | `app/api/check/domain-age` | WhoisXML API, rdap.org |
| Duplicate Listing Scan | `app/api/check/duplicate-listing` | Fuzzy text + image-hash index |
| Contact Info Verification | `app/api/check/contact-verification` | Twilio Lookup, NeverBounce/ZeroBounce |
| Scammer Blacklist Database Check | `app/api/check/blacklist-check` | BBB Scam Tracker, internal claims history |
| Social Proof & Follower Authenticity | `app/api/check/social-proof` | Instagram Graph API, TikTok Research API |
| Payment Method Risk Check | `app/api/check/payment-risk` | Keyword scan for wire/gift-card/crypto requests |
| Listing Consistency Check | `app/api/check/listing-consistency` | Vision model vs. title/category match |
| Shipping & Refund Policy Risk Check | `app/api/check/shipping-policy` | Keyword scan for no-return/cash-only language |

- **Stripe** — set real keys via `.env.local` (dev) or `wrangler secret put` (prod); replace
  placeholder `priceId`s in `app/api/stripe/checkout/route.ts` with real Stripe Price IDs.
- **D1 persistence** — `app/api/check/route.ts` and `app/api/claims/route.ts` have TODOs for
  the `INSERT`s once a D1 binding is available in the deployed environment (see `lib/db.ts`).

## Deploying to Cloudflare Pages

1. **Create the D1 database** (one-time):
   ```bash
   npx wrangler d1 create trustping-db
   # paste the returned database_id into wrangler.toml -> [[d1_databases]] -> database_id
   ```
2. **Run migrations**:
   ```bash
   npm run db:migrate:local   # local dev DB
   npm run db:migrate:remote  # production D1
   ```
3. **Set secrets** (production):
   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   # ...and any real check-provider API keys
   ```
4. **Build for Pages and deploy**:
   ```bash
   npm run pages:build   # npx @cloudflare/next-on-pages
   npm run pages:deploy  # wrangler pages deploy .vercel/output/static
   ```
   Or connect the repo in the Cloudflare Pages dashboard and set the build command to
   `npx @cloudflare/next-on-pages` with output directory `.vercel/output/static`.
5. In the Pages project settings, bind the `DB` D1 database (same `binding = "DB"` as
   `wrangler.toml`) so `lib/db.ts` can be updated to read it via
   `getRequestContext().env.DB` from `@cloudflare/next-on-pages`.

## Known limitations of this scaffold

- All trust-check scores are deterministic mock values seeded from the URL — no real
  scraping or third-party API calls happen yet.
- There's no real authentication; Dashboard/Admin pages use mock data and should be gated
  behind real auth + role checks before production use.
- Scraping third-party sites may violate their Terms of Service — prefer official APIs
  (eBay Browse API, Meta Graph API, etc.) wherever available, and always review each
  platform's ToS before enabling live scraping in the adapters above.
