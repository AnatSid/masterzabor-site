import Image from "next/image";
import Link from "next/link";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { ProductCard } from "@/components/cards/ProductCard";
import { QuizForm } from "@/components/forms/QuizForm";
import { QUIZ_TOTAL_STEPS } from "@/components/forms/quiz-form-config";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { BenefitTrustSection } from "@/components/sections/BenefitTrustSection";
import { cities, type City } from "@/content/cities";
import { projects, type Project } from "@/content/projects";
import { services } from "@/content/services";
import {
  ADDRESS,
  COMPANY_NAME,
  PHONE,
  PHONE_DISPLAY,
  UNP,
  WORKING_HOURS,
} from "@/lib/constants";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { canonicalUrl } from "@/lib/url";

type CityPageProps = {
  city: City;
};

const fenceServices = services.slice(0, 3);
const gateServices = services.slice(3);
const CITY_PROOF_LIMIT = 3;
const cityHeroImage = {
  src: "/images/hero/homepage-fence-with-logo.jpeg",
  alt: "Забор из профнастила на участке в Беларуси",
};

const normalizeOblastGroup = (oblast: string) =>
  oblast === "Минская область" ? "Минск и Минская область" : oblast;

const sectionIntroClassName =
  "w-full max-w-none lg:max-w-[70%] xl:max-w-[56rem]";

const sectionIntroFlexClassName = `${sectionIntroClassName} min-w-0 flex-1`;

const sectionSubtitleClassName =
  "mt-4 text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]";

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

function byFeaturedThenSourceOrder(left: Project, right: Project) {
  if (left.isFeatured === right.isFeatured) {
    return 0;
  }

  return left.isFeatured ? -1 : 1;
}

function getConfirmedProjects() {
  return projects.filter((project) => project.id.startsWith("real-"));
}

function getCityProjectProof(city: City) {
  const currentGroup = normalizeOblastGroup(city.oblast);
  const confirmedProjects = getConfirmedProjects();
  const exactProjects = confirmedProjects
    .filter((project) => project.city.slug === city.slug)
    .sort(byFeaturedThenSourceOrder);
  const sameOblastProjects = confirmedProjects
    .filter(
      (project) =>
        project.city.slug !== city.slug &&
        normalizeOblastGroup(project.city.oblast) === currentGroup,
    )
    .sort(byFeaturedThenSourceOrder);
  const nationwideProjects = confirmedProjects
    .filter(
      (project) =>
        project.city.slug !== city.slug &&
        normalizeOblastGroup(project.city.oblast) !== currentGroup,
    )
    .sort(byFeaturedThenSourceOrder);
  const selectedProjects: Project[] = [];

  for (const project of [
    ...exactProjects,
    ...sameOblastProjects,
    ...nationwideProjects,
  ]) {
    if (
      selectedProjects.length < CITY_PROOF_LIMIT &&
      !selectedProjects.some((item) => item.id === project.id)
    ) {
      selectedProjects.push(project);
    }
  }

  const regionalCount = exactProjects.length + sameOblastProjects.length;
  const mode =
    exactProjects.length > 0
      ? "exact"
      : sameOblastProjects.length > 0
        ? "oblast"
        : "nationwide";

  return {
    mode,
    projects: selectedProjects,
    regionalCount,
  };
}

function getProofHeading(city: City, mode: ReturnType<typeof getCityProjectProof>["mode"]) {
  if (mode === "exact") {
    return `Наши работы в ${city.namePrepositional}`;
  }

  if (mode === "oblast") {
    return `Наши работы в ${city.oblastGenitive}`;
  }

  return "Примеры наших работ по Беларуси";
}

function getProofDescription(city: City, proof: ReturnType<typeof getCityProjectProof>) {
  if (proof.mode === "exact") {
    return `Показываем подтверждённые объекты в ${city.namePrepositional} и рядом по региону. Карточки сохраняют фактический город каждого проекта.`;
  }

  if (proof.mode === "oblast" && proof.regionalCount >= CITY_PROOF_LIMIT) {
    return `Подобрали подтверждённые объекты в ${city.oblastGenitive}. Не называем их объектами в ${city.namePrepositional}, если такой записи нет в портфолио.`;
  }

  if (proof.mode === "oblast") {
    return `В ${city.oblastGenitive} есть подтверждённые объекты, а недостающие карточки дополняем реальными работами МастерЗабор по Беларуси.`;
  }

  return `В текущем портфолио пока нет подтверждённых объектов в ${city.namePrepositional} или ${city.oblastGenitive}, поэтому показываем реальные работы МастерЗабор из других регионов.`;
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
    "@id": `${canonicalUrl(`/${city.slug}`)}#localbusiness`,
    name: `${COMPANY_NAME} — заборы в ${city.namePrepositional}`,
    url: canonicalUrl(`/${city.slug}`),
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
  const cityProof = getCityProjectProof(city);
  const proofHeading = getProofHeading(city, cityProof.mode);
  const proofDescription = getProofDescription(city, cityProof);
  const breadcrumbs = [
    { name: "Главная", url: "/" },
    { name: `Заборы в ${city.namePrepositional}`, url: `/${city.slug}` },
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

      <section className="relative overflow-hidden bg-[#F6F8F5]">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <Image
            alt={cityHeroImage.alt}
            className="object-cover object-center"
            fill
            priority
            sizes="58vw"
            src={cityHeroImage.src}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#F6F8F5_0%,rgba(246,248,245,0.82)_14%,rgba(246,248,245,0.2)_36%,rgba(246,248,245,0)_58%)]" />
        </div>

        <SiteContainer className="relative py-6 pb-5 sm:pb-10 sm:pt-16 lg:pb-8 lg:pt-20">
          <div className="max-w-2xl lg:max-w-[48%]">
            <nav aria-label="Хлебные крошки" className="text-sm text-slate-500">
              <ol className="flex flex-wrap gap-2">
                {breadcrumbs.map((item, index) => (
                  <li key={item.url}>
                    {index > 0 ? <span className="mr-2">/</span> : null}
                    <Link className="hover:text-[#0A5633]" href={item.url}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-8 min-w-0">
              <p className="text-sm font-semibold uppercase text-[#0A5633]">
                {city.oblast}
              </p>
              <h1 className="mt-5 text-balance text-[1.9rem] font-extrabold leading-[1.08] text-[#202020] sm:text-6xl lg:text-[3.25rem]">
                Установка заборов в {city.namePrepositional}{" "}
                <span className="text-[#0A5633]">под ключ</span>
              </h1>
              <ul className="mt-3 max-w-xl space-y-1.5 text-[13px] font-semibold leading-snug text-slate-700 sm:mt-6 sm:space-y-2 sm:text-lg">
                <li className="flex gap-2">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">
                    ✓
                  </span>
                  <span>Профнастил • Евроштакетник • Сетка-рабица</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">
                    ✓
                  </span>
                  <span>Цены от 30 BYN/м.п.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0A5633] text-xs text-white">
                    ✓
                  </span>
                  <span>Рассрочка и оплата частями до 60 месяцев</span>
                </li>
              </ul>
              <div className="mt-4 grid gap-2 sm:mt-8 sm:flex sm:flex-row sm:gap-4">
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A5633] px-4 py-2 text-xs font-bold leading-tight text-white shadow-lg shadow-green-950/10 transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                  href="#lead-form"
                >
                  Рассчитать стоимость
                </a>
                <TrackedContactLink
                  channel="click_call"
                  className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#b9d7c6] bg-white px-4 py-2 text-xs font-bold leading-tight text-[#0A5633] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                  eventLocation="city_hero"
                  href={`tel:${PHONE}`}
                  source={`city-${city.slug}`}
                >
                  Позвонить: {PHONE_DISPLAY}
                </TrackedContactLink>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-green-950/10 backdrop-blur sm:p-5 lg:hidden">
            <p className="text-lg font-bold leading-tight text-[#06321F]">
              Бесплатный расчёт сегодня
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold leading-tight text-slate-700 sm:text-sm">
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Гарантия на работы</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Договор и смета</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Свои бригады</span>
              <span className="rounded-full bg-[#F0F6F1] px-3 py-2">Расчёт по телефону</span>
            </div>
          </div>

          <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-green-950/10 lg:hidden">
            <Image
              alt={cityHeroImage.alt}
              className="object-cover object-center"
              fill
              priority
              sizes="100vw"
              src={cityHeroImage.src}
            />
          </div>
        </SiteContainer>
      </section>

      <BenefitTrustSection />

      <section className="py-12 sm:py-16">
        <SiteContainer>
          <article className="max-w-5xl text-lg leading-8 text-slate-700">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Заборы в {city.namePrepositional}: расчёт, доставка и монтаж
            </h2>
            <div className="mt-6 space-y-5">
              {citySeoText(city).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-12 sm:py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Типы заборов
            </h2>
            <p className={sectionSubtitleClassName}>
              Подберём ограждение для участка в {city.namePrepositional}: от
              бюджетного решения до фасадного забора с воротами.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
        </SiteContainer>
      </section>

      <section className="py-12 sm:py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ворота и калитки
            </h2>
            <p className={sectionSubtitleClassName}>
              Изготавливаем въездную группу в едином стиле с забором:
              распашные, откатные ворота и калитки под размер проёма.
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
        </SiteContainer>
      </section>

      {city.districts?.length ? (
        <section className="bg-[#F5F5F5] py-12 sm:py-16">
          <SiteContainer>
            <div className={sectionIntroClassName}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Работаем во всех районах {city.nameGenitive}
              </h2>
            </div>
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
          </SiteContainer>
        </section>
      ) : null}

      <section className="bg-[#F5F5F5] py-12 sm:py-16">
        <SiteContainer>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className={sectionIntroFlexClassName}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {proofHeading}
              </h2>
              <p className={sectionSubtitleClassName}>
                {proofDescription}
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
            {cityProof.projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                priority={index === 0}
                project={project}
              />
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="py-16" id="lead-form">
        <SiteContainer className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className={sectionIntroClassName}>
            <p className="font-semibold uppercase tracking-wide text-[#1B5E20]">
              РАСЧЁТ СТОИМОСТИ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Рассчитайте стоимость забора в {city.namePrepositional}
            </h2>
            <div className={`${sectionSubtitleClassName} mt-5 space-y-3`}>
              <p>
                Ответьте на {QUIZ_TOTAL_STEPS} вопросов — этого достаточно,
                чтобы понять, что вам нужно, и вернуться к вам с понятным
                ориентиром по цене.
              </p>
              <p>
                Уточним детали по телефону, чтобы вы могли сравнить варианты и
                спокойно принять решение.
              </p>
            </div>
          </div>
          <QuizForm
            cityName={city.name}
            presentation="compact"
            source={`city-${city.slug}`}
          />
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Другие города
            </h2>
            <p className={sectionSubtitleClassName}>
              Работаем не только в {city.namePrepositional}, но и в других городах
              региона.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedCities.map((item) => (
              <Link
                className="rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#1B5E20] hover:text-white"
                href={`/${item.slug}`}
                key={item.slug}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
