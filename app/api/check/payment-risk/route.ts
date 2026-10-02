import { NextResponse } from "next/server";

/**
 * Payment Method Risk Check (stub).
 *
 * TODO: wire up real keyword/pattern scanning of listing + messages, e.g.:
 *   - Flag requests for wire transfer, gift cards, crypto, or "friends &
 *     family" payments — all unrecoverable, high-risk payment rails
 *   - Cross-reference with payment-processor risk-scoring APIs where available
 * Expected real flow: scan listing text and any buyer/seller messages for
 * high-risk payment requests and score down accordingly.
 */
export async function POST(request: Request) {
  const { listingText } = (await request.json().catch(() => ({}))) as {
    listingText?: string;
  };

  return NextResponse.json({
    type: "paymentRiskCheck",
    stubbed: true,
    receivedTextLength: listingText?.length ?? 0,
    riskyPaymentMethodsFound: [],
    note: "TODO: integrate real keyword/pattern scanning for high-risk payment requests (wire/gift card/crypto).",
  });
}
