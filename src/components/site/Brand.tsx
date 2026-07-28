import { Link } from "@tanstack/react-router";

export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Hands & Balance Wellness Center emblem"
    >
      <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M24 8c-4.5 5.2-6.8 9.6-6.8 13.6 0 4 3 6.9 6.8 6.9s6.8-2.9 6.8-6.9c0-4-2.3-8.4-6.8-13.6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M13 33c3.4 3.4 7.1 5.1 11 5.1s7.6-1.7 11-5.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 text-primary" aria-label="Hands & Balance Wellness Center — home">
      <BrandMark className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="leading-tight">
        <span className="block font-display text-lg font-medium tracking-tight text-primary-deep sm:text-xl">
          Hands &amp; Balance
        </span>
        <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
          Wellness Center
        </span>
      </span>
    </Link>
  );
}
