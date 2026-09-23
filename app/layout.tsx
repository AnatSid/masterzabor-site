import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
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
    title:
      "Установка заборов в Беларуси под ключ — профнастил, штакетник, сетка-рабица",
    description:
      "Устанавливаем заборы по всей Беларуси: профнастил, евроштакетник и сетка-рабица. Бесплатный расчёт, доставка и монтаж под ключ. Гарантия, рассрочка и оплата частями.",
    path: "/",
  }),
  other: {
    "geo.region": "BY",
    "geo.placename": "Беларусь",
  },
};

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
        className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
