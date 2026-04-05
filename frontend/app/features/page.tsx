import type { Metadata } from "next";
import Link from "next/link";

import { SoftwareApplicationJsonLd } from "next-seo";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Products & services",
  description:
    "LED, smart, halogen, fluorescent, tube, specialty, and commercial electrical lighting from Hyglow — specs, trade accounts, and reliable supply.",
};

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const items = [
  {
    title: "Full bulb & lamp range",
    body: "E27, E14, B22, GU10, MR16, G9, linear tubes, PL-C, capsules, and more — one catalogue covering residential through industrial.",
  },
  {
    title: "Energy & compliance",
    body: "High-efficiency LED lines, clear EU energy labels where applicable, and product data for building regulations and ESOS reporting.",
  },
  {
    title: "Smart lighting",
    body: "App and hub-based lamps, tunable white, RGB scenes, and integration-friendly options for modern installs.",
  },
  {
    title: "Trade & team accounts",
    body: "Role-based access for buyers, site managers, and administrators — manage who can place orders and view project pricing.",
  },
  {
    title: "Technical clarity",
    body: "Lumens, kelvin, CRI, beam angles, and dimmer compatibility spelled out so you order once and fit with confidence.",
  },
  {
    title: "Commercial & emergency",
    body: "Bulkheads, high-bay, flood, non-maintained and maintained emergency gear — specified for warehouses, car parks, and public buildings.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-mesh-lights">
      <SoftwareApplicationJsonLd
        type="SoftwareApplication"
        name="Hyglow Lighting"
        description="Electrical bulbs and lighting — LED, smart, halogen, fluorescent, commercial."
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        url={site}
        offers={{ price: 0, priceCurrency: "USD" }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Catalogue & platform</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">What we offer</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Hyglow is built around <strong className="font-medium text-slate-200">electrical light sources</strong> — not
          furniture, not wiring — so our range and tools stay focused on bulbs, tubes, and lamps that actually ship to site.
        </p>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((f) => (
            <li
              key={f.title}
              className="rounded-2xl border border-white/10 bg-night-900/50 p-7 transition-all duration-300 hover:border-amber-400/25 hover:bg-night-900/80"
            >
              <h2 className="font-display text-xl font-semibold text-white">{f.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-14">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 font-semibold text-amber-400 transition-colors hover:text-amber-300"
          >
            See pricing
            <span aria-hidden>→</span>
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
