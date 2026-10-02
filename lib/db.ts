/**
 * Minimal Cloudflare D1 access helper.
 *
 * On Cloudflare Pages, the `DB` binding (see wrangler.toml) is attached to
 * the incoming request context. Next.js route handlers running via
 * @cloudflare/next-on-pages can read it off `process.env` thanks to the
 * `nodejs_compat` + Pages bindings proxy, or via `getRequestContext()` from
 * `@cloudflare/next-on-pages` in production.
 *
 * TODO: once deployed, swap `getDb()` below to use
 *   import { getRequestContext } from "@cloudflare/next-on-pages";
 *   return getRequestContext().env.DB as D1Database;
 * For local `next dev` (no Workers runtime), this returns `null` and callers
 * fall back to in-memory/mock data — see lib/mock-data.ts.
 */

export interface D1DatabaseLike {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      run: () => Promise<unknown>;
      all: <T = unknown>() => Promise<{ results: T[] }>;
      first: <T = unknown>() => Promise<T | null>;
    };
  };
}

export function getDb(): D1DatabaseLike | null {
  const globalWithEnv = globalThis as unknown as { DB?: D1DatabaseLike };
  return globalWithEnv.DB ?? null;
}
