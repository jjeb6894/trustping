type MarkProps = { className?: string };

/** TrustLink mark: a shield (trust) whose check stroke is joined by a link node. */
export function LogoMark({ className = "h-8 w-8" }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" className="fill-brand-500" />
      <path
        d="M16 5.5 7.5 8.6v6.3c0 5.2 3.5 9.2 8.5 10.6 5-1.4 8.5-5.4 8.5-10.6V8.6L16 5.5Z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m11.6 15.8 3 3 5.8-5.9"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11.6" cy="15.8" r="1.9" className="fill-brand-500" stroke="#fff" strokeWidth="1.6" />
      <circle cx="20.4" cy="12.9" r="1.9" className="fill-brand-500" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

/** Mark + "TrustLink" wordmark. The visible wordmark is the accessible name. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-lg font-bold tracking-tight text-slate-900">
        Trust<span className="text-brand-600">Link</span>
      </span>
    </span>
  );
}
