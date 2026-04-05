"use client";

import { OrganizationJsonLd } from "next-seo";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Organization structured data via next-seo (complements App Router `metadata`). */
export function JsonLdOrg() {
  return (
    <OrganizationJsonLd
      type="Organization"
      name="Hyglow Lighting"
      url={site}
      logo={`${site}/hyglow-logo.png`}
      description="Electrical bulbs and lighting supplier — LED, smart, halogen, fluorescent, tube, specialty, and commercial lamps for homes and trade."
    />
  );
}
