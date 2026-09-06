import Image from "next/image";
import Link from "next/link";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { QuizForm } from "@/components/forms/QuizForm";
import {
  serviceProseClassName,
  SiteContainer,
} from "@/components/layout/SiteContainer";
import { cities } from "@/content/cities";
import { services, type Service } from "@/content/services";
import { PHONE, PHONE_DISPLAY } from "@/lib/constants";
import {
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
  generateProductJsonLd,
} from "@/lib/seo";

type ServicePageProps = {
  service: Service;
};

const stages = [
  "Расчёт",
  "Консультация",
  "Договор",
  "Доставка",
  "Монтаж",
  "Гарантия",
] as const;

const priorityCities = cities.filter((city) =>
  [
    "gomel",
    "minsk",
    "brest",
    "grodno",
    "vitebsk",
    "mogilev",
    "mozyr",
    "bobruysk",
  ].includes(city.slug),
);

const pricingFactors = [
  "материал и покрытие",
  "размеры объекта",
  "основание, столбы и особенности участка",
  "ворота, калитка и комплектация",
] as const;

const sectionIntroClassName =
  "w-full max-w-none lg:max-w-[70%] xl:max-w-[56rem]";

const sectionSubtitleClassName =
  "mt-4 text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]";

function imagePlaceholder(title: string, index: number) {
  const colors = ["#1B5E20", "#2E7D32", "#F59E0B", "#475569", "#166534", "#92400E"];
  const color = colors[index % colors.length];
  const svg = `
    <svg width="900" height="640" viewBox="0 0 900 640" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="640" fill="#F5F5F5"/>
      <rect y="365" width="900" height="275" fill="${color}"/>
      <path d="M0 360L900 235V365H0Z" fill="#E2E8F0"/>
      <g stroke="white" stroke-width="16" stroke-linecap="round">
        <path d="M95 405V590"/>
        <path d="M245 385V590"/>
        <path d="M395 365V590"/>
        <path d="M545 345V590"/>
        <path d="M695 325V590"/>
        <path d="M845 305V590"/>
        <path d="M75 445H865"/>
        <path d="M75 520H865"/>
      </g>
      <text x="55" y="105" fill="#0F172A" font-size="40" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function serviceSeoText(service: Service) {
  return [
    `${service.title} под ключ — это решение для тех, кто хочет заранее понимать бюджет, сроки и итоговый внешний вид участка. Мы работаем из Гомеля по всей Беларуси: клиент сообщает примерную длину ограждения, высоту, материал и пожелания по воротам, после чего специалист рассчитывает стоимость по телефону. Такой подход экономит время: не нужно ждать отдельной поездки только ради предварительной цены, а мастера выезжают уже на заключение договора и подготовку объекта к работам.`,
    `Для услуги «${service.title.toLowerCase()}» мы подбираем конструкцию под грунт, рельеф, назначение участка и интенсивность эксплуатации. В расчёт входят материалы, каркас, крепёж, доставка, монтаж и дополнительные элементы. Если нужен фасадный аккуратный вид, делаем упор на геометрию, цвет и совместимость с воротами. Если важна практичность, предлагаем усиленные столбы, оптимальную высоту и долговечное покрытие. Каждый проект фиксируется в смете, поэтому клиент заранее понимает, за что платит.`,
    `Монтаж выполняют постоянные бригады. Перед началом работ согласуем линию ограждения, расположение калитки и ворот, порядок доставки материалов и сроки. На объекте мастера проверяют перепады высот, выставляют столбы, собирают каркас и монтируют заполнение. После завершения клиент получает готовую конструкцию с гарантией. Мы не навязываем лишние опции: предлагаем несколько комплектаций — от базовой до премиальной — и объясняем, где усиление действительно нужно, а где можно сэкономить без потери надёжности.`,
    `Заказать ${service.title.toLowerCase()} можно для частного дома, дачи, производственной территории или нового участка. Работаем с объектами в Гомеле, Минске, Бресте, Гродно, Витебске, Могилёве и других городах Беларуси. Чтобы получить предварительную цену, достаточно оставить номер телефона или позвонить: рассчитаем стоимость за 5 минут и предложим понятный следующий шаг.`,
  ];
}

function getQuizDefaultsByServiceSlug(serviceSlug: string) {
  switch (serviceSlug) {
    case "zabory-iz-profnastila":
      return { defaultFenceType: "Профнастил" };
    case "zabory-iz-evroshtaketnika":
      return { defaultFenceType: "Евроштакетник" };
    case "zabory-iz-setki-rabitsy":
      return { defaultFenceType: "Сетка-рабица" };
    case "vorota-raspashnye":
      return { defaultGateType: "Распашные" };
    case "vorota-otkatnye":
      return { defaultGateType: "Откатные" };
    case "kalitki":
      return { defaultWicketType: "Калитка с замком" };
    default:
      return {};
  }
}

function ServiceHeroSubtitle({ service }: { service: Service }) {
  if (service.heroSubtitle) {
    return (
      <div className="mt-6 min-w-0 max-w-2xl space-y-4">
        <p className="text-lg leading-relaxed text-slate-700">
          {service.heroSubtitle.lead}
        </p>
        <p className="text-base font-medium leading-relaxed text-slate-600">
          {service.heroSubtitle.accent}
        </p>
      </div>
    );
  }

  return (
    <p className="mt-6 min-w-0 max-w-2xl text-lg leading-relaxed text-slate-700">
      {service.description}
    </p>
  );
}

function CheckIcon({ tone = "brand" }: { tone?: "brand" | "light" } = {}) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full text-xs ${
        tone === "light"
          ? "bg-white/15 text-white ring-1 ring-white/25"
          : "bg-[#0A5633] text-white"
      }`}
    >
      ✓
    </span>
  );
}

export function ServicePage({ service }: ServicePageProps) {
  const quizDefaults = getQuizDefaultsByServiceSlug(service.slug);
  const relatedServices = services.filter((item) => item.slug !== service.slug);
  const heroImage = service.heroImage ?? {
    src: imagePlaceholder(service.title, 0),
    alt: `${service.title} — пример установки в Беларуси`,
  };
  const heroImageObjectPosition = heroImage.objectPosition ?? "center";
  const galleryImages: NonNullable<Service["galleryImages"]> =
    service.galleryImages ??
    Array.from({ length: 6 }, (_, index) => ({
      src: imagePlaceholder(service.title, index + 1),
      alt: `${service.title} — фото объекта ${index + 1}`,
    }));
  const breadcrumbs = [
    { name: "Главная", url: "/" },
    { name: service.title, url: `/${service.slug}` },
  ];
  const productJsonLd = generateProductJsonLd({
    name: service.title,
    description: service.description,
    price: service.priceFrom,
    currency: "BYN",
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const faqJsonLd = generateFaqJsonLd(service.faq);

  return (
    <main className="bg-white text-slate-900">
      {[productJsonLd, breadcrumbJsonLd, faqJsonLd].map((jsonLd, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}

      <section className="relative overflow-hidden bg-[#F6F8F5]">
        <SiteContainer className="relative grid gap-8 pb-8 pt-6 sm:pb-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:items-center lg:gap-12 lg:pb-16 lg:pt-20">
          <div className="min-w-0">
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
            <p className="mt-8 text-sm font-semibold uppercase text-[#0A5633]">
              Услуга под ключ
            </p>
            <h1 className="mt-4 text-balance text-[1.9rem] font-extrabold leading-[1.08] tracking-tight text-[#202020] sm:text-6xl lg:text-[3.25rem]">
              <span>{service.title}</span>
              <br />
              <span>
                в Беларуси <span className="text-[#0A5633]">под ключ</span>
              </span>
            </h1>
            <ServiceHeroSubtitle service={service} />
            <div className="mt-6 inline-flex flex-col rounded-2xl border border-[#b9d7c6] bg-white px-5 py-4 shadow-lg shadow-green-950/10">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ориентир по цене
              </span>
              <span className="mt-1 text-3xl font-extrabold leading-tight text-[#0A5633]">
                от {service.priceFrom} {service.priceUnit}
              </span>
            </div>
            <div className="mt-6 grid gap-2 sm:mt-8 sm:flex sm:flex-row sm:gap-4">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A5633] px-4 py-2 text-xs font-bold leading-tight text-white shadow-lg shadow-green-950/10 transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                href="#lead-form"
              >
                Рассчитать стоимость
              </a>
              <TrackedContactLink
                channel="click_call"
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#b9d7c6] bg-white px-4 py-2 text-xs font-bold leading-tight text-[#0A5633] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                eventLocation="service_hero"
                href={`tel:${PHONE}`}
                source={`service-${service.slug}`}
              >
                Позвонить: {PHONE_DISPLAY}
              </TrackedContactLink>
            </div>
          </div>

          <div className="service-hero-image-frame relative aspect-[4/3] min-h-64 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-green-950/10 sm:min-h-72 lg:aspect-square lg:min-h-0">
            <Image
              alt={heroImage.alt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 480px"
              src={heroImage.src}
              style={{ objectPosition: heroImageObjectPosition }}
            />
          </div>
        </SiteContainer>
      </section>

      <section className="py-12 sm:py-16">
        <SiteContainer className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#0A5633]">
              Почему выбирают
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Преимущества
            </h2>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li
                className="flex gap-3 border-t border-slate-200 pt-4 text-sm font-semibold leading-6 text-slate-800 sm:text-base sm:leading-7"
                key={feature}
              >
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-12 sm:py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Галерея
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
                key={image.src}
              >
                <Image
                  alt={image.alt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={image.src}
                  style={{ objectPosition: image.objectPosition ?? "center" }}
                />
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="py-12 sm:py-16">
        <SiteContainer className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className={sectionIntroClassName}>
            <p className="font-semibold uppercase tracking-wide text-[#0A5633]">
              Стоимость услуги
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ориентир по цене
            </h2>
            <p className={sectionSubtitleClassName}>
              Цена на {service.title.toLowerCase()} начинается от указанного
              ориентира. Итоговую стоимость считаем под конкретный объект после
              уточнения параметров.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A5633] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-950/10 transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2"
                href="#lead-form"
              >
                Получить расчёт
              </a>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#b9d7c6] bg-white px-5 py-3 text-sm font-bold text-[#0A5633] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2"
                href="/tseny"
              >
                Смотреть все цены
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Базовый ориентир
            </p>
            <p className="mt-2 text-4xl font-extrabold leading-tight text-[#0A5633] sm:text-5xl">
              от {service.priceFrom} {service.priceUnit}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Это не фиксированный прайс для любого участка. На расчёт влияют
              параметры объекта и выбранная комплектация.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {pricingFactors.map((factor) => (
                <li
                  className="flex gap-3 text-sm font-semibold leading-6 text-slate-800"
                  key={factor}
                >
                  <CheckIcon />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </SiteContainer>
      </section>

      <section className="bg-[#F6F8F5] py-12 sm:py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <p className="font-semibold uppercase tracking-wide text-[#0A5633]">
              Как работаем
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Этапы работы
            </h2>
            <p className={sectionSubtitleClassName}>
              После предварительного расчёта фиксируем договорённости и ведём
              объект до готового монтажа.
            </p>
          </div>
          <ol className="mt-10 grid gap-0 md:grid-cols-3 md:gap-y-8 xl:grid-cols-6 xl:gap-y-0">
            {stages.map((stage) => (
              <li
                className="relative border-l border-[#b9d7c6] pb-7 pl-6 last:border-l-0 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-8 md:pt-6"
                key={stage}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[0.4375rem] top-0 size-3.5 rounded-full bg-[#0A5633] ring-4 ring-[#F6F8F5] md:-top-[0.4375rem] md:left-0"
                />
                <h3 className="font-bold leading-tight text-slate-950">
                  {stage}
                </h3>
              </li>
            ))}
          </ol>
        </SiteContainer>
      </section>

      <section className="bg-[#F6F8F5] py-12 sm:py-16" id="lead-form">
        <SiteContainer>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-green-950/10">
            <div className="grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
              <div className="relative flex flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_100%_100%,rgba(246,248,245,0.24)_0%,rgba(246,248,245,0.12)_30%,transparent_58%),linear-gradient(135deg,#0A5633_0%,#17652E_58%,#2D7D3C_100%)] p-5 text-white sm:p-8 lg:p-9">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-white/30"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -right-16 size-44 rounded-full bg-white/10 blur-2xl"
                />
                <div className="relative max-w-sm">
                  <p className="font-semibold uppercase tracking-wide text-amber-300">
                    Бесплатный расчёт
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Рассчитаем стоимость на {service.title.toLowerCase()}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                    Ответьте на несколько вопросов — этого достаточно, чтобы
                    понять параметры объекта и вернуться к вам с понятным
                    ориентиром по цене.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm font-medium leading-snug text-green-50/90 sm:text-[0.9375rem]">
                    {[
                      "Можно указать примерные размеры",
                      "Детали уточним по телефону",
                      "Получите понятный ориентир и спокойно примете решение",
                    ].map((item) => (
                      <li className="flex gap-2.5" key={item}>
                        <CheckIcon tone="light" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white p-3 max-md:[&>form]:pb-24 sm:p-5">
                <QuizForm
                  presentation="compact"
                  source={`service-${service.slug}`}
                  {...quizDefaults}
                />
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer>
          <article className={serviceProseClassName}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {service.title}: что важно знать
          </h2>
          <div className="mt-6 space-y-6">
            {serviceSeoText(service).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          </article>
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Частые вопросы
          </h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {service.faq.map((item) => (
              <details className="group p-6" key={item.question}>
                <summary className="cursor-pointer list-none font-semibold">
                  {item.question}
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <SiteContainer className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Другие услуги
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedServices.map((item) => (
                <Link
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#1B5E20] hover:text-white"
                  href={`/${item.slug}`}
                  key={item.slug}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Работаем в городах
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {priorityCities.map((city) => (
                <Link
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#1B5E20] hover:text-white"
                  href={`/${city.slug}`}
                  key={city.slug}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
