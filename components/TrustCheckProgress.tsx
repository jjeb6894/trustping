"use client";

import { useEffect, useState } from "react";
import type { CheckType } from "@/types";
import { CHECK_LABELS } from "@/lib/scoring";

interface TrustCheckProgressProps {
  checks: CheckType[];
  /** Flip to true once the real result is ready — snaps every step to done. */
  done?: boolean;
  /** Visible step list is capped for readability; extras are summarized. */
  maxVisible?: number;
  stepDurationMs?: number;
  /** When false (default true), plays through the list once then stops instead of looping. */
  loop?: boolean;
  /** Fires once, after the single pass finishes (only used when loop=false). */
  onComplete?: () => void;
}

/**
 * Animated multi-step "Checking…" sequence: cycles through the mini scripts
 * ("Checking reverse image search…", "Checking user profile…", …) one at a
 * time with a three-dot ellipsis. Loops until `done` flips true by default,
 * or plays a single pass and calls `onComplete` when `loop` is false.
 */
export function TrustCheckProgress({
  checks,
  done = false,
  maxVisible = 6,
  stepDurationMs = 650,
  loop = true,
  onComplete,
}: TrustCheckProgressProps) {
  const labels = checks.length > 0 ? checks.map((c) => CHECK_LABELS[c]) : ["URL", "Platform detection", "Trust Check pipeline"];
  const visible = labels.slice(0, maxVisible);
  const extra = labels.length - visible.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (done || finished) return;
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = i + 1;
        if (next >= visible.length) {
          if (!loop) {
            setFinished(true);
            onComplete?.();
            return i;
          }
          return 0;
        }
        return next;
      });
    }, stepDurationMs);
    return () => clearInterval(id);
  }, [done, finished, loop, visible.length, stepDurationMs, onComplete]);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d % 3) + 1), 350);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-sm space-y-2.5 text-left" role="status" aria-live="polite">
      {visible.map((label, i) => {
        const isDone = done || i < activeIndex;
        const isActive = !done && i === activeIndex;
        return (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                isDone
                  ? "bg-emerald-500 text-white"
                  : isActive
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-slate-300"
              }`}
            >
              {isDone ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path d="M8.5 13.1 5.9 10.5 4.8 11.6l3.7 3.7 7-7-1.1-1.1Z" />
                </svg>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <span
              className={`text-sm ${
                isDone ? "text-emerald-700" : isActive ? "font-medium text-slate-900" : "text-slate-400"
              }`}
            >
              Checking {label}
              {isActive && !isDone ? ".".repeat(dots) : ""}
              {isDone ? " — done" : ""}
            </span>
          </div>
        );
      })}
      {extra > 0 && (
        <p className="pl-8 text-xs text-slate-400">+{extra} more checks running…</p>
      )}
    </div>
  );
}
