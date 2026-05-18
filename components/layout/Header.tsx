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
  { label: "Ворота", href: "/vorota-raspashnye/" },
  { label: "Цены", href: "/tseny/" },
  { label: "Наши работы", href: "/nashi-raboty/" },
  { label: "Контакты", href: "/kontakty/" },
] as const;

const messengers = [
  { label: "Telegram", shortLabel: "TG", href: TELEGRAM_LINK },
  { label: "WhatsApp", shortLabel: "WA", href: WHATSAPP_LINK },
  { label: "Viber", shortLabel: "VB", href: VIBER_LINK },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
          {navigation.map((item) => (
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
                className="flex size-9 items-center justify-center rounded-full border border-[#1B5E20]/20 text-xs font-bold text-[#1B5E20] transition hover:bg-[#1B5E20] hover:text-white"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.shortLabel}
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
          {navigation.map((item) => (
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
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
