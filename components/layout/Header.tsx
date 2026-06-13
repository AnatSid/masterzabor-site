"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COMPANY_NAME,
  PHONE,
  PHONE_DISPLAY,
  TELEGRAM_LINK,
  VIBER_LINK,
  WHATSAPP_LINK,
} from "@/lib/constants";

const navigation = [
  { label: "Профнастил", href: "/zabory-iz-profnastila" },
  { label: "Штакетник", href: "/zabory-iz-evroshtaketnika" },
  { label: "Сетка-рабица", href: "/zabory-iz-setki-rabitsy" },
  { label: "Наши работы", href: "/nashi-raboty" },
  { label: "Контакты", href: "/kontakty" },
] as const;

const gateNavigation = [
  { label: "Ворота распашные", href: "/vorota-raspashnye" },
  { label: "Ворота откатные", href: "/vorota-otkatnye" },
  { label: "Калитки", href: "/kalitki" },
] as const;

const iconClassName = "h-[22px] w-[22px]";

function TelegramIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.4 0C8.493.04 2.67 1.177.5 6.988c-.946 2.602-.908 5.983-.908 5.983S-.694 17.1 3.33 20.15v2.902s-.026 1.044.69.95c.883-.112 4.088-3.866 4.088-3.866 3.17.81 5.61.358 5.89.268 1.626-.52 10.764-1.528 12.002-12.492C27.37 1.038 20.354-.11 11.4 0zm-.01 2.022c7.59-.116 12.882.974 11.82 10.49-1.002 8.823-8.224 9.462-9.584 9.882-.238.075-2.374.456-5.148-.27l-.587-.16-.504.51s-1.893 2.08-2.84 2.95V22.48l-.458-.337C1.11 19.626 1.67 15.96 1.7 15.72c-.012.1-.05-2.7.71-4.804C3.81 5.7 8.498 4.09 11.39 4.022zm-.398 1.793c-.276.006-.556.032-.837.078-.283.046-.571.121-.865.227C8.093 4.553 5.33 6.25 4.446 9.41c-.63 2.264-.578 4.785-.578 4.785s-.47 3.06 2.064 5.004l.046.033.004 1.393 1.463-1.572.155.04c2.382.617 4.216.244 4.216.244 1.108-.354 7.34-.895 8.174-8.534.82-7.573-4.297-9.026-8.998-8.988zm-.058 2.025l.01.012c1.15.01 2.34.324 3.285 1.01.47.337.912.77 1.273 1.308.36.538.622 1.196.72 1.964.03.222-.127.426-.349.456-.222.03-.426-.127-.456-.349-.08-.607-.285-1.12-.566-1.547-.28-.427-.632-.78-1.014-1.046-.763-.547-1.73-.806-2.666-.816-.223-.004-.4-.186-.397-.41.004-.222.186-.4.408-.397l-.248-.185zm.126 1.854c1.54.034 2.758 1.073 2.99 2.727.03.22-.125.426-.347.457-.22.03-.426-.126-.457-.347-.17-1.213-1.016-1.938-2.147-1.964-.224-.005-.4-.19-.395-.413.005-.224.19-.4.413-.395l-.057-.065zm-2.994.264c.375.006.74.086 1.073.25.456.222 1.188.752 1.428 2.155.073.424.095.757.097 1.003.002.184-.02.33-.059.44-.037.11-.087.183-.158.24-.143.117-.312.122-.416.118-.105-.004-.185-.022-.185-.022-.188-.046-.302-.235-.256-.424 0 0 .028-.134.044-.367.016-.233.014-.538-.055-.955-.187-1.09-.654-1.44-.956-1.589-.182-.088-.38-.137-.583-.14-.224-.004-.402-.188-.398-.41.004-.221.188-.398.41-.4l.014.1zm1.36 4.1c.127-.002.254.047.35.146.534.556 1.03.59 1.03.59.221.014.39.207.375.429-.014.222-.207.39-.429.375 0 0-.74-.04-1.468-.812-.153-.16-.148-.415.012-.568.076-.073.174-.11.274-.112l-.145-.048z" />
    </svg>
  );
}

const messengers = [
  {
    label: "Telegram",
    href: TELEGRAM_LINK,
    color: "#229ED9",
    icon: TelegramIcon,
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_LINK,
    color: "#25D366",
    icon: WhatsAppIcon,
  },
  {
    label: "Viber",
    href: VIBER_LINK,
    color: "#7360F2",
    icon: ViberIcon,
  },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGateMenuOpen, setIsGateMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setIsGateMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    if (isOpen) {
      closeMobileMenu();
      return;
    }

    setIsOpen(true);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-shadow ${
        hasShadow ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          className="text-2xl font-bold tracking-tight text-[#1B5E20]"
          href="/"
          onClick={closeMobileMenu}
        >
          {COMPANY_NAME}
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {navigation.slice(0, 3).map((item) => (
            <Link
              className="transition hover:text-[#1B5E20]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 transition hover:text-[#1B5E20]"
              type="button"
            >
              Ворота
              <span className="text-xs">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {gateNavigation.map((item) => (
                <Link
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-[#1B5E20]"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {navigation.slice(3).map((item) => (
            <Link
              className="transition hover:text-[#1B5E20]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            className="font-semibold text-[#1B5E20] transition hover:text-green-800"
            href={`tel:${PHONE}`}
          >
            {PHONE_DISPLAY}
          </a>
          <div className="flex items-start gap-3">
            {messengers.map((item) => (
              <a
                aria-label={item.label}
                className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-105"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                style={{ color: item.color }}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                <item.icon />
                <span className="text-[10px] leading-none">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a className="font-semibold text-[#1B5E20]" href={`tel:${PHONE}`}>
            {PHONE_DISPLAY}
          </a>
          <button
            aria-expanded={isOpen}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-slate-300 text-slate-900"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className="text-2xl leading-none">{isOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[69px] z-30 bg-slate-950/40 transition lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />
      <aside
        className={`fixed right-0 top-[69px] z-40 h-[calc(100dvh-69px)] w-80 max-w-[85vw] bg-white p-6 shadow-2xl transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {navigation.slice(0, 3).map((item) => (
            <Link
              className="rounded-lg px-3 py-3 font-medium text-slate-800 transition hover:bg-slate-100 hover:text-[#1B5E20]"
              href={item.href}
              key={item.href}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          <div className="rounded-lg">
            <button
              aria-controls="mobile-gates-menu"
              aria-expanded={isGateMenuOpen}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-medium text-slate-800 transition hover:bg-slate-100 hover:text-[#1B5E20]"
              onClick={() => setIsGateMenuOpen((value) => !value)}
              type="button"
            >
              <span>Ворота</span>
              <span className="text-xs">{isGateMenuOpen ? "▴" : "▾"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all ${
                isGateMenuOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
              }`}
              id="mobile-gates-menu"
            >
              <div className="ml-3 flex flex-col border-l border-slate-200 pl-3">
                {gateNavigation.map((item) => (
                  <Link
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#1B5E20]"
                    href={item.href}
                    key={item.href}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navigation.slice(3).map((item) => (
            <Link
              className="rounded-lg px-3 py-3 font-medium text-slate-800 transition hover:bg-slate-100 hover:text-[#1B5E20]"
              href={item.href}
              key={item.href}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <a
            className="block text-lg font-bold text-[#1B5E20]"
            href={`tel:${PHONE}`}
          >
            {PHONE_DISPLAY}
          </a>
          <div className="mt-4 flex gap-4">
            {messengers.map((item) => (
              <a
                aria-label={item.label}
                className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-105"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                style={{ color: item.color }}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                <item.icon />
                <span className="text-[10px] leading-none">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
