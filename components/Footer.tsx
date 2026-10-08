import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-500">
            Preview the planned TrustLink workflow. All listings and scores shown are sample data.
          </p>
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
            Prototype only: all scores are simulated. TrustLink does not currently verify
            listings, provide insurance, accept claims, or offer paid services.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TrustLink prototype.
      </div>
    </footer>
  );
}
