"use client";

import { useEffect, useState } from "react";
import type { CountryBrandBoard } from "@/types";

/**
 * Fetches the visitor's country-specific "Local Trust Board" once and
 * shares the loading/result state with whichever component calls it.
 * The actual country detection happens server-side in
 * app/api/local-brands/route.ts via the request's IP (see lib/geo.ts).
 */
export function useCountryBrandBoard() {
  const [board, setBoard] = useState<CountryBrandBoard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/local-brands")
      .then((res) => (res.ok ? (res.json() as Promise<CountryBrandBoard>) : null))
      .then((data) => {
        if (!cancelled) setBoard(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { board, loading };
}
