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
  { label: "Профнастил", href: "/zabory-iz-profnastila/" },
  { label: "Штакетник", href: "/zabory-iz-evroshtaketnika/" },
  { label: "Сетка-рабица", href: "/zabory-iz-setki-rabitsy/" },
  { label: "Наши работы", href: "/nashi-raboty/" },
  { label: "Контакты", href: "/kontakty/" },
] as const;

const gateNavigation = [
  { label: "Ворота распашные", href: "/vorota-raspashnye/" },
  { label: "Ворота откатные", href: "/vorota-otkatnye/" },
  { label: "Калитки", href: "/kalitki/" },
] as const;

const iconClassName = "h-6 w-6";

function TelegramIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.53 4.46a1 1 0 0 0-1.03-.14L3.13 11.12a1 1 0 0 0 .05 1.86l4.24 1.53 1.53 4.24a1 1 0 0 0 1.86.05l6.8-17.37a1 1 0 0 0-.08-.97Zm-11.7 10.7-.57-1.57 6.78-6.79-6.21 8.36Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z"
        fill="currentColor"
      />
      <path
        d="M16.45 14.3c-.2.57-1.1 1.04-1.5 1.09-.4.05-.9.07-1.45-.12-.33-.11-.76-.25-1.31-.49-2.3-.99-3.8-3.29-3.91-3.45-.11-.16-.93-1.24-.93-2.36 0-1.12.59-1.67.8-1.9.2-.23.45-.29.6-.29.15 0 .3 0 .43.01.14.01.32-.05.5.39.2.47.67 1.64.73 1.75.06.12.1.25.02.4-.08.16-.12.25-.24.38-.12.14-.25.3-.36.4-.12.12-.24.25-.1.5.13.25.6.99 1.3 1.6.88.78 1.61 1.03 1.86 1.15.25.12.4.1.55-.06.15-.17.63-.73.8-.98.17-.25.35-.2.58-.12.24.08 1.5.71 1.76.84.26.13.43.2.49.31.06.11.06.67-.14 1.24Z"
        fill="#fff"
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.14 3c4.05 0 6.8 2.61 7.03 6.64.1 1.83-.24 3.4-.99 4.62-.3.5-.41.9-.35 1.42l.2 1.6c.08.62-.48 1.13-1.09.98l-1.58-.4c-.48-.12-.83-.04-1.25.2-1.26.7-2.77 1.03-4.45.94-4.03-.21-6.65-2.98-6.66-7.02C3 6.82 6.27 3 12.14 3Z"
        fill="currentColor"
      />
      <path
        d="M14.84 13.95c-.17.44-1 .86-1.34.89-.36.04-.8.08-1.3-.1-.3-.11-.7-.24-1.2-.45-1.9-.82-3.17-2.72-3.27-2.84-.1-.13-.78-1.05-.78-2.02s.5-1.48.69-1.67c.18-.19.39-.24.52-.24h.38c.12.01.27-.03.42.33.16.4.56 1.4.61 1.49.05.1.08.21.02.34-.07.12-.1.2-.2.3-.1.1-.2.24-.3.33-.1.1-.2.2-.08.42.11.21.5.84 1.07 1.36.72.66 1.33.88 1.54.98.21.1.34.08.47-.06.13-.14.53-.62.67-.84.15-.21.29-.18.5-.1.2.07 1.27.61 1.49.72.22.1.36.16.41.26.05.1.05.57-.13 1.1Z"
        fill="#fff"
      />
      <path
        d="M14.77 7.63a.74.74 0 1 0 .02 1.48c.66.01 1.18.52 1.19 1.2a.74.74 0 1 0 1.48-.02 2.7 2.7 0 0 0-2.69-2.66Z"
        fill="#fff"
      />
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

  useEffect(() => {
    if (!isOpen) {
      setIsGateMenuOpen(false);
    }
  }, [isOpen]);

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
          onClick={() => setIsOpen(false)}
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
          <div className="flex items-center gap-2">
            {messengers.map((item) => (
              <a
                aria-label={item.label}
                className="flex size-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                style={{ color: item.color }}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                <item.icon />
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
            onClick={() => setIsOpen((value) => !value)}
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
        onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
                    onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
          <div className="mt-4 flex gap-3">
            {messengers.map((item) => (
              <a
                aria-label={item.label}
                className="flex size-10 items-center justify-center rounded-full bg-slate-100 transition-transform duration-200 hover:scale-110"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                style={{ color: item.color }}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                <item.icon />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
