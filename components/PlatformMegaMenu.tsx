"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER, groupAdaptersByCategory } from "@/lib/adapters";

/** Dropdown mega-menu listing every supported platform, grouped by category. */
export function PlatformMegaMenu() {
  const [open, setOpen] = useState(false);
  const grouped = groupAdaptersByCategory();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand-600"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Supported Platforms
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5l4.5 5 4.5-5z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-3 w-[min(92vw,720px)] -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {CATEGORY_ORDER.map((category) => (
              <div key={category}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {CATEGORY_LABELS[category]}
                </p>
                <ul className="space-y-2">
                  {grouped[category].map((adapter) => (
                    <li key={adapter.id}>
                      <Link
                        href={`/search?platform=${adapter.id}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600"
                      >
                        <span aria-hidden>{adapter.icon}</span>
                        {adapter.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
