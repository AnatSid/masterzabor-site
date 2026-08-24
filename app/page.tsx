import Image from "next/image";
import Link from "next/link";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { ProductCard } from "@/components/cards/ProductCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { QuizForm } from "@/components/forms/QuizForm";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import {
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

const benefitItems = [
  {
    icon: "experience" as const,
    title: `С ${TRUST_FACTS.sinceYear} года`,
    text: `${TRUST_FACTS.completedFences} заборов — опыт частных участков, дач и въездных групп`,
  },
  {
    icon: "installment" as const,
    title: "Рассрочка и оплата частями",
    text: "подберём комфортный платёж — работаем с 8 банками",
  },
  {
    icon: "delivery" as const,
    title: "Бесплатная доставка",
    text: "организуем доставку и монтаж под ключ",
  },
  {
    icon: "phone" as const,
    title: "Быстрый расчёт по телефону",
    text: "назовите длину и тип забора — подскажем ориентир по цене",
  },
  {
    icon: "crew" as const,
    title: "Свои бригады",
    text: "работаем постоянными монтажниками, без случайных подрядчиков",
  },
  {
    icon: "contract" as const,
    title: "Договор и смета",
    text: "фиксируем объём работ, материалы, сроки и итоговую стоимость",
  },
  {
    icon: "selection" as const,
    title: "Подбор под участок",
    text: "сравним материалы, высоту и цвет под бюджет, дом и грунт",
  },
  {
    icon: "warranty" as const,
    title: "Гарантия на материалы и монтаж",
    text: "срок зависит от материала и условий эксплуатации — всё прописываем в договоре",
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

const sectionIntroClassName =
  "w-full max-w-none lg:max-w-[70%] xl:max-w-[56rem]";

const sectionIntroFlexClassName = `${sectionIntroClassName} min-w-0 flex-1`;

const sectionSubtitleClassName =
  "mt-4 text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]";

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

type BrandIconName = (typeof benefitItems)[number]["icon"];

const benefitIconSrc: Record<BrandIconName, string> = {
  contract: "/icons/benefits/contract.svg",
  crew: "/icons/benefits/crew.svg",
  delivery: "/icons/benefits/delivery.svg",
  experience: "/icons/benefits/experience.svg",
  installment: "/icons/benefits/installment.svg",
  phone: "/icons/benefits/phone.svg",
  selection: "/icons/benefits/selection.svg",
  warranty: "/icons/benefits/warranty.svg",
};

function BrandLineIcon({
  className = "h-8 w-8 text-[#0A5633]",
  name,
}: {
  className?: string;
  name: BrandIconName;
}) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      height={40}
      src={benefitIconSrc[name]}
      unoptimized
      width={40}
    />
  );
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

      <section className="relative overflow-hidden bg-[#F6F8F5]">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <Image
            alt="Забор из профнастила на участке в Беларуси"
            className="object-cover object-center"
            fill
            preload
            sizes="58vw"
            src="/images/hero/homepage-fence-with-logo.jpeg"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#F6F8F5_0%,rgba(246,248,245,0.78)_14%,rgba(246,248,245,0.18)_34%,rgba(246,248,245,0)_56%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8 lg:pb-8 lg:pt-20">
          <div className="max-w-2xl lg:max-w-[48%]">
            <h1 className="text-balance text-[1.9rem] font-extrabold leading-[1.08] tracking-tight text-[#202020] sm:text-6xl lg:text-[3.25rem]">
              Установка заборов в Беларуси{" "}
              <span className="text-[#0A5633]">под ключ</span>
            </h1>
            <ul className="mt-3 max-w-xl space-y-1.5 text-[13px] font-semibold leading-snug text-slate-700 sm:mt-6 sm:space-y-2 sm:text-lg">
              <li className="flex gap-2">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">✓</span>
                <span>Профнастил • Евроштакетник • Сетка-рабица</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">✓</span>
                <span>Цены от 30 BYN/м.п.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">✓</span>
                <span>Рассрочка и оплата частями до 60 месяцев</span>
              </li>
            </ul>
            <div className="mt-4 grid gap-2 sm:mt-8 sm:flex sm:flex-row sm:gap-4">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A5633] px-4 py-2 text-xs font-bold leading-tight text-white shadow-lg shadow-green-950/10 transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                href="#quiz"
              >
                Рассчитать стоимость
              </a>
              <TrackedContactLink
                channel="click_call"
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#b9d7c6] bg-white px-4 py-2 text-xs font-bold leading-tight text-[#0A5633] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                eventLocation="homepage_hero"
                href={`tel:${PHONE}`}
                source="home-hero"
              >
                Позвонить: {PHONE_DISPLAY}
              </TrackedContactLink>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-green-950/10 backdrop-blur sm:p-5 lg:hidden">
            <p className="text-lg font-bold leading-tight text-[#06321F]">Бесплатный расчёт сегодня</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold leading-tight text-slate-700 sm:text-sm">
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Гарантия на работы</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Договор и смета</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Свои бригады</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Расчёт по телефону</span>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-[#F5F5F5] py-5 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefitItems.map((item) => (
            <article
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:rounded-2xl sm:p-6"
              key={item.title}
            >
              <BrandLineIcon className="h-11 w-11 text-[#0A5633] sm:h-[52px] sm:w-[52px]" name={item.icon} />
              <h2 className="mt-3 text-[15px] font-bold leading-tight text-slate-950 sm:mt-5 sm:text-lg">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={sectionIntroClassName}>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Типы заборов
            </h2>
            <p className={`${sectionSubtitleClassName} hidden sm:block`}>
              Подбираем ограждение под бюджет, стиль участка и требования
              к&nbsp;приватности.
            </p>
          </div>
          <div className="mt-2 grid gap-3 sm:mt-10 sm:gap-6 md:grid-cols-3">
            {fenceServices.map((service) => (
              <ProductCard
                description={service.description}
                href={`/${service.slug}`}
                imageSrc={service.imageSrc}
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
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ворота и калитки
            </h2>
            <p className={sectionSubtitleClassName}>
              Изготавливаем ворота и калитки в едином стиле с&nbsp;забором.
              <br />
              Подготавливаем конструкции под автоматику и&nbsp;комфортное
              ежедневное использование.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gateServices.map((service) => (
              <ProductCard
                description={service.description}
                href={`/${service.slug}`}
                imageSrc={service.imageSrc}
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
            <div className={sectionIntroFlexClassName}>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Примеры работ
              </h2>
              <p className={sectionSubtitleClassName}>
                Реальные объекты: частные дома, дачи, въездные группы
                и&nbsp;большие периметры.
              </p>
            </div>
            <Link
              className="font-semibold text-[#1B5E20] hover:text-green-800"
              href="/nashi-raboty"
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
          <div className={sectionIntroClassName}>
            <p className="font-semibold uppercase tracking-wide text-[#1B5E20]">
              Калькулятор
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Рассчитайте стоимость забора за 1 минуту
            </h2>
            <p className={`${sectionSubtitleClassName} mt-5`}>
              Ответьте на 6 вопросов — подготовим предварительный расчёт
              и&nbsp;уточним стоимость по&nbsp;телефону за&nbsp;5&nbsp;минут.
            </p>
          </div>
          <QuizForm />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className={sectionIntroFlexClassName}>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Отзывы клиентов
              </h2>
              <p className={sectionSubtitleClassName}>
                Клиенты отмечают точную смету, аккуратный монтаж
                и&nbsp;соблюдение сроков.
              </p>
            </div>
            <Link
              className="font-semibold text-[#1B5E20] hover:text-green-800"
              href="/otzyvy"
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
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Работаем по Беларуси
            </h2>
            <p className={sectionSubtitleClassName}>
              Устанавливаем заборы для частных домов, дач и&nbsp;коммерческих
              объектов по&nbsp;всей Беларуси. Работаем не только
              в&nbsp;городах, но и&nbsp;в&nbsp;посёлках, деревнях
              и&nbsp;небольших населённых пунктах.
            </p>
          </div>
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
                        href={`/${city.slug}`}
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
            <p className="mt-5 max-w-none text-pretty leading-relaxed text-green-50 md:text-[1.0625rem] md:leading-[1.65]">
              Оставьте номер — перезвоним и&nbsp;рассчитаем стоимость
              за&nbsp;5&nbsp;минут. Для предварительной цены достаточно назвать
              длину забора и&nbsp;выбранный материал.
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
