import { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog-posts";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import { SITE_URL } from "@/lib/constants";

const rootPages = ["/"] as const;
const otherPages = ["/tseny/", "/nashi-raboty/", "/otzyvy/", "/kontakty/"] as const;
const blogRootPage = ["/blog/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const rootEntries: MetadataRoute.Sitemap = rootPages.map((path) => ({
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

  const otherEntries: MetadataRoute.Sitemap = otherPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRootEntries: MetadataRoute.Sitemap = blogRootPage.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...rootEntries,
    ...serviceEntries,
    ...cityEntries,
    ...blogRootEntries,
    ...blogPostEntries,
    ...otherEntries,
  ];
}
