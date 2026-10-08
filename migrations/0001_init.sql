-- TrustLink initial schema
-- Apply locally: npm run db:migrate:local
-- Apply remote:  npm run db:migrate:remote

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- uuid
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  stripe_customer_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY, -- uuid
  user_id TEXT REFERENCES users(id),
  url TEXT NOT NULL,
  platform_id TEXT NOT NULL, -- matches adapters/*.json "id"
  title TEXT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending' -- 'pending' | 'checked' | 'failed'
);

CREATE INDEX IF NOT EXISTS idx_listings_platform ON listings(platform_id);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY, -- uuid
  listing_id TEXT NOT NULL REFERENCES listings(id),
  score INTEGER NOT NULL, -- 0-100 aggregate Trust Score
  tier TEXT NOT NULL, -- 'insured' | 'trusted' | 'caution' | 'risk'
  checks_json TEXT NOT NULL, -- serialized CheckResult[] (see types/index.ts)
  human_validation_requested INTEGER NOT NULL DEFAULT 0, -- boolean 0/1
  human_validation_status TEXT, -- 'pending' | 'in_review' | 'completed'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_listing ON scores(listing_id);
CREATE INDEX IF NOT EXISTS idx_scores_tier ON scores(tier);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY, -- uuid
  score_id TEXT REFERENCES scores(id),
  listing_url TEXT NOT NULL,
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  amount INTEGER NOT NULL, -- minor currency units (cents)
  currency TEXT NOT NULL DEFAULT 'usd',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'reviewing' | 'approved' | 'denied'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY, -- uuid
  user_id TEXT NOT NULL REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- 'starter' | 'pro' | 'business'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'past_due' | 'canceled'
  current_period_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
