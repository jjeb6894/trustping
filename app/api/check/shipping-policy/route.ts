import { NextResponse } from "next/server";

/**
 * Shipping & Refund Policy Risk Check (stub).
 *
 * TODO: wire up real policy-text keyword scanning, e.g.:
 *   - Flag "no returns", "cash only", "local pickup only, no exceptions",
 *     "as-is, no refunds" style language extracted via the adapter's
 *     `selectors.shippingPolicy` / `selectors.returnPolicy` fields
 * Expected real flow: extract the listing's shipping/return policy text
 * and flag language that strips the buyer of standard protections.
 */
export async function POST(request: Request) {
  const { policyText } = (await request.json().catch(() => ({}))) as {
    policyText?: string;
  };

  return NextResponse.json({
    type: "shippingPolicyRiskCheck",
    stubbed: true,
    receivedTextLength: policyText?.length ?? 0,
    redFlagsFound: [],
    note: "TODO: integrate real shipping/return policy keyword scanning for buyer-protection red flags.",
  });
}
