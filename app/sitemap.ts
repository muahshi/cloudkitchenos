import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudkitchenos.in";

// ── Blog slugs (static — in prod, fetch from DB/CMS) ─────────────────────────
const BLOG_SLUGS = [
  "bhopal-cloud-kitchen-case-study",
  "how-to-start-cloud-kitchen-india-2025",
  "fssai-registration-guide-cloud-kitchen",
  "gst-setup-cloud-kitchen-india",
  "day-vs-night-cloud-kitchen-comparison",
  "swiggy-zomato-listing-guide",
  "cloud-kitchen-vs-restaurant-india",
  "ghost-kitchen-investment-guide",
  "best-cuisines-cloud-kitchen-india",
  "cloud-kitchen-packaging-guide",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
