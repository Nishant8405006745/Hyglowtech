import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
  description: "Hyglow Lighting — workspace for orders, team, and bulb catalogue access.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-mesh-lights">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-gradient-to-br from-amber-400/30 to-cyan-400/20 p-0.5 ring-1 ring-amber-400/40 transition-shadow group-hover:shadow-amber-500/20">
              <span className="flex h-full w-full items-center justify-center rounded-md bg-night-900">
                <Image src="/hyglow-logo.png" alt="Hyglow" width={72} height={72} className="h-full w-full object-contain" />
              </span>
            </span>
            <span className="font-display">
              Hy<span className="text-amber-300">glow</span>
            </span>
          </Link>
          <nav className="text-sm text-slate-400">
            <Link href="/pricing" className="transition-colors hover:text-amber-200">
              Pricing
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <DashboardShell />
      </main>
    </div>
  );
}
