import { MetadataRoute } from "next";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import { SITE_URL } from "@/lib/constants";

const staticPages = ["/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/${service.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/${city.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries, ...cityEntries];
}
