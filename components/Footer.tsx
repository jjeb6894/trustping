import Link from "next/link";
import { LogoBubble } from "@/components/LogoBubble";
import { FOUNDED_YEAR, yearsActive } from "@/lib/site-meta";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-slate-900">TrustPing</p>
          <p className="mt-2 text-sm text-slate-500">
            Paste any listing or profile link. Get a Trust Score in seconds.
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
            Est. {FOUNDED_YEAR} · {yearsActive()}+ years in operation
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
            <LogoBubble name="Stripe" domain="stripe.com" size={16} shape="square" />
            <LogoBubble name="Cloudflare" domain="cloudflare.com" size={16} shape="square" />
            <span>Payments &amp; infrastructure partners</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/search" className="hover:text-brand-600">Trust Check</Link></li>
            <li><Link href="/pricing" className="hover:text-brand-600">Pricing</Link></li>
            <li><Link href="/claims" className="hover:text-brand-600">Claims</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-brand-600">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><span className="cursor-default">Privacy Policy</span></li>
            <li><span className="cursor-default">Terms of Service</span></li>
            <li><span className="cursor-default">Security</span></li>
          </ul>
          <p className="mt-3 text-sm text-slate-500">
            Insured Verified claims are subject to review. TrustPing is a demo scaffold —
            replace this copy before launch.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {FOUNDED_YEAR}–{new Date().getFullYear()} TrustPing. All rights reserved.
      </div>
    </footer>
  );
}
