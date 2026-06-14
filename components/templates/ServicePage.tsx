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

const priceMultipliers = [
  {
    name: "Эконом",
    multiplier: 1,
    description: "Базовое решение для дачи, временного ограждения или простого участка.",
  },
  {
    name: "Стандарт",
    multiplier: 1.25,
    description: "Оптимальная комплектация для частного дома с усиленным каркасом.",
  },
  {
    name: "Премиум",
    multiplier: 1.55,
    description: "Максимальная жёсткость, аккуратный внешний вид и расширенная комплектация.",
  },
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
        <p className="text-lg leading-relaxed text-slate-200">
          {service.heroSubtitle.lead}
        </p>
        <p className="text-base font-medium leading-relaxed text-slate-300/85">
          {service.heroSubtitle.accent}
        </p>
      </div>
    );
  }

  return (
    <p className="mt-6 min-w-0 max-w-2xl text-lg leading-relaxed text-slate-200">
      {service.description}
    </p>
  );
}

export function ServicePage({ service }: ServicePageProps) {
  const quizDefaults = getQuizDefaultsByServiceSlug(service.slug);
  const relatedServices = services.filter((item) => item.slug !== service.slug);
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

      <section className="bg-slate-950 text-white">
        <SiteContainer className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,420px)] lg:items-start lg:py-20">
          <div className="min-w-0">
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
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              <span className="sm:whitespace-nowrap">{service.title}</span>
              <br />
              <span className="sm:whitespace-nowrap">в Беларуси под ключ</span>
            </h1>
            <ServiceHeroSubtitle service={service} />
            <p className="mt-6 text-3xl font-bold text-amber-300">
              от {service.priceFrom} {service.priceUnit}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex justify-center rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600"
                href="#lead-form"
              >
                Рассчитать стоимость
              </a>
              <TrackedContactLink
                channel="click_call"
                className="inline-flex justify-center rounded-xl bg-white px-6 py-3 font-bold text-[#1B5E20] transition hover:bg-slate-100"
                eventLocation="service_hero"
                href={`tel:${PHONE}`}
                source={`service-${service.slug}`}
              >
                Позвонить: {PHONE_DISPLAY}
              </TrackedContactLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] min-h-64 w-full overflow-hidden rounded-3xl sm:min-h-72 lg:aspect-auto lg:min-h-[420px]">
            <Image
              alt={`${service.title} — пример установки в Беларуси`}
              className="object-cover"
              fill
              priority
              src={imagePlaceholder(service.title, 0)}
            />
          </div>
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Преимущества
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.features.map((feature, index) => (
              <article className="rounded-2xl bg-[#F5F5F5] p-6" key={feature}>
                <div className="flex size-11 items-center justify-center rounded-full bg-[#1B5E20] font-bold text-white">
                  {index + 1}
                </div>
                <p className="mt-5 font-semibold leading-6">{feature}</p>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Таблица цен
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-4">Комплектация</th>
                  <th className="px-6 py-4">Цена от</th>
                  <th className="px-6 py-4">Что входит</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {priceMultipliers.map((item) => (
                  <tr key={item.name}>
                    <td className="px-6 py-5 font-bold">{item.name}</td>
                    <td className="px-6 py-5 text-[#1B5E20] font-bold">
                      от {Math.round(service.priceFrom * item.multiplier)}{" "}
                      {service.priceUnit}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Цены ориентировочные. Точный расчёт зависит от длины, высоты,
            комплектации, доставки и особенностей участка.
          </p>
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Этапы работы
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {stages.map((stage, index) => (
              <article className="rounded-2xl border border-slate-200 p-5" key={stage}>
                <div className="text-sm font-bold text-[#1B5E20]">
                  0{index + 1}
                </div>
                <h3 className="mt-3 font-bold">{stage}</h3>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <SiteContainer>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Галерея
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Image
                alt={`${service.title} — фото объекта ${index + 1}`}
                className="h-60 rounded-2xl object-cover shadow-sm"
                height={420}
                key={index}
                src={imagePlaceholder(service.title, index + 1)}
                width={620}
              />
            ))}
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

      <section className="bg-[#1B5E20] py-16" id="lead-form">
        <SiteContainer className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-white">
            <p className="font-semibold uppercase tracking-wide text-amber-300">
              Получите расчёт по телефону
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Узнайте цену на {service.title.toLowerCase()}
            </h2>
            <p className="mt-5 text-green-50">
              Оставьте номер, примерную длину и пожелания. Перезвоним,
              рассчитаем стоимость за 5 минут и предложим подходящую
              комплектацию.
            </p>
          </div>
          <QuizForm source={`service-${service.slug}`} {...quizDefaults} />
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
    </main>
  );
}
