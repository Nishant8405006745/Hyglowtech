import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLdOrg } from "@/components/JsonLdOrg";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Hyglow — Team operations SaaS starter",
  description:
    "Production-ready starter with Next.js, FastAPI, Neon PostgreSQL, JWT auth, and role-based dashboards.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <JsonLdOrg />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-2xl animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-2xl shadow-md shadow-violet-500/10 ring-1 ring-violet-200/50 dark:ring-violet-800/50">
              <Image src="/hyglow-logo.png" alt="Hyglow" width={96} height={96} className="h-full w-full object-contain" priority />
            </span>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">Hyglow</p>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 transition-colors dark:text-white sm:text-5xl">
            Ship your SaaS faster with roles, users, and teams built in.
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Next.js frontend, FastAPI backend, Neon PostgreSQL, JWT cookies, and Super Admin → User access control — ready
            for Vercel and your favorite API host.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40"
            >
              Start free
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-violet-700 dark:hover:bg-zinc-800"
            >
              Explore features
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
