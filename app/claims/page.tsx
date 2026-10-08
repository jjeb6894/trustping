import Link from "next/link";

export default function ClaimsPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Claims are not available</h1>
      <p className="mt-3 text-slate-600">
        TrustLink is a prototype. It does not provide insurance coverage or accept claim
        submissions. Do not send personal or transaction details through this site.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:underline">
        Return home
      </Link>
    </div>
  );
}
