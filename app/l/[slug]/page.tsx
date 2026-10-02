import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeDirectorySlug } from "@/lib/directory-slug";
import { ScoreGauge } from "@/components/ScoreGauge";
import { TrustBadge } from "@/components/TrustBadge";
import { LISTING_KIND_LABELS } from "@/types";

export default function PublicListingPage({ params }: { params: { slug: string } }) {
  const entry = decodeDirectorySlug(params.slug);
  if (!entry) notFound();

  const kindCopy: Record<string, string> = {
    profile: "This profile has been Trust Checked",
    company: "This company has been Trust Checked",
    listing: "This listing has been Trust Checked",
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/search" className="text-sm text-brand-600 hover:underline">
        ← Run your own Trust Check
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {LISTING_KIND_LABELS[entry.kind]} · {entry.platformName}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{entry.displayName}</h1>
        <p className="mt-1 truncate text-sm text-slate-500">{entry.url}</p>

        <div className="mt-6 flex justify-center">
          <ScoreGauge score={entry.score} tier={entry.tier} />
        </div>
        <div className="mt-4 flex justify-center">
          <TrustBadge tier={entry.tier} label={entry.tierLabel} size="lg" />
        </div>

        <p className="mt-6 text-sm text-slate-600">
          {kindCopy[entry.kind]} by TrustPing — {entry.checksPassed} of {entry.checksTotal}{" "}
          automated checks passed.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Verified {new Date(entry.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm font-medium text-slate-700">Own this {entry.kind}?</p>
          <Link
            href="/search"
            className="mt-2 inline-block rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Run a new Trust Check
          </Link>
        </div>
      </div>
    </div>
  );
}
