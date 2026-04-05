import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-violet-600 transition-opacity hover:opacity-90 dark:text-violet-400"
        >
          <span className="relative h-9 w-9 overflow-hidden rounded-lg ring-1 ring-violet-200/60 dark:ring-violet-800/60">
            <Image src="/hyglow-logo.png" alt="Hyglow logo" width={72} height={72} className="h-full w-full object-contain" />
          </span>
          Hyglow
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/features" className="hover:text-zinc-900 dark:hover:text-white">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white">
            About
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-violet-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-violet-500"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
