import type { Metadata } from "next";
import {
  ADDRESS,
  CITY,
  COMPANY_NAME,
  COORDINATES,
  PHONE,
  SITE_NAME,
  SITE_URL,
  UNP,
  WORKING_HOURS,
} from "@/lib/constants";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

type ProductJsonLdInput = {
  name: string;
  description: string;
  price: number;
  currency: string;
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

const absoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }

  return new URL(path, SITE_URL).toString();
};

export function generatePageMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
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
    keywords: [
      "заборы в Беларуси",
      "установка заборов",
      "забор под ключ",
      "профнастил",
      "евроштакетник",
      "сетка-рабица",
      "ворота",
      "Гомель",
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

export function generateProductJsonLd({
  name,
  description,
  price,
  currency,
}: ProductJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: COMPANY_NAME,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: SITE_URL,
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
      item: absoluteUrl(item.url),
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
    mainEntityOfPage: absoluteUrl(url),
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
