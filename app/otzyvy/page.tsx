import Link from "next/link";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Отзывы клиентов о МастерЗабор | Беларусь",
  description:
    "Реальные отзывы клиентов МастерЗабор о монтаже заборов, ворот и калиток в Беларуси. Оцените качество работ и точность расчётов перед заказом.",
  path: "/otzyvy/",
});

const reviews = [
  {
    name: "Андрей, Гомель",
    text: "Заказывали забор из профнастила 1.8 м на весь периметр. Стоимость рассчитали по телефону, после подписания договора сумма не изменилась. Смонтировали аккуратно за два дня.",
  },
  {
    name: "Ольга, Минск",
    text: "Нужно было оформить фасад и входную группу в одном стиле. Посоветовали евроштакетник и калитку с замком. Получилось аккуратно и современно, монтаж без задержек.",
  },
  {
    name: "Сергей, Мозырь",
    text: "Ставили откатные ворота и часть ограждения из профнастила. Хорошо объяснили по комплектации и фундаменту, сделали подготовку под автоматику. Работой доволен.",
  },
  {
    name: "Марина, Речица",
    text: "Был важен бюджет, поэтому выбрали сетку-рабицу для дачного участка. Получили адекватную цену и быстрый монтаж. Для наших задач решение подошло идеально.",
  },
  {
    name: "Виктор, Бобруйск",
    text: "Заказывали распашные ворота и калитку под существующий забор. Всё подогнали по размерам, створки ходят легко, замок работает без проблем.",
  },
  {
    name: "Елена, Брест",
    text: "Понравилось, что не навязывали лишнего. Сравнили несколько вариантов и выбрали оптимальный по цене и виду. Результат совпал с тем, что обсуждали на старте.",
  },
] as const;

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Главная", url: "/" },
  { name: "Отзывы", url: "/otzyvy/" },
]);

const GOOGLE_MAPS_REVIEWS_LINK =
  "https://www.google.com/maps/search/?api=1&query=%D0%9C%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%97%D0%B0%D0%B1%D0%BE%D1%80%20%D0%93%D0%BE%D0%BC%D0%B5%D0%BB%D1%8C";

export default function OtzyvyPage() {
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
            <li className="text-slate-700">Отзывы</li>
          </ol>
        </nav>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Отзывы клиентов о МастерЗабор
          </h1>
          <p className="mt-4 text-slate-600">
            Клиенты ценят прозрачный расчёт, понятные сроки и аккуратный монтаж.
            Ниже — реальные формулировки, которые чаще всего мы слышим после
            сдачи объекта.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              key={review.name}
            >
              <div aria-label="Оценка 5 из 5" className="text-amber-500">
                ★★★★★
              </div>
              <p className="mt-4 text-slate-700">«{review.text}»</p>
              <p className="mt-5 font-semibold text-slate-950">{review.name}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl bg-[#F5F5F5] p-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Хотите оставить отзыв в Google Maps?
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Нам важно ваше мнение: это помогает новым клиентам выбрать надёжного
            подрядчика и улучшает качество сервиса.
          </p>
          <a
            className="mt-6 inline-flex rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600"
            href={GOOGLE_MAPS_REVIEWS_LINK}
            rel="noopener noreferrer"
            target="_blank"
          >
            Оставить отзыв в Google Maps
          </a>
        </section>
      </section>
    </main>
  );
}
