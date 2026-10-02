import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Creates a Stripe Checkout Session (test mode) for either a one-off
 * verification fee or a seller subscription plan.
 *
 * TODO: set a real STRIPE_SECRET_KEY (test mode to start) via
 *   `wrangler secret put STRIPE_SECRET_KEY` for production, or in
 *   `.env.local` for local `next dev`. Also replace the placeholder
 *   `priceId`s below with real Stripe Price IDs created in the dashboard.
 */

const PRICE_IDS: Record<string, string> = {
  "one-off-check": "price_REPLACE_ONE_OFF_CHECK",
  "human-validation": "price_REPLACE_HUMAN_VALIDATION",
  "seller-starter": "price_REPLACE_SELLER_STARTER",
  "seller-pro": "price_REPLACE_SELLER_PRO",
  "seller-business": "price_REPLACE_SELLER_BUSINESS",
};

const RECURRING_PLANS = new Set(["seller-starter", "seller-pro", "seller-business"]);

export async function POST(request: Request) {
  const { plan, successUrl, cancelUrl } = (await request.json().catch(() => ({}))) as {
    plan?: string;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!plan || !PRICE_IDS[plan]) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey === "sk_test_placeholder") {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Set STRIPE_SECRET_KEY (test mode) to enable checkout.",
        stubbed: true,
      },
      { status: 501 }
    );
  }

  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: RECURRING_PLANS.has(plan) ? "subscription" : "payment",
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: successUrl ?? "https://example.com/dashboard?checkout=success",
    cancel_url: cancelUrl ?? "https://example.com/pricing?checkout=cancelled",
  });

  return NextResponse.json({ url: session.url });
}
