import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-10 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Hyglow. All rights reserved.</p>
        <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/features" className="hover:text-violet-600 dark:hover:text-violet-400">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-violet-600 dark:hover:text-violet-400">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-violet-600 dark:hover:text-violet-400">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
