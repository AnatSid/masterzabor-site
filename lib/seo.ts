import type { Metadata } from "next";
import {
  ADDRESS,
  CITY,
  COMPANY_NAME,
  COORDINATES,
  LOGO_PATH,
  PHONE,
  SITE_NAME,
  SITE_URL,
  UNP,
  WORKING_HOURS,
} from "@/lib/constants";
import { canonicalUrl } from "@/lib/url";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

type ProductJsonLdInput = {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

type ArticleJsonLdInput = {
  title: string;
  description: string;
  date: string;
  url: string;
};

const DEFAULT_IMAGE = "/images/og-masterzabor.jpg";
const URI_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

const absoluteUrl = (path: string) => {
  if (URI_SCHEME_PATTERN.test(path)) {
    return path;
  }

  return canonicalUrl(path);
};

export function generatePageMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  keywords = [],
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    icons: {
      icon: [
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      other: [
        { rel: "manifest", url: "/manifest.webmanifest" },
        {
          rel: "mask-icon",
          url: "/icon.svg",
          color: "#1B5E20",
        },
      ],
    },
    keywords: [
      "заборы в Беларуси",
      "установка заборов",
      "забор под ключ",
      "профнастил",
      "евроштакетник",
      "сетка-рабица",
      "ворота",
      "Гомель",
      ...keywords,
    ],
    openGraph: {
      type: "website",
      locale: "ru_BY",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${COMPANY_NAME} — установка заборов в Беларуси`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY_NAME,
    url: SITE_URL,
    telephone: PHONE,
    priceRange: "$$",
    taxID: UNP,
    address: {
      "@type": "PostalAddress",
      streetAddress: "пр. Речицкий, 7А, оф. 5.11",
      addressLocality: CITY,
      postalCode: "246027",
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COORDINATES.lat,
      longitude: COORDINATES.lng,
    },
    openingHours: "Mo-Su 10:00-19:00",
    description: `${COMPANY_NAME}: установка заборов, ворот и калиток под ключ в Беларуси. ${ADDRESS}. Режим работы: ${WORKING_HOURS}.`,
    areaServed: {
      "@type": "Country",
      name: "Беларусь",
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    image: absoluteUrl(LOGO_PATH),
    telephone: PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "пр. Речицкий, 7А, оф. 5.11",
      addressLocality: CITY,
      postalCode: "246027",
      addressCountry: "BY",
    },
    areaServed: "BY",
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "ru-BY",
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl("/blog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductJsonLd({
  name,
  description,
  image,
  price,
  currency,
  url,
}: ProductJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteUrl(image),
    brand: {
      "@type": "Brand",
      name: COMPANY_NAME,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: canonicalUrl(url),
    },
  };
}

export function generateFaqJsonLd(items: ReadonlyArray<FaqItem>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(items: ReadonlyArray<BreadcrumbItem>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.url),
    })),
  };
}

export function generateArticleJsonLd({
  title,
  description,
  date,
  url,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: canonicalUrl(url),
    author: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
  };
}
