import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hyglow Lighting — Electrical bulbs & lamps",
    template: "%s | Hyglow Lighting",
  },
  description:
    "Hyglow — premium electrical lighting: LED, smart bulbs, halogen, CFL, tube lights, and commercial fittings. Energy-efficient, trade-ready, delivered with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${fraunces.variable} min-h-screen bg-night-950 antialiased text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
