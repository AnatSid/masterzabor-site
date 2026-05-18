import Link from "next/link";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  ADDRESS,
  BANK_DETAILS,
  COMPANY_NAME,
  DIRECTOR,
  PHONE,
  PHONE_DISPLAY,
  TELEGRAM_LINK,
  UNP,
  VIBER_LINK,
  WHATSAPP_LINK,
  WORKING_HOURS,
} from "@/lib/constants";
import { generateBreadcrumbJsonLd, generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Контакты МастерЗабор — Гомель | Телефон и адрес",
  description:
    "Контакты МастерЗабор: телефон, мессенджеры, адрес в Гомеле, реквизиты и график работы. Оставьте заявку, чтобы получить расчёт стоимости забора.",
  path: "/kontakty/",
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Главная", url: "/" },
  { name: "Контакты", url: "/kontakty/" },
]);

const messengers = [
  { label: "Telegram", href: TELEGRAM_LINK },
  { label: "WhatsApp", href: WHATSAPP_LINK },
  { label: "Viber", href: VIBER_LINK },
] as const;

export default function KontaktyPage() {
  return (
    <main className="bg-white text-slate-900">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />

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
              <li className="text-white">Контакты</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Контакты МастерЗабор — Гомель
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-200">
            Свяжитесь с нами удобным способом. Рассчитаем стоимость забора по
            телефону и подскажем оптимальную комплектацию под ваш объект.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Контактные данные</h2>
            <div className="mt-6 space-y-5 text-slate-700">
              <p>
                <span className="font-semibold text-slate-950">Телефон:</span>{" "}
                <a className="text-[#1B5E20] hover:underline" href={`tel:${PHONE}`}>
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <span className="font-semibold text-slate-950">Адрес:</span>{" "}
                {ADDRESS}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Режим работы:</span>{" "}
                {WORKING_HOURS}
              </p>
              <p>
                <span className="font-semibold text-slate-950">УНП:</span> {UNP}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Директор:</span>{" "}
                {DIRECTOR}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Банковские реквизиты:</span>{" "}
                {BANK_DETAILS}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {messengers.map((item) => (
                <a
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1B5E20] hover:text-[#1B5E20]"
                  href={item.href}
                  key={item.label}
                  rel="noopener noreferrer"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=52.4345,30.9754&z=16&output=embed"
              title={`${COMPANY_NAME} на карте`}
            />
          </section>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16" id="lead-form">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#1B5E20]">
              Бесплатный расчёт
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Оставьте заявку на обратный звонок
            </h2>
            <p className="mt-5 text-slate-600">
              Укажите номер и параметры проекта. Мы перезвоним в течение
              рабочего дня и подготовим расчёт стоимости под ваш объект.
            </p>
          </div>
          <LeadForm source="contacts-page" variant="full" />
        </div>
      </section>
    </main>
  );
}
