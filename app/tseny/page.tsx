import Image from "next/image";
import Link from "next/link";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { QuizForm } from "@/components/forms/QuizForm";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { services, type Service } from "@/content/services";
import { PHONE, PHONE_DISPLAY } from "@/lib/constants";
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

const serviceCardCopy: Record<string, { text: string; linkLabel: string }> = {
  "zabory-iz-profnastila": {
    text: "Практичный сплошной вариант для частного участка.",
    linkLabel: "Подробнее о профнастиле",
  },
  "zabory-iz-evroshtaketnika": {
    text: "Аккуратный фасадный забор с вентиляцией и современным видом.",
    linkLabel: "Подробнее о евроштакетнике",
  },
  "zabory-iz-setki-rabitsy": {
    text: "Доступное решение для дачи, сада или большого периметра.",
    linkLabel: "Подробнее о сетке-рабице",
  },
  "vorota-raspashnye": {
    text: "Классический въезд под размер проёма и стиль забора.",
    linkLabel: "Подробнее о распашных воротах",
  },
  "vorota-otkatnye": {
    text: "Удобный въезд, когда важно сохранить место перед воротами.",
    linkLabel: "Подробнее об откатных воротах",
  },
  kalitki: {
    text: "Аккуратный проход в едином стиле с ограждением.",
    linkLabel: "Подробнее о калитках",
  },
};

const costFactors = [
  {
    title: "Материал и покрытие",
    text: "Профнастил, евроштакетник, сетка-рабица и варианты заполнения отличаются по стоимости материалов и комплектующих.",
  },
  {
    title: "Длина и высота",
    text: "Чем длиннее и выше забор, тем больше требуется материалов и монтажных работ.",
  },
  {
    title: "Столбы, основание и особенности участка",
    text: "При расчёте учитываем выбранную конструкцию, основание, грунт и перепады участка.",
  },
  {
    title: "Ворота и калитка",
    text: "Въездная группа считается отдельно, если она нужна в проекте.",
  },
  {
    title: "Комплектация и пожелания",
    text: "Цвет, фурнитура, замки, автоматика и дополнительные решения учитываются только при необходимости.",
  },
] as const;

function ServicePriceCard({
  service,
}: {
  service: Service;
}) {
  const copy = serviceCardCopy[service.slug];

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl">
      <div className="relative aspect-[4/3] min-h-56 w-full overflow-hidden bg-slate-100">
        <Image
          alt={service.title}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={service.imageSrc}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
          <p className="inline-flex rounded-lg bg-white px-3 py-2 text-base font-extrabold leading-tight text-[#0A5633] shadow-sm">
            от {service.priceFrom} {service.priceUnit}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-xl font-bold leading-tight text-slate-950">
          {service.title}
        </h3>
        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
          {copy.text}
        </p>
        <Link
          className="mt-5 inline-flex min-h-9 items-center font-semibold text-[#1B5E20] transition hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2"
          href={`/${service.slug}`}
        >
          {copy.linkLabel} →
        </Link>
      </div>
    </article>
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

const sectionIntroClassName =
  "w-full max-w-none lg:max-w-[70%] xl:max-w-[56rem]";

const sectionSubtitleClassName =
  "mt-4 text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]";

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

        <SiteContainer className="relative pb-6 pt-6 sm:pb-10 sm:pt-16 lg:pb-14 lg:pt-20">
          <div className="max-w-2xl lg:max-w-[48%]">
            <nav aria-label="Хлебные крошки" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link className="hover:text-[#0A5633]" href="/">
                    Главная
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700">Цены</li>
              </ol>
            </nav>

            <p className="mt-8 text-sm font-semibold uppercase text-[#0A5633]">
              Ориентиры для расчёта
            </p>
            <h1 className="mt-4 text-balance text-[1.9rem] font-extrabold leading-[1.08] tracking-tight text-[#202020] sm:text-6xl lg:text-[3.25rem]">
              Цены на заборы в Беларуси — 2026
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
              На этой странице указаны стартовые ориентиры по популярным
              услугам. Итоговую стоимость рассчитываем под конкретный объект
              после уточнения параметров.
            </p>
            <ul className="mt-5 max-w-xl space-y-2 text-sm font-semibold leading-snug text-slate-700 sm:text-base">
              <li className="flex gap-2">
                <CheckIcon />
                <span>цены показывают минимальный ориентир по типу услуги</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon />
                <span>расчёт готовим после уточнения объекта</span>
              </li>
            </ul>
            <div className="mt-6 grid gap-2 sm:mt-8 sm:flex sm:flex-row sm:gap-4">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A5633] px-4 py-2 text-xs font-bold leading-tight text-white shadow-lg shadow-green-950/10 transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                href="#lead-form"
              >
                Получить расчёт
              </a>
              <TrackedContactLink
                channel="click_call"
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#b9d7c6] bg-white px-4 py-2 text-xs font-bold leading-tight text-[#0A5633] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                eventLocation="prices_hero"
                href={`tel:${PHONE}`}
                source="prices-page-hero"
              >
                Позвонить: {PHONE_DISPLAY}
              </TrackedContactLink>
            </div>
          </div>

          <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-green-950/10 lg:hidden">
            <Image
              alt="Забор из профнастила на участке в Беларуси"
              className="object-cover object-center"
              fill
              sizes="100vw"
              src="/images/hero/homepage-fence-with-logo.jpeg"
            />
          </div>
        </SiteContainer>
      </section>

      <section className="py-6 sm:py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Заборы
            </h2>
            <p className={`${sectionSubtitleClassName} hidden sm:block`}>
              Выберите тип ограждения, чтобы посмотреть подробности по
              материалу, монтажу и комплектации.
            </p>
          </div>
          <div className="mt-3 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            {fenceServices.map((service) => (
              <ServicePriceCard key={service.slug} service={service} />
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="bg-[#F5F5F5] py-12 sm:py-16">
        <SiteContainer>
          <div className={sectionIntroClassName}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ворота и калитки
            </h2>
            <p className={sectionSubtitleClassName}>
              Въездная группа зависит от размера проёма, заполнения, фурнитуры
              и подготовки под ежедневное использование.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gateServices.map((service) => (
              <ServicePriceCard key={service.slug} service={service} />
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
            Все цены ориентировочные и не являются публичной офертой.
            Окончательная стоимость фиксируется в договоре после уточнения
            параметров объекта.
          </p>
        </SiteContainer>
      </section>

      <section className="py-16">
        <SiteContainer className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#0A5633]">
              Стоимость объекта
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              От чего зависит стоимость
            </h2>
            <p className="mt-5 max-w-none text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]">
              Два забора одинаковой длины могут стоить по-разному: меняются
              материал, высота, основание, въездная группа и комплектация. Мы
              уточняем параметры и считаем объект без автоматических доплат.
            </p>
          </div>
          <ul className="space-y-4">
            {costFactors.map((factor) => (
              <li
                className="flex gap-3 border-b border-slate-200 pb-4 last:border-b-0"
                key={factor.title}
              >
                <CheckIcon />
                <div className="min-w-0">
                  <h3 className="font-bold leading-tight text-slate-950">
                    {factor.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {factor.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SiteContainer>
      </section>

      <section className="bg-[#F6F8F5] py-16">
        <SiteContainer className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#0A5633]">
              Что нужно для расчёта
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Для расчёта достаточно примерных данных
            </h2>
            <p className="mt-5 max-w-none text-pretty leading-relaxed text-slate-600 md:text-[1.0625rem] md:leading-[1.65]">
              Если точных размеров пока нет, назовите приблизительные данные.
              Детали уточним по телефону и подготовим расчёт под ваш объект.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-16">
            {[
              [
                "выбрать тип забора",
                "знать примерную длину",
                "выбрать желаемую высоту",
              ],
              [
                "понять, нужны ли ворота или калитка",
                "назвать населённый пункт",
                "оставить номер телефона для связи",
              ],
            ].map((column, columnIndex) => (
              <ul className="space-y-4" key={columnIndex}>
                {column.map((item) => (
                  <li
                    className="flex gap-3 text-sm font-semibold text-slate-800 sm:text-base"
                    key={item}
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
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
                    Рассчитаем стоимость под ваш участок
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                    Ответьте на несколько вопросов — этого достаточно, чтобы
                    понять, что вам нужно, и вернуться к вам с понятным
                    ориентиром по цене.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm font-medium leading-snug text-green-50/90 sm:text-[0.9375rem]">
                    {[
                      "Можно указать примерные размеры",
                      "Детали уточним по телефону",
                      "Узнаете стоимость и сможете сравнить варианты",
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
              <div className="bg-white p-3 sm:p-5">
                <QuizForm presentation="compact" source="prices-page" />
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
