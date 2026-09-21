import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { COORDINATES } from "@/lib/constants";
import {
  generateLocalBusinessJsonLd,
  generateOrganizationJsonLd,
  generatePageMetadata,
  generateWebsiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Заборы в Гомеле — установка под ключ | МастерЗабор",
    description:
      "Установка заборов в Гомеле и по Беларуси под ключ. Профнастил, евроштакетник, сетка-рабица, ворота и калитки с гарантией.",
    path: "/",
  }),
  other: {
    "geo.region": "BY",
    "geo.placename": "Гомель, Беларусь",
    "geo.position": `${COORDINATES.lat};${COORDINATES.lng}`,
    ICBM: `${COORDINATES.lat}, ${COORDINATES.lng}`,
  },
};

const localBusinessJsonLd = generateLocalBusinessJsonLd();
const organizationJsonLd = generateOrganizationJsonLd();
const websiteJsonLd = generateWebsiteJsonLd();
const ymId = process.env.NEXT_PUBLIC_YM_ID;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replaceAll("<", "\\u003c"),
          }}
        />
        {ymId ? (
          <>
            <Script id="yandex-metrika" strategy="beforeInteractive">
              {`
              window.ym = window.ym || function(){
                (window.ym.a = window.ym.a || []).push(arguments);
              };
              window.ym.l = 1 * new Date();
              window.ym(${JSON.stringify(ymId)}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `}
            </Script>
            <Script
              src="https://mc.yandex.ru/metrika/tag.js"
              strategy="lazyOnload"
            />
          </>
        ) : null}
        {gaId ? (
          <>
            <Script id="google-analytics" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', ${JSON.stringify(gaId)});
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
          </>
        ) : null}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
