import { NextResponse } from "next/server";

/**
 * Stripe webhook receiver (stub).
 *
 * TODO: verify the signature with `stripe.webhooks.constructEvent(body, sig,
 * process.env.STRIPE_WEBHOOK_SECRET)` and handle at least:
 *   - checkout.session.completed -> mark subscription/human-validation paid
 *   - customer.subscription.updated/deleted -> sync `subscriptions` table
 */
export async function POST(request: Request) {
  const payload = await request.text();
  // TODO: const event = stripe.webhooks.constructEvent(payload, sig, secret);
  return NextResponse.json({ received: true, stubbed: true, bytes: payload.length });
}
