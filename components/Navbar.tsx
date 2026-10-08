import Link from "next/link";
import { Logo } from "./Logo";
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
        <Link href="/" aria-label="TrustLink home">
          <Logo />
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
