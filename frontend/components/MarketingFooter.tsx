import Link from "next/link";

const links = [
  { href: "/features", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-night-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(251,191,36,0.08),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-semibold text-white">
              Hy<span className="text-amber-300">glow</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Premium electrical bulbs and lighting — LED, smart, halogen, fluorescent, and commercial fittings. Quality
              lumen output, energy efficiency, and expert support for homes and trade.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">Explore</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-amber-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">Account</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/login" className="text-sm text-slate-400 transition-colors duration-200 hover:text-amber-200">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-sm text-slate-400 transition-colors duration-200 hover:text-amber-200">
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-amber-200"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hyglow Lighting. All rights reserved.</p>
          <p className="text-slate-600">Illuminating spaces with every bulb type you need.</p>
        </div>
      </div>
    </footer>
  );
}
