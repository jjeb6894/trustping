import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Claim submissions are not available in this prototype." },
    { status: 410 },
  );
}
