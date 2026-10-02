import Link from "next/link";
import { PlatformMegaMenu } from "./PlatformMegaMenu";

const NAV_LINKS = [
  { href: "/search", label: "Trust Check" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/claims", label: "Claims" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
              <path d="M10 1.5 3 4v5.2c0 4.6 3 8.3 7 9.3 4-1 7-4.7 7-9.3V4l-7-2.5Zm-.9 11.8L6 10.2l1.1-1.1 2 1.9 4-4 1.1 1.1-5.1 5.2Z" />
            </svg>
          </span>
          TrustPing
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <PlatformMegaMenu />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/search"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          Check a listing
        </Link>
      </div>
    </header>
  );
}
