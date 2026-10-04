import { createHash } from "node:crypto";

interface R2Object {
  body: ReadableStream<Uint8Array>;
  httpMetadata?: { contentType?: string; cacheControl?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(
    key: string,
    value: ArrayBuffer,
    options: { httpMetadata: { contentType: string; cacheControl: string } }
  ): Promise<unknown>;
}

function photoBucket(): R2Bucket | null {
  return (globalThis as unknown as { LISTING_PHOTOS?: R2Bucket }).LISTING_PHOTOS ?? null;
}

function isAllowedAutoTraderHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "autotrader.co.uk" || host.endsWith(".autotrader.co.uk");
}

function parseImageUrl(html: string, pageUrl: URL): URL | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (!/\bproperty\s*=\s*["']og:image["']/i.test(tag) &&
        !/\bname\s*=\s*["']twitter:image["']/i.test(tag)) continue;
    const match = tag.match(/\bcontent\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
    const value = match?.[1] ?? match?.[2] ?? match?.[3];
    if (!value) continue;
    try {
      const imageUrl = new URL(value.replace(/&amp;/g, "&"), pageUrl);
      const host = imageUrl.hostname.toLowerCase();
      const allowedHost = isAllowedAutoTraderHost(host) ||
        host === "atcdn.co.uk" || host.endsWith(".atcdn.co.uk");
      if (imageUrl.protocol === "https:" && allowedHost) return imageUrl;
    } catch {
      // Try the next image metadata tag.
    }
  }
  return null;
}

/**
 * Capture and persist the primary Auto Trader UK listing image in Cloudflare R2.
 * Requires permission to retrieve and store images from the listing source.
 */
export async function saveAutoTraderPhoto(listingUrl: string): Promise<string | null> {
  const bucket = photoBucket();
  if (!bucket) return null;

  let pageUrl: URL;
  try {
    pageUrl = new URL(listingUrl);
  } catch {
    return null;
  }
  if (pageUrl.protocol !== "https:" || !isAllowedAutoTraderHost(pageUrl.hostname)) return null;

  const pageResponse = await fetch(pageUrl, {
    headers: { Accept: "text/html" },
    redirect: "error",
  });
  if (!pageResponse.ok) return null;
  const pageLength = Number(pageResponse.headers.get("content-length") ?? "0");
  if (pageLength > 2_000_000) return null;
  const pageBytes = await pageResponse.arrayBuffer();
  if (pageBytes.byteLength > 2_000_000) return null;

  const imageUrl = parseImageUrl(new TextDecoder().decode(pageBytes), pageUrl);
  if (!imageUrl) return null;

  const imageResponse = await fetch(imageUrl, {
    headers: { Accept: "image/avif,image/webp,image/jpeg,image/png" },
    redirect: "error",
  });
  if (!imageResponse.ok) return null;
  const contentType = (imageResponse.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(contentType)) return null;
  const imageLength = Number(imageResponse.headers.get("content-length") ?? "0");
  if (imageLength > 10_000_000) return null;
  const bytes = await imageResponse.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > 10_000_000) return null;

  const listingKey = createHash("sha256").update(pageUrl.toString()).digest("hex");
  await bucket.put(`autotrader/${listingKey}`, bytes, {
    httpMetadata: { contentType, cacheControl: "public, max-age=3600" },
  });
  return `/api/listing-photo/${listingKey}`;
}

export async function getSavedAutoTraderPhoto(key: string): Promise<R2Object | null> {
  if (!/^[a-f0-9]{64}$/.test(key)) return null;
  return photoBucket()?.get(`autotrader/${key}`) ?? null;
}
