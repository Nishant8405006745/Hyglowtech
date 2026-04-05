"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/features", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night-950/85 backdrop-blur-xl transition-[background,box-shadow] duration-300 supports-[backdrop-filter]:bg-night-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white transition-transform duration-300 ease-out-expo hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-amber-400/30 to-cyan-400/20 p-0.5 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40 transition-shadow duration-400 group-hover:shadow-amber-400/35">
            <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-night-900/90">
              <Image src="/hyglow-logo.png" alt="Hyglow" width={72} height={72} className="h-full w-full object-contain" />
            </span>
          </span>
          <span className="font-display text-xl tracking-tight">
            Hy<span className="text-amber-300">glow</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-amber-200"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="ml-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-400/40 hover:brightness-105"
          >
            Trade account
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition-colors hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/5 bg-night-950/95 backdrop-blur-xl transition-all duration-300 ease-out-expo md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-amber-200"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="mt-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-center text-sm font-semibold text-night-950"
            onClick={() => setOpen(false)}
          >
            Open trade account
          </Link>
        </nav>
      </div>
    </header>
  );
}
