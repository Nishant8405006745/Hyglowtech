import type { Metadata } from "next";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hyglow Lighting — specialists in electrical bulbs and lamps. Our mission is simple: the right light, every fitting, honest advice.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mesh-lights">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Our story</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-white">About Hyglow</h1>
        <div className="mt-10 space-y-6 text-slate-400 leading-relaxed">
          <p>
            Hyglow began with a straightforward obsession: <strong className="text-slate-200">electrical light sources done right</strong>
            . Not generic “smart home” gadgets — bulbs, tubes, and lamps that electricians and homeowners actually specify:
            correct bases, real lumen figures, and colour temperatures that match the space.
          </p>
          <p>
            Today we stock <strong className="text-slate-200">all major bulb types</strong> — LED retrofit, halogen and
            incandescent where still needed, compact fluorescent and linear tubes for legacy fittings, appliance and
            specialty lamps, plus commercial and weatherproof lines for sites that cannot afford downtime.
          </p>
          <p>
            Our online platform helps trade customers and teams manage accounts, while every product page is written to
            answer the questions you would ask at the counter: wattage equivalents, dimming behaviour, and compatibility.
          </p>
          <p className="rounded-2xl border border-white/10 bg-night-900/60 p-6 text-slate-300">
            <span className="font-display text-lg font-semibold text-amber-200">Promise:</span> if a lamp is listed, it meets
            current electrical safety expectations and ships with clear installation guidance. When in doubt, our team
            helps you match cap type, voltage, and enclosure rating before you order.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
