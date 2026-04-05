import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | Hyglow",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-violet-600 transition-opacity hover:opacity-90 dark:text-violet-400"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-lg ring-1 ring-violet-200/60 dark:ring-violet-800/60">
              <Image src="/hyglow-logo.png" alt="Hyglow" width={72} height={72} className="h-full w-full object-contain" />
            </span>
            Hyglow
          </Link>
          <nav className="text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">
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
