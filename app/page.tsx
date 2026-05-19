import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/cards/ProductCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { QuizForm } from "@/components/forms/QuizForm";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import {
  COMPANY_NAME,
  PHONE,
  PHONE_DISPLAY,
  TRUST_FACTS,
} from "@/lib/constants";
import { generateFaqJsonLd, generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Заборы в Беларуси — установка под ключ, цены 2026 | МастерЗабор",
  description:
    "Установка заборов из профнастила, евроштакетника, сетки-рабицы по всей Беларуси. Цены от 30 BYN/м.п. Гарантия 20 лет. Рассрочка и удобная оплата частями.",
  path: "/",
});

const fenceServices = services.slice(0, 3);
const gateServices = services.slice(3);

const trustItems = [
  {
    icon: "🏗",
    title: `С ${TRUST_FACTS.sinceYear} года`,
    text: `${TRUST_FACTS.completedFences} заборов`,
  },
  {
    icon: "🛡",
    title: `Гарантия до ${TRUST_FACTS.warrantyYears} лет`,
    text: "на материалы и монтаж",
  },
  {
    icon: "💳",
    title: "Рассрочка и оплата частями",
    text: "подберём комфортный платёж — работаем с 8 банками",
  },
  {
    icon: "🚚",
    title: "Бесплатная доставка",
    text: "по Гомелю и области",
  },
] as const;

const works = [
  "Забор из профнастила для частного дома",
  "Фасадный забор из евроштакетника",
  "Откатные ворота с заполнением профнастилом",
  "Сетка-рабица для дачного участка",
  "Распашные ворота и калитка",
  "Комбинированное ограждение участка",
] as const;

const reviews = [
  {
    name: "Андрей, Гомель",
    text: "Поставили забор из профнастила за два дня. Расчёт сделали по телефону, цену после договора не меняли.",
  },
  {
    name: "Ольга, Речица",
    text: "Заказывали штакетник и калитку. Аккуратный монтаж, помогли подобрать цвет под фасад дома.",
  },
  {
    name: "Сергей, Мозырь",
    text: "Нужны были откатные ворота с подготовкой под автоматику. Всё объяснили и сделали в срок.",
  },
] as const;

const faq = [
  {
    question: "Сколько стоит установка забора в Беларуси?",
    answer:
      "Минимальная цена начинается от 30 BYN за погонный метр для сетки-рабицы. Профнастил стоит от 70 BYN/м.п., евроштакетник — от 85 BYN/м.п.",
  },
  {
    question: "Выезжаете ли вы за пределы Гомеля?",
    answer:
      "Да, основная зона работы — Гомель и Гомельская область, но бригады выезжают по всей Беларуси.",
  },
  {
    question: "Расчёт стоимости действительно бесплатный?",
    answer:
      "Да, мы бесплатно рассчитываем стоимость по телефону. Вы называете примерную длину забора и параметры участка, а мастера выезжают уже на заключение договора.",
  },
  {
    question: "Можно ли заказать забор в рассрочку?",
    answer:
      "Да, доступна рассрочка и удобная оплата частями до 60 месяцев. Подбираем вариант через банки-партнёры под бюджет и формат объекта.",
  },
  {
    question: "Сколько времени занимает монтаж?",
    answer:
      "Обычно монтаж занимает от 1 до 3 дней. Срок зависит от длины забора, типа грунта, ворот и погодных условий.",
  },
  {
    question: "Какая гарантия на забор?",
    answer:
      "На материалы и монтаж предоставляем гарантию до 20 лет при соблюдении условий эксплуатации.",
  },
] as const;

const normalizeOblastGroup = (oblast: string) =>
  oblast === "Минская область" ? "Минск и Минская область" : oblast;

const cityGroupOrder = [
  "Гомельская область",
  "Минск и Минская область",
  "Брестская область",
  "Гродненская область",
  "Витебская область",
  "Могилёвская область",
] as const;

const citiesByOblast = cities.reduce<Record<string, typeof cities>>(
  (acc, city) => {
    const group = normalizeOblastGroup(city.oblast);
    acc[group] = [...(acc[group] ?? []), city];
    return acc;
  },
  {},
);

const faqJsonLd = generateFaqJsonLd(faq);

function placeholderImage(title: string, index: number) {
  const colors = ["#1B5E20", "#2E7D32", "#F59E0B", "#334155"];
  const color = colors[index % colors.length];
  const svg = `
    <svg width="900" height="640" viewBox="0 0 900 640" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="640" fill="#F5F5F5"/>
      <rect y="380" width="900" height="260" fill="${color}"/>
      <path d="M0 380L900 220V380H0Z" fill="#E2E8F0"/>
      <g stroke="white" stroke-width="18">
        <path d="M90 415V590"/>
        <path d="M240 385V590"/>
        <path d="M390 355V590"/>
        <path d="M540 325V590"/>
        <path d="M690 295V590"/>
        <path d="M840 265V590"/>
        <path d="M70 450H860"/>
        <path d="M70 520H860"/>
      </g>
      <text x="60" y="110" fill="#0F172A" font-size="42" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function Home() {
  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replaceAll("<", "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            alt="Забор из профнастила на участке в Беларуси"
            className="object-cover"
            fill
            priority
            src={placeholderImage("МастерЗабор", 0)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              {COMPANY_NAME}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Установка заборов по всей Беларуси под ключ
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
              Профнастил • Евроштакетник • Сетка-рабица
              <br />
              Цены от 30 BYN/м.п.
              <br />
              Рассрочка и оплата частями до 60 месяцев
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex justify-center rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600"
                href="#quiz"
              >
                Рассчитать стоимость
              </a>
              <a
                className="inline-flex justify-center rounded-xl bg-white px-6 py-3 font-bold text-[#1B5E20] transition hover:bg-slate-100"
                href={`tel:${PHONE}`}
              >
                Позвонить: {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-2xl font-bold">Бесплатный расчёт сегодня</p>
            <p className="mt-3 text-slate-200">
              Рассчитаем стоимость, подберём материалы и покажем варианты
              заборов под ваш участок.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <span className="rounded-2xl bg-white/10 px-4 py-3">Гарантия 20 лет</span>
              <span className="rounded-2xl bg-white/10 px-4 py-3">Договор и смета</span>
              <span className="rounded-2xl bg-white/10 px-4 py-3">Свои бригады</span>
              <span className="rounded-2xl bg-white/10 px-4 py-3">Работаем по РБ</span>
              <span className="rounded-2xl bg-white/10 px-4 py-3">Рассрочка и оплата частями</span>
              <span className="rounded-2xl bg-white/10 px-4 py-3">Быстрый расчёт по телефону</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {trustItems.map((item) => (
            <article
              className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm"
              key={item.title}
            >
              <div className="text-3xl" aria-hidden="true">
                {item.icon}
              </div>
              <h2 className="mt-4 text-lg font-bold leading-tight text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Типы заборов
            </h2>
            <p className="mt-4 text-slate-600">
              Подбираем ограждение под бюджет, стиль участка и требования к
              приватности.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {fenceServices.map((service) => (
              <ProductCard
                description={service.description}
                href={`/${service.slug}/`}
                key={service.slug}
                priceFrom={service.priceFrom}
                priceUnit={service.priceUnit}
                title={service.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ворота и калитки
            </h2>
            <p className="mt-4 text-slate-600">
              Изготавливаем въездные группы в одном стиле с забором и
              подготавливаем конструкции под автоматику.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gateServices.map((service) => (
              <ProductCard
                description={service.description}
                href={`/${service.slug}/`}
                key={service.slug}
                priceFrom={service.priceFrom}
                priceUnit={service.priceUnit}
                title={service.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Примеры работ
              </h2>
              <p className="mt-4 text-slate-600">
                Реальные типы объектов: частные дома, дачи, въездные группы и
                большие периметры.
              </p>
            </div>
            <Link
              className="font-semibold text-[#1B5E20] hover:text-green-800"
              href="/nashi-raboty/"
            >
              Смотреть портфолио
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work, index) => (
              <article
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
                key={work}
              >
                <Image
                  alt={work}
                  className="h-56 w-full object-cover"
                  height={420}
                  src={placeholderImage(work, index + 1)}
                  width={620}
                />
                <h3 className="p-5 font-semibold text-slate-950">{work}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" id="quiz">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#1B5E20]">
              Калькулятор
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Рассчитайте стоимость забора за 1 минуту
            </h2>
            <p className="mt-5 text-slate-600">
              Ответьте на 6 вопросов. Мы подготовим предварительный расчёт и
              уточним стоимость по телефону за 5 минут.
            </p>
          </div>
          <QuizForm />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Отзывы клиентов
              </h2>
              <p className="mt-4 text-slate-600">
                Клиенты отмечают точную смету, аккуратный монтаж и соблюдение
                сроков.
              </p>
            </div>
            <Link
              className="font-semibold text-[#1B5E20] hover:text-green-800"
              href="/otzyvy/"
            >
              Все отзывы
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                key={review.name}
              >
                <div className="text-amber-500" aria-label="Оценка 5 из 5">
                  ★★★★★
                </div>
                <p className="mt-4 text-slate-700">«{review.text}»</p>
                <p className="mt-5 font-semibold text-slate-950">
                  {review.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Работаем по всей Беларуси
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Основной регион — Гомель и Гомельская область. Также работаем в
            Минске и ещё 39 городах по всей Беларуси.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cityGroupOrder.map((oblast) => {
              const oblastCities = citiesByOblast[oblast] ?? [];

              return (
                <section
                  className="rounded-2xl bg-white p-6 shadow-sm"
                  key={oblast}
                >
                  <h3 className="font-bold text-slate-950">{oblast}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {oblastCities.map((city) => (
                      <Link
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-[#1B5E20] hover:text-white"
                        href={`/${city.slug}/`}
                        key={city.slug}
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#1B5E20] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="text-white">
            <p className="font-semibold uppercase tracking-wide text-amber-300">
              Бесплатный расчёт
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Получите бесплатный расчёт
            </h2>
            <p className="mt-5 text-green-50">
              Оставьте номер — перезвоним и рассчитаем стоимость за 5 минут.
              Для предварительной цены достаточно назвать длину забора и
              выбранный материал.
            </p>
          </div>
          <LeadForm source="home-lead-form" />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Вопросы и ответы
          </h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {faq.map((item) => (
              <details className="group p-6" key={item.question}>
                <summary className="cursor-pointer list-none font-semibold text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-3 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
