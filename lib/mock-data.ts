import type { LiveActivityEntry } from "@/types";

/**
 * Seed data for the home page's animated live-activity ticker.
 * TODO: replace with a real D1-backed query (`SELECT ... FROM scores ORDER
 * BY created_at DESC LIMIT 20`) once listings are actually being checked
 * in production; see migrations/0001_init.sql for the `scores` table shape.
 */
export const MOCK_LIVE_ACTIVITY: LiveActivityEntry[] = [
  {
    id: "act-1",
    actor: "u***34",
    action: "just listed a verified car",
    platformId: "autotrader",
    score: 97,
    tier: "insured",
    timestamp: "2 minutes ago",
  },
  {
    id: "act-2",
    actor: "seller_mk",
    action: "passed Trust Check on a gig",
    platformId: "fiverr",
    score: 92,
    tier: "insured",
    timestamp: "4 minutes ago",
  },
  {
    id: "act-3",
    actor: "j***99",
    action: "got a Trusted badge for a watch listing",
    platformId: "ebay",
    score: 81,
    tier: "trusted",
    timestamp: "6 minutes ago",
  },
  {
    id: "act-4",
    actor: "r***_deals",
    action: "requested Human Validation on a sofa listing",
    platformId: "facebook-marketplace",
    score: 63,
    tier: "caution",
    timestamp: "9 minutes ago",
  },
  {
    id: "act-5",
    actor: "studio.anna",
    action: "verified an influencer collab page",
    platformId: "instagram",
    score: 95,
    tier: "insured",
    timestamp: "12 minutes ago",
  },
  {
    id: "act-6",
    actor: "d***_motors",
    action: "just listed a verified vehicle",
    platformId: "cars-com",
    score: 91,
    tier: "insured",
    timestamp: "15 minutes ago",
  },
  {
    id: "act-7",
    actor: "k***consult",
    action: "verified a freelance profile",
    platformId: "linkedin",
    score: 88,
    tier: "trusted",
    timestamp: "18 minutes ago",
  },
  {
    id: "act-8",
    actor: "p***88",
    action: "flagged for reused product photos",
    platformId: "amazon",
    score: 38,
    tier: "risk",
    timestamp: "21 minutes ago",
  },
  {
    id: "act-9",
    actor: "m***_home",
    action: "just listed a verified furniture set",
    platformId: "gumtree",
    score: 85,
    tier: "trusted",
    timestamp: "24 minutes ago",
  },
  {
    id: "act-10",
    actor: "brandpage.co",
    action: "earned Insured Verified on a giveaway page",
    platformId: "facebook-influencer",
    score: 94,
    tier: "insured",
    timestamp: "27 minutes ago",
  },
];
