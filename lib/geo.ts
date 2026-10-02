const DEFAULT_COUNTRY = "US";

/**
 * Resolves the visitor's two-letter country code from IP geolocation.
 *
 * Cloudflare Pages/Workers automatically set `cf-ipcountry` on every
 * incoming request — no external IP-lookup API or key required once this
 * is deployed. `?country=MT` (or any other request header below) can
 * override it, which is useful for local dev where `cf-ipcountry` isn't
 * present.
 */
export function resolveCountryCode(
  override: string | null | undefined,
  headers: { get(name: string): string | null }
): string {
  if (override) return override.toUpperCase();

  const candidates = [
    headers.get("cf-ipcountry"), // Cloudflare Pages / Workers (production)
    headers.get("x-vercel-ip-country"), // kept for parity if ever previewed elsewhere
    headers.get("x-country-code"),
  ];

  const found = candidates.find((code) => code && code !== "XX");
  return (found ?? DEFAULT_COUNTRY).toUpperCase();
}
