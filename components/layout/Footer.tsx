import Link from "next/link";
import {
  ADDRESS,
  COMPANY_NAME,
  PHONE,
  PHONE_DISPLAY,
  TELEGRAM_LINK,
  UNP,
  VIBER_LINK,
  WHATSAPP_LINK,
  WORKING_HOURS,
} from "@/lib/constants";

const footerNavigation = [
  { label: "Главная", href: "/" },
  { label: "Цены", href: "/tseny" },
  { label: "Наши работы", href: "/nashi-raboty" },
  { label: "Отзывы", href: "/otzyvy" },
  { label: "Контакты", href: "/kontakty" },
  { label: "Блог", href: "/blog" },
] as const;

const footerServices = [
  { label: "Профнастил", href: "/zabory-iz-profnastila" },
  { label: "Евроштакетник", href: "/zabory-iz-evroshtaketnika" },
  { label: "Сетка-рабица", href: "/zabory-iz-setki-rabitsy" },
  { label: "Ворота распашные", href: "/vorota-raspashnye" },
  { label: "Ворота откатные", href: "/vorota-otkatnye" },
  { label: "Калитки", href: "/kalitki" },
] as const;

const messengers = [
  { label: "Telegram", href: TELEGRAM_LINK },
  { label: "WhatsApp", href: WHATSAPP_LINK },
  { label: "Viber", href: VIBER_LINK },
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <section>
          <Link className="text-2xl font-bold text-white" href="/">
            {COMPANY_NAME}
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Установка заборов в Беларуси с 2015 года. Работаем с частными
            участками, дачами и коммерческими объектами.
          </p>
          <p className="mt-4 text-sm text-slate-400">УНП {UNP}</p>
        </section>

        <nav aria-label="Навигация в подвале">
          <h2 className="text-base font-semibold">Навигация</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Услуги в подвале">
          <h2 className="text-base font-semibold">Услуги</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {footerServices.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section>
          <h2 className="text-base font-semibold">Контакты</h2>
          <address className="mt-4 space-y-3 text-sm not-italic leading-6 text-slate-300">
            <p>
              <a className="transition hover:text-white" href={`tel:${PHONE}`}>
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>{ADDRESS}</p>
            <p>{WORKING_HOURS}</p>
          </address>
          <div className="mt-5 flex flex-wrap gap-3">
            {messengers.map((item) => (
              <a
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">
        © 2015-2026 {COMPANY_NAME}. Все права защищены.
      </div>
    </footer>
  );
}
