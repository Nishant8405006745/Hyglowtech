"use client";

import { OrganizationJsonLd } from "next-seo";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Organization structured data via next-seo (complements App Router `metadata`). */
export function JsonLdOrg() {
  return (
    <OrganizationJsonLd
      type="Organization"
      name="Hyglow"
      url={site}
      logo={`${site}/favicon.ico`}
      description="Hyglow — team operations SaaS starter with roles, users, and employees."
    />
  );
}
