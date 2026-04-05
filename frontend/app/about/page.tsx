import type { Metadata } from "next";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About | Hyglow",
  description: "Hyglow is a production-oriented SaaS starter for teams who want control over auth and data.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">About Hyglow</h1>
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          Hyglow demonstrates a clean split between a Next.js experience layer and a FastAPI domain API. Passwords never
          leave the server except as secure hashes; JWTs are issued by the API and can be held in HTTP-only cookies through
          the Next.js BFF pattern implemented here.
        </p>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          The database schema includes a normalized <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">roles</code>{" "}
          table and links users and employees so managers only see their direct reports unless they are administrators.
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
