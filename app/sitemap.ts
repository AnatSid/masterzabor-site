import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog-posts";
import { cities } from "@/content/cities";
import {
  homepageFeaturedProjects,
  projects,
} from "@/content/projects";
import { services } from "@/content/services";
import { getCityProjectProof } from "@/lib/city-project-proof";
import {
  type IsoDate,
  latestMeaningfulDate,
  sitemapFreshness,
} from "@/lib/sitemap-freshness";
import { canonicalUrl } from "@/lib/url";

const rootPages = ["/"] as const;
const otherPages = ["/tseny", "/nashi-raboty", "/otzyvy", "/kontakty"] as const;
const blogRootPage = ["/blog"] as const;

function withLastModified(lastModified: IsoDate | undefined) {
  return lastModified ? { lastModified } : {};
}

const homepageLastModified = latestMeaningfulDate(
  sitemapFreshness.templates.homepage,
  sitemapFreshness.groups.serviceCardsUpdatedAt,
  ...homepageFeaturedProjects.map((project) => project.updatedAt),
);

const pricesLastModified = latestMeaningfulDate(
  sitemapFreshness.templates.pricesPage,
  sitemapFreshness.groups.serviceCardsUpdatedAt,
  sitemapFreshness.groups.serviceProductDataUpdatedAt,
);

const portfolioLastModified = latestMeaningfulDate(
  sitemapFreshness.templates.portfolioPage,
  ...projects.map((project) => project.updatedAt),
);

const blogIndexLastModified = latestMeaningfulDate(
  sitemapFreshness.templates.blogIndex,
  ...blogPosts.map((post) => post.updatedAt ?? post.publishedAt),
);

function getOtherPageLastModified(
  path: (typeof otherPages)[number],
): IsoDate | undefined {
  switch (path) {
    case "/tseny":
      return pricesLastModified;
    case "/nashi-raboty":
      return portfolioLastModified;
    case "/otzyvy":
    case "/kontakty":
      return sitemapFreshness.static[path];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rootEntries: MetadataRoute.Sitemap = rootPages.map((path) => ({
    url: canonicalUrl(path),
    ...withLastModified(homepageLastModified),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: canonicalUrl("/" + service.slug),
    ...withLastModified(
      latestMeaningfulDate(
        service.detailUpdatedAt,
        sitemapFreshness.templates.servicePage,
        sitemapFreshness.groups.serviceCardsUpdatedAt,
      ),
    ),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => {
    const cityProof = getCityProjectProof(city, projects);

    return {
      url: canonicalUrl("/" + city.slug),
      ...withLastModified(
        latestMeaningfulDate(
          city.updatedAt,
          sitemapFreshness.templates.cityPage,
          ...cityProof.projects.map((project) => project.updatedAt),
          sitemapFreshness.groups.serviceCardsUpdatedAt,
        ),
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  const otherEntries: MetadataRoute.Sitemap = otherPages.map((path) => ({
    url: canonicalUrl(path),
    ...withLastModified(getOtherPageLastModified(path)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRootEntries: MetadataRoute.Sitemap = blogRootPage.map((path) => ({
    url: canonicalUrl(path),
    ...withLastModified(blogIndexLastModified),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: canonicalUrl("/blog/" + post.slug),
    ...withLastModified(
      latestMeaningfulDate(
        post.updatedAt ?? post.publishedAt,
        sitemapFreshness.templates.blogArticle,
      ),
    ),
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
