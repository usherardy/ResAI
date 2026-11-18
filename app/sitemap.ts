import type { MetadataRoute } from "next";
import { PRIVACY_NOTICE_VERSION, siteConfig } from "@/lib/site";

// ISO date (UTC) so the sitemap date never shifts with the server time zone.
const lastModified = new Date(`${PRIVACY_NOTICE_VERSION}T00:00:00Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
