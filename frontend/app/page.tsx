import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GlowBulb } from "@/components/GlowBulb";
import { JsonLdOrg } from "@/components/JsonLdOrg";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Hyglow — Every electrical bulb & light you need",
  description:
    "LED, smart, halogen, fluorescent, tube, and commercial lighting. Hyglow supplies quality electrical bulbs with expert guidance for homes, offices, and trade professionals.",
};

const categories = [
  {
    title: "LED & energy-saving",
    desc: "A++ rated lamps, dimmable spots, and retrofit bulbs that cut bills without losing warmth.",
  },
  {
    title: "Smart & connected",
    desc: "Wi‑Fi and Zigbee bulbs, tunable white, scenes, and voice-ready for modern homes.",
  },
  {
    title: "Halogen & incandescent",
    desc: "Classic brightness and colour rendering for display, hospitality, and heritage fittings.",
  },
  {
    title: "Fluorescent & tubes",
    desc: "T5, T8, compact PL lamps, and ballast-compatible options for offices and retail.",
  },
  {
    title: "Specialty lamps",
    desc: "Oven, fridge, appliance, UV, plant-grow, and low-voltage capsules — hard-to-find sizes stocked.",
  },
  {
    title: "Commercial & industrial",
    desc: "High-bay, flood, bulkhead, emergency, and weatherproof gear for sites and warehouses.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh-lights">
      <JsonLdOrg />
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:pb-28 sm:pt-14 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl motion-reduce:opacity-50"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/40 to-cyan-400/30 p-0.5 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50">
                  <span className="flex h-full w-full items-center justify-center rounded-[14px] bg-night-900">
                    <Image
                      src="/hyglow-logo.png"
                      alt="Hyglow Lighting"
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </span>
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Electrical lighting</p>
              </div>
              <h1 className="font-display mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                Bright ideas start with the <span className="text-amber-300">right bulb</span>.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                Hyglow is your specialist for <strong className="font-medium text-slate-200">every type of electrical bulb and lamp</strong>{" "}
                — from cosy warm LEDs to industrial high-bays. One trusted source for homes, contractors, and businesses.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-7 py-3.5 text-base font-semibold text-night-950 shadow-xl shadow-amber-500/30 transition-all duration-300 ease-out-expo hover:scale-[1.02] hover:shadow-amber-400/40 active:scale-[0.98]"
                >
                  Open trade account
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 hover:bg-white/10 hover:text-amber-100"
                >
                  Browse range
                </Link>
              </div>
              <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 sm:max-w-lg">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Bulb types</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-amber-200">50+</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Efficiency</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-cyan-300">A++</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Support</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-white">24/7</dd>
                </div>
              </dl>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <GlowBulb className="lg:pr-8" />
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-night-900/50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-center text-3xl font-semibold text-white sm:text-4xl">
              Every category, <span className="text-amber-300">one catalogue</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              Whether you are replacing a single bedside lamp or specifying an entire office retrofit, we stock the electrical
              light sources you need — with clear specs and honest lumen ratings.
            </p>
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <li
                  key={c.title}
                  className="card-lift group rounded-2xl border border-white/10 bg-night-950/60 p-6 backdrop-blur-sm"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/25 to-cyan-400/15 ring-1 ring-amber-400/30 transition-transform duration-300 group-hover:scale-105"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white transition-colors group-hover:text-amber-200">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-night-900/80 to-cyan-500/10 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Ready to light your next project?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Create a Hyglow account for quotes, repeat orders, and team access. Same quality bulbs — smoother workflow for
              electricians and facilities teams.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-night-950 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-white/20"
              >
                Get started
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-amber-300/50 hover:text-amber-100"
              >
                View plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
