import Link from "next/link";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Наши работы — фото установленных заборов | МастерЗабор",
  description:
    "Портфолио установленных заборов, ворот и калиток в Беларуси. Фото-заглушки по типам ограждений с фильтрами для быстрого выбора решений.",
  path: "/nashi-raboty",
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Главная", url: "/" },
  { name: "Наши работы", url: "/nashi-raboty" },
]);

export default function NashiRabotyPage() {
  return (
    <main className="bg-white py-14 text-slate-900 sm:py-16">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-[#1B5E20]" href="/">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">Наши работы</li>
          </ol>
        </nav>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Наши работы — фото установленных заборов
          </h1>
          <p className="mt-4 text-slate-600">
            Подборка типовых объектов: профнастил, евроштакетник, сетка-рабица,
            ворота и калитки. Используйте фильтры, чтобы быстрее найти нужный
            формат.
          </p>
        </header>

        <PortfolioGallery />
      </section>
    </main>
  );
}
