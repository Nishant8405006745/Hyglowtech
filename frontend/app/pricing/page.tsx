import type { Metadata } from "next";
import Link from "next/link";

import { FAQJsonLd } from "next-seo";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Hyglow Lighting — trade-friendly plans for electrical bulb supply. Starter access, pro buying, and enterprise-scale options.",
};

const faqs = [
  {
    question: "Do you sell only bulbs and lamps?",
    answer:
      "Yes. Hyglow specialises in electrical light sources: LED, halogen, smart, fluorescent, tubes, specialty, and commercial lamps — not fixtures or cable.",
  },
  {
    question: "Can my team share one account?",
    answer:
      "Yes. Create accounts with roles for buyers, managers, and admins so ordering and approvals stay organised across sites.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-mesh-lights">
      <FAQJsonLd
        scriptKey="pricing-faq"
        questions={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Plans</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Simple pricing for brighter supply</h1>
        <p className="mt-4 max-w-xl text-slate-400">
          Start online for free, then scale to pro volumes when your projects grow. All plans include access to our full electrical
          bulb and lamp catalogue.
        </p>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-amber-400/25 bg-gradient-to-b from-night-800/80 to-night-950/90 p-8 shadow-xl shadow-amber-500/5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">Starter</h2>
            <p className="mt-2 font-display text-4xl font-bold text-amber-300">£0</p>
            <p className="mt-2 text-sm text-slate-400">Register and buy at list prices — ideal for homeowners and small jobs.</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-amber-400" aria-hidden>
                  ✓
                </span>
                Full bulb & tube catalogue
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400" aria-hidden>
                  ✓
                </span>
                Order history & invoices
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400" aria-hidden>
                  ✓
                </span>
                Technical specs on every SKU
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-105 sm:w-auto sm:px-8"
            >
              Create free account
            </Link>
          </div>
          <div className="rounded-3xl border border-dashed border-white/20 bg-night-900/30 p-8 transition-colors duration-300 hover:border-cyan-400/30 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">Trade & enterprise</h2>
            <p className="mt-3 text-slate-400">
              Volume pricing, consolidated billing, multi-site delivery, and dedicated support for contractors, FM teams, and
              retailers ordering electrical lamps at scale.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-cyan-400" aria-hidden>
                  →
                </span>
                Custom price lists per account
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400" aria-hidden>
                  →
                </span>
                API & EDI-friendly workflows (on request)
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400" aria-hidden>
                  →
                </span>
                Account manager for large rollouts
              </li>
            </ul>
            <p className="mt-8 text-sm text-slate-500">Contact us after signup from your dashboard — we will match your project size.</p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
