import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
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
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${JSON.stringify(ymId)}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `}
          </Script>
        ) : null}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white pb-20 text-slate-900 antialiased md:pb-0`}
      >
        <Header />
        {children}
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
