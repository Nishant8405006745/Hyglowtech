"use client";

/** Decorative bulb with soft CSS glow — no external assets. */
export function GlowBulb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 scale-150 rounded-full bg-amber-400/25 blur-3xl animate-glow-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <svg
        viewBox="0 0 120 160"
        className="relative z-10 h-40 w-28 animate-float-soft drop-shadow-[0_0_24px_rgba(251,191,36,0.45)] motion-reduce:animate-none sm:h-52 sm:w-36"
        aria-hidden
      >
        <defs>
          <linearGradient id="bulbGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="45%" stopColor="rgba(254,243,199,0.85)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.35)" />
          </linearGradient>
          <linearGradient id="bulbBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path
          d="M60 8 C32 8 12 32 12 58 C12 78 22 94 36 104 L36 118 C36 124 42 130 50 130 L70 130 C78 130 84 124 84 118 L84 104 C98 94 108 78 108 58 C108 32 88 8 60 8 Z"
          fill="url(#bulbGlass)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="60"
          cy="52"
          rx="22"
          ry="28"
          fill="rgba(251,191,36,0.55)"
          className="animate-glow-pulse motion-reduce:animate-none"
        />
        <path d="M44 118 L76 118 L74 138 L46 138 Z" fill="url(#bulbBase)" />
        <rect x="48" y="136" width="24" height="10" rx="2" fill="#1e293b" />
      </svg>
    </div>
  );
}
