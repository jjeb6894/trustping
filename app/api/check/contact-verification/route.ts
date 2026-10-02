import { NextResponse } from "next/server";

/**
 * Contact Info Verification check (stub).
 *
 * TODO: wire up real phone/email validation, e.g.:
 *   - Twilio Lookup API (https://www.twilio.com/docs/lookup) for phone validation
 *   - NeverBounce / ZeroBounce for email deliverability checks
 * Expected real flow: extract any listed phone number or email, validate
 * format + reachability, and flag disposable emails or VOIP/burner numbers.
 */
export async function POST(request: Request) {
  const { email, phone } = (await request.json().catch(() => ({}))) as {
    email?: string;
    phone?: string;
  };

  return NextResponse.json({
    type: "contactInfoVerification",
    stubbed: true,
    email: email ?? null,
    phone: phone ?? null,
    note: "TODO: integrate real phone/email validation (Twilio Lookup, NeverBounce/ZeroBounce).",
  });
}
