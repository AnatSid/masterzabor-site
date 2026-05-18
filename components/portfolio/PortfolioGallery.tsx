"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type PortfolioItem = {
  id: string;
  title: string;
  type: "Профнастил" | "Евроштакетник" | "Сетка-рабица" | "Ворота и калитки";
  city: string;
  image: string;
};

const FILTERS = [
  "Все",
  "Профнастил",
  "Евроштакетник",
  "Сетка-рабица",
  "Ворота и калитки",
] as const;

type FilterValue = (typeof FILTERS)[number];

function createImage(title: string, index: number) {
  const colors = ["#1B5E20", "#2E7D32", "#F59E0B", "#334155", "#166534", "#64748B"];
  const color = colors[index % colors.length];
  const svg = `
    <svg width="900" height="620" viewBox="0 0 900 620" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="620" fill="#F8FAFC"/>
      <rect y="350" width="900" height="270" fill="${color}"/>
      <path d="M0 350L900 210V350H0Z" fill="#E2E8F0"/>
      <g stroke="white" stroke-width="14">
        <path d="M90 395V575"/>
        <path d="M230 375V575"/>
        <path d="M370 355V575"/>
        <path d="M510 335V575"/>
        <path d="M650 315V575"/>
        <path d="M790 295V575"/>
        <path d="M70 430H830"/>
        <path d="M70 500H830"/>
      </g>
      <text x="50" y="100" fill="#0F172A" font-size="38" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "prf-1",
    title: "Забор из профнастила 1.8 м",
    type: "Профнастил",
    city: "Гомель",
    image: createImage("Профнастил, Гомель", 0),
  },
  {
    id: "prf-2",
    title: "Профнастил с откатными воротами",
    type: "Профнастил",
    city: "Речица",
    image: createImage("Профнастил + ворота, Речица", 1),
  },
  {
    id: "evr-1",
    title: "Фасадный евроштакетник (шахматка)",
    type: "Евроштакетник",
    city: "Минск",
    image: createImage("Евроштакетник, Минск", 2),
  },
  {
    id: "evr-2",
    title: "Евроштакетник с кирпичными столбами",
    type: "Евроштакетник",
    city: "Брест",
    image: createImage("Евроштакетник, Брест", 3),
  },
  {
    id: "rab-1",
    title: "Сетка-рабица для дачного участка",
    type: "Сетка-рабица",
    city: "Жлобин",
    image: createImage("Сетка-рабица, Жлобин", 4),
  },
  {
    id: "rab-2",
    title: "Рабица на большом периметре",
    type: "Сетка-рабица",
    city: "Пинск",
    image: createImage("Сетка-рабица, Пинск", 5),
  },
  {
    id: "gate-1",
    title: "Откатные ворота с калиткой",
    type: "Ворота и калитки",
    city: "Мозырь",
    image: createImage("Откатные ворота, Мозырь", 6),
  },
  {
    id: "gate-2",
    title: "Распашные ворота под автоматику",
    type: "Ворота и калитки",
    city: "Могилёв",
    image: createImage("Распашные ворота, Могилёв", 7),
  },
  {
    id: "mix-1",
    title: "Комбинированный забор и входная группа",
    type: "Ворота и калитки",
    city: "Гродно",
    image: createImage("Комплексный объект, Гродно", 8),
  },
];

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Все");

  const filteredItems = useMemo(() => {
    if (activeFilter === "Все") {
      return portfolioItems;
    }

    return portfolioItems.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        {FILTERS.map((filter) => (
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter
                ? "bg-[#1B5E20] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            key={item.id}
          >
            <Image
              alt={`${item.title}, ${item.city}`}
              className="h-56 w-full object-cover"
              height={420}
              src={item.image}
              width={620}
            />
            <div className="p-5">
              <h3 className="font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {item.city} · {item.type}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
