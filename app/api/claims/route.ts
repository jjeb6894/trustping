import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import type { ClaimSubmission } from "@/types";

/**
 * Submits an Insured Verified claim.
 *
 * TODO: persist into D1 `claims` table (see migrations/0001_init.sql) and
 * notify the admin review queue (app/admin). For now this just validates
 * input and echoes back a pending claim record.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<ClaimSubmission>;

  if (!body.listingUrl || !body.claimantEmail || !body.amount) {
    return NextResponse.json(
      { error: "listingUrl, claimantEmail and amount are required." },
      { status: 400 }
    );
  }

  const claim: ClaimSubmission = {
    id: randomUUID(),
    listingUrl: body.listingUrl,
    trustScoreId: body.trustScoreId,
    claimantName: body.claimantName ?? "",
    claimantEmail: body.claimantEmail,
    amount: body.amount,
    currency: body.currency ?? "usd",
    description: body.description ?? "",
    status: "pending",
  };

  // TODO: INSERT INTO claims (...) VALUES (...)

  return NextResponse.json({ claim }, { status: 201 });
}
