import type { Metadata } from "next";
import Link from "next/link";

import { FAQJsonLd } from "next-seo";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing | Hyglow",
  description: "Transparent starter pricing — deploy Hyglow on Vercel and your API host.",
};

const faqs = [
  {
    question: "Is Hyglow a hosted product?",
    answer: "This repository is a self-hosted starter. You connect your own Neon database and deploy the API where you prefer.",
  },
  {
    question: "What is included?",
    answer: "Authentication, RBAC, user and employee APIs, Alembic migrations, and a Tailwind dashboard.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FAQJsonLd
        scriptKey="pricing-faq"
        questions={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Pricing</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Starter kit — bring your own infrastructure.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Developer</h2>
            <p className="mt-2 text-3xl font-bold text-violet-600 dark:text-violet-400">$0</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Fork, customize, and deploy under your license.</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>✓ Full source</li>
              <li>✓ Neon + FastAPI + Next.js</li>
              <li>✓ Role-based admin UI</li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Get started
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Team / Enterprise</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Extend with billing, audit logs, and SSO. This template keeps the core small so you can add what you need.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
