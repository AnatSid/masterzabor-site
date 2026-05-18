import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { COORDINATES } from "@/lib/constants";
import { generateLocalBusinessJsonLd, generatePageMetadata } from "@/lib/seo";

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
            __html: JSON.stringify(localBusinessJsonLd).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
        />
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
