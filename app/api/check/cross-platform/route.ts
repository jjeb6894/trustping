import { NextResponse } from "next/server";

/**
 * Cross-Platform Identity Match check (stub).
 *
 * TODO: wire up real cross-referencing logic, e.g.:
 *   - Search other supported platforms for a matching seller/profile name,
 *     avatar (via reverse image search), bio text, or linked contact info.
 *   - Consider a dedicated identity-graph provider (e.g. Pipl, FullContact)
 *     for consented, compliant lookups.
 * Expected real flow: given a seller/profile name + avatar from the source
 * adapter, query the other adapters' public pages for consistent identity
 * signals and return a confidence score.
 */
export async function POST(request: Request) {
  const { name, avatarUrl } = (await request.json().catch(() => ({}))) as {
    name?: string;
    avatarUrl?: string;
  };

  return NextResponse.json({
    type: "crossPlatformMatch",
    stubbed: true,
    queriedName: name ?? null,
    queriedAvatar: avatarUrl ?? null,
    matchedPlatforms: [],
    note: "TODO: implement real cross-platform identity matching.",
  });
}
