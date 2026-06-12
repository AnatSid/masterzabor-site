import Link from "next/link";
import { QuizForm } from "@/components/forms/QuizForm";
import { services } from "@/content/services";
import {
  generateBreadcrumbJsonLd,
  generatePageMetadata,
  generateProductJsonLd,
} from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Цены на заборы в Беларуси — 2026 | МастерЗабор",
  description:
    "Актуальные цены на заборы, ворота и калитки в Беларуси в 2026 году. Профнастил, евроштакетник, сетка-рабица. Бесплатный расчёт стоимости по телефону.",
  path: "/tseny",
});

const fenceServices = services.filter((service) =>
  [
    "zabory-iz-profnastila",
    "zabory-iz-evroshtaketnika",
    "zabory-iz-setki-rabitsy",
  ].includes(service.slug),
);

const gateServices = services.filter((service) =>
  ["vorota-raspashnye", "vorota-otkatnye", "kalitki"].includes(service.slug),
);

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Главная", url: "/" },
  { name: "Цены", url: "/tseny" },
]);

const productJsonLdList = services.map((service) =>
  generateProductJsonLd({
    name: service.title,
    description: service.description,
    price: service.priceFrom,
    currency: "BYN",
  }),
);

export default function TsenyPage() {
  return (
    <main className="bg-white text-slate-900">
      {[breadcrumbJsonLd, ...productJsonLdList].map((jsonLd, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}

      <section className="bg-slate-950 py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Хлебные крошки" className="text-sm text-slate-300">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link className="hover:text-white" href="/">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">Цены</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Цены на заборы в Беларуси — 2026
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-200">
            Ниже указаны ориентировочные цены на популярные решения. Точный
            расчёт зависит от длины, высоты, комплектации, типа грунта и
            логистики.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Заборы
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-4">Вид забора</th>
                  <th className="px-6 py-4">Цена от</th>
                  <th className="px-6 py-4">Комментарий</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fenceServices.map((service) => (
                  <tr key={service.slug}>
                    <td className="px-6 py-5 font-semibold">{service.title}</td>
                    <td className="px-6 py-5 font-bold text-[#1B5E20]">
                      от {service.priceFrom} {service.priceUnit}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {service.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ворота и калитки
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-4">Конструкция</th>
                  <th className="px-6 py-4">Цена от</th>
                  <th className="px-6 py-4">Комментарий</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gateServices.map((service) => (
                  <tr key={service.slug}>
                    <td className="px-6 py-5 font-semibold">{service.title}</td>
                    <td className="px-6 py-5 font-bold text-[#1B5E20]">
                      от {service.priceFrom} {service.priceUnit}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {service.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Все цены ориентировочные и не являются публичной офертой.
            Окончательная стоимость фиксируется в договоре после уточнения
            параметров объекта.
          </p>
        </div>
      </section>

      <section className="py-16" id="lead-form">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#1B5E20]">
              Бесплатный расчёт
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Получите точный расчёт стоимости
            </h2>
            <p className="mt-5 text-slate-600">
              Оставьте номер, и мы перезвоним в течение рабочего дня. Уточним
              параметры участка и подготовим расчёт с понятной сметой.
            </p>
          </div>
          <QuizForm source="prices-page" />
        </div>
      </section>
    </main>
  );
}
