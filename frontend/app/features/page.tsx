import type { Metadata } from "next";
import Link from "next/link";

import { SoftwareApplicationJsonLd } from "next-seo";

import { MarketingFooter } from "@/components/MarketingFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Features | Hyglow",
  description: "JWT authentication, Neon PostgreSQL, RBAC, admin panel, and employee hierarchy.",
};

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function FeaturesPage() {
  const items = [
    {
      title: "Secure auth",
      body: "Bcrypt password hashing, JWT access tokens, and HTTP-only cookies via a Next.js BFF.",
    },
    {
      title: "Role-based access",
      body: "Super Admin, Admin, Manager, and User roles enforced in FastAPI and reflected in the dashboard.",
    },
    {
      title: "Neon + SQLAlchemy",
      body: "Serverless PostgreSQL with Alembic migrations and a clean ORM layer.",
    },
    {
      title: "Operational UI",
      body: "Tailwind-powered marketing pages and an admin workspace for users and employees.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <SoftwareApplicationJsonLd
        type="SoftwareApplication"
        name="Hyglow"
        description="SaaS starter with Next.js, FastAPI, and Neon."
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        url={site}
        offers={{ price: 0, priceCurrency: "USD" }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Features</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Everything in this repo is structured for production deployment: environment-based config, modular routers, and
          explicit permission checks.
        </p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {items.map((f) => (
            <li key={f.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{f.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12">
          <Link href="/pricing" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
            View pricing →
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
