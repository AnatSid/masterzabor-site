import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/cards/ProductCard";
import { QuizForm } from "@/components/forms/QuizForm";
import { cities, type City } from "@/content/cities";
import { services } from "@/content/services";
import {
  ADDRESS,
  COMPANY_NAME,
  PHONE,
  PHONE_DISPLAY,
  SITE_URL,
  TRUST_FACTS,
  UNP,
  WORKING_HOURS,
} from "@/lib/constants";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

type CityPageProps = {
  city: City;
};

const fenceServices = services.slice(0, 3);
const gateServices = services.slice(3);

const normalizeOblastGroup = (oblast: string) =>
  oblast === "Минская область" ? "Минск и Минская область" : oblast;

function placeholderImage(title: string, index: number) {
  const colors = ["#1B5E20", "#2E7D32", "#F59E0B", "#475569"];
  const color = colors[index % colors.length];
  const svg = `
    <svg width="900" height="640" viewBox="0 0 900 640" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="640" fill="#F5F5F5"/>
      <circle cx="735" cy="110" r="58" fill="#F59E0B" opacity="0.9"/>
      <path d="M0 370L900 245V640H0V370Z" fill="#E2E8F0"/>
      <rect y="390" width="900" height="250" fill="${color}"/>
      <g stroke="white" stroke-width="16" stroke-linecap="round">
        <path d="M85 420V590"/>
        <path d="M235 400V590"/>
        <path d="M385 380V590"/>
        <path d="M535 360V590"/>
        <path d="M685 340V590"/>
        <path d="M835 320V590"/>
        <path d="M65 460H865"/>
        <path d="M65 535H865"/>
      </g>
      <text x="55" y="115" fill="#0F172A" font-size="40" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getRelatedCities(city: City) {
  const currentGroup = normalizeOblastGroup(city.oblast);

  return cities
    .filter(
      (item) =>
        item.slug !== city.slug &&
        normalizeOblastGroup(item.oblast) === currentGroup,
    )
    .slice(0, 8);
}

function citySeoText(city: City) {
  const districtText = city.districts?.length
    ? `Работаем во всех районах: ${city.districts.join(", ")}.`
    : `Выезжаем на объекты в ${city.namePrepositional} и рядом с городом.`;

  return [
    `МастерЗабор выполняет установку заборов в ${city.namePrepositional} и ${city.oblastGenitive}. Мы работаем с частными домами, дачами, новыми участками и коммерческими территориями: подбираем материал, высоту, каркас, ворота и калитку под реальную задачу клиента.`,
    `Предварительный расчёт делаем по телефону. Вы называете примерную длину ограждения, желаемую высоту, тип материала и особенности участка, а специалист за 5 минут ориентирует по цене. После согласования мастера выезжают в ${city.namePrepositional} уже для заключения договора, уточнения деталей и подготовки монтажа.`,
    `Для объектов в ${city.oblastGenitive} чаще всего выбирают профнастил для приватности, евроштакетник для аккуратного фасада и сетку-рабицу для бюджетного ограждения больших периметров. Также изготавливаем распашные и откатные ворота, калитки, подбираем цвет по RAL и комплектуем забор фурнитурой.`,
    `${districtText} На каждом объекте фиксируем смету, сроки, комплектацию и гарантийные условия. Монтаж выполняют постоянные бригады, поэтому клиент получает понятный результат: ровную линию забора, аккуратные узлы, прочные столбы и готовый въезд на участок.`,
  ];
}

function generateCityLocalBusinessJsonLd(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/${city.slug}/#localbusiness`,
    name: `${COMPANY_NAME} — заборы в ${city.namePrepositional}`,
    url: `${SITE_URL}/${city.slug}/`,
    telephone: PHONE_DISPLAY,
    priceRange: "$$",
    taxID: UNP,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: city.name,
      addressRegion: city.oblast,
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coords.lat,
      longitude: city.coords.lng,
    },
    openingHours: "Mo-Su 10:00-19:00",
    description: `Установка заборов, ворот и калиток под ключ в ${city.namePrepositional}. ${WORKING_HOURS}.`,
    areaServed: {
      "@type": "City",
      name: city.name,
    },
  };
}

export function CityPage({ city }: CityPageProps) {
  const relatedCities = getRelatedCities(city);
  const breadcrumbs = [
    { name: "Главная", url: "/" },
    { name: `Заборы в ${city.namePrepositional}`, url: `/${city.slug}/` },
  ];
  const jsonLd = [
    generateCityLocalBusinessJsonLd(city),
    generateBreadcrumbJsonLd(breadcrumbs),
  ];

  return (
    <main className="bg-white text-slate-900">
      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replaceAll("<", "\\u003c"),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-35">
          <Image
            alt={`Установка забора в ${city.namePrepositional}`}
            className="object-cover"
            fill
            priority
            src={placeholderImage(city.name, 0)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav aria-label="Хлебные крошки" className="text-sm text-slate-300">
            <ol className="flex flex-wrap gap-2">
              {breadcrumbs.map((item, index) => (
                <li key={item.url}>
                  {index > 0 ? <span className="mr-2">/</span> : null}
                  <Link className="hover:text-white" href={item.url}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.25em] text-amber-300">
              {city.oblast}
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Установка заборов в {city.namePrepositional} под ключ
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Профнастил, евроштакетник, сетка-рабица, ворота и калитки.
              Рассчитаем стоимость по телефону за 5 минут и согласуем понятную
              смету.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex justify-center rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600"
                href="#lead-form"
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
        </div>
      </section>

      <section className="py-16">
        <article className="mx-auto max-w-4xl px-4 text-lg leading-8 text-slate-700 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Заборы в {city.namePrepositional}: расчёт, доставка и монтаж
          </h2>
          <div className="mt-6 space-y-5">
            {citySeoText(city).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Типы заборов
            </h2>
            <p className="mt-4 text-slate-600">
              Подберём ограждение для участка в {city.namePrepositional}: от
              бюджетного решения до фасадного забора с воротами.
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

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ворота и калитки
            </h2>
            <p className="mt-4 text-slate-600">
              Изготавливаем въездную группу в едином стиле с забором:
              распашные, откатные ворота и калитки под размер проёма.
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

      {city.districts?.length ? (
        <section className="bg-[#F5F5F5] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Работаем во всех районах {city.nameGenitive}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {city.districts.map((district) => (
                <span
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm"
                  key={district}
                >
                  {district}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Примеры работ
              </h2>
              <p className="mt-4 text-slate-600">
                Фото-заглушки для будущей галереи объектов в {city.oblastGenitive}.
              </p>
            </div>
            <p className="font-semibold text-[#1B5E20]">
              С {TRUST_FACTS.sinceYear} года установили {TRUST_FACTS.completedFences}{" "}
              заборов
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Image
                alt={`Забор в ${city.namePrepositional} — пример объекта ${index + 1}`}
                className="h-56 rounded-2xl object-cover shadow-sm"
                height={360}
                key={index}
                src={placeholderImage(`${city.name}: объект ${index + 1}`, index + 1)}
                width={520}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1B5E20] py-16" id="lead-form">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="text-white">
            <p className="font-semibold uppercase tracking-wide text-amber-300">
              Получите расчёт по телефону
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Узнайте цену забора в {city.namePrepositional}
            </h2>
            <p className="mt-5 text-green-50">
              Оставьте номер, примерную длину и пожелания. Перезвоним,
              рассчитаем стоимость за 5 минут и предложим подходящую
              комплектацию для вашего участка.
            </p>
          </div>
          <QuizForm cityName={city.name} source={`city-${city.slug}`} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Другие города
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Работаем не только в {city.namePrepositional}, но и в других городах
            региона.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedCities.map((item) => (
              <Link
                className="rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#1B5E20] hover:text-white"
                href={`/${item.slug}/`}
                key={item.slug}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
