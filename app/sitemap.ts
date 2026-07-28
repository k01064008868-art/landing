import type { MetadataRoute } from "next";

const SITE_URL = "https://landing-rho-eight-55.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/og-medispark-hero.png`],
    },
  ];
}
