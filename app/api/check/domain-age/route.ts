import { NextResponse } from "next/server";

/**
 * Domain Age & WHOIS Lookup check (stub).
 *
 * TODO: wire up a real WHOIS/RDAP provider, e.g.:
 *   - WhoisXML API (https://whois.whoisxmlapi.com/)
 *   - RDAP (https://rdap.org/) for a free, structured alternative
 * Expected real flow: for listings/profiles backed by their own domain
 * (e.g. an independent storefront or influencer's linked site), look up
 * registration date and flag domains registered in the last few weeks.
 */
export async function POST(request: Request) {
  const { domain } = (await request.json().catch(() => ({}))) as { domain?: string };

  return NextResponse.json({
    type: "domainAgeLookup",
    stubbed: true,
    domain: domain ?? null,
    registeredAt: null,
    note: "TODO: integrate a real WHOIS/RDAP provider (WhoisXML API, rdap.org).",
  });
}
