import type { City } from "@/content/cities";

export const projectFilters = [
  { value: "all", label: "Все" },
  { value: "profnastil", label: "Профнастил" },
  { value: "evroshtaketnik", label: "Евроштакетник" },
  { value: "rabitsa", label: "Сетка-рабица" },
  { value: "gates", label: "Ворота" },
  { value: "wickets", label: "Калитки" },
] as const;

export type ProjectFilterValue = (typeof projectFilters)[number]["value"];
export type ProjectCategory = Exclude<ProjectFilterValue, "all">;

export type ProjectServiceSlug =
  | "zabory-iz-profnastila"
  | "zabory-iz-evroshtaketnika"
  | "zabory-iz-setki-rabitsy"
  | "vorota-raspashnye"
  | "vorota-otkatnye"
  | "kalitki";

export type ProjectPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type ProjectCity = Pick<City, "slug" | "name" | "oblast">;

export type Project = {
  id: string;
  title: string;
  serviceSlug: ProjectServiceSlug;
  category: ProjectCategory;
  categoryLabel: string;
  city: ProjectCity;
  description: string;
  material?: string;
  length?: string;
  height?: string;
  priceRange?: string;
  completedAt?: string;
  mainPhoto: ProjectPhoto;
  photos?: ProjectPhoto[];
  review?: string;
  isFeatured?: boolean;
};

export const projects: Project[] = [
  {
    id: "profnastil-brown-perimeter",
    title: "Забор из профнастила вдоль участка",
    serviceSlug: "zabory-iz-profnastila",
    category: "profnastil",
    categoryLabel: "Профнастил",
    city: {
      slug: "grodno",
      name: "Гродно",
      oblast: "Гродненская область",
    },
    material: "профнастил с полимерным покрытием",
    description:
      "Сплошное ограждение для приватности участка с аккуратной линией секций и металлическими столбами.",
    mainPhoto: {
      src: "/images/projects/profnastil-brown-perimeter/main.webp",
      alt: "Коричневый забор из профнастила вдоль частного участка",
      width: 1200,
      height: 674,
    },
    photos: [
      {
        src: "/images/projects/profnastil-brown-perimeter/main.webp",
        alt: "Коричневый забор из профнастила вдоль частного участка",
        width: 1200,
        height: 674,
      },
    ],
    isFeatured: true,
  },
  {
    id: "profnastil-light-yard",
    title: "Светлый профнастил на металлическом каркасе",
    serviceSlug: "zabory-iz-profnastila",
    category: "profnastil",
    categoryLabel: "Профнастил",
    city: {
      slug: "brest",
      name: "Брест",
      oblast: "Брестская область",
    },
    material: "профнастил, металлический каркас",
    description:
      "Ровная линия забора с контрастным каркасом для большого открытого участка.",
    mainPhoto: {
      src: "/images/projects/profnastil-light-yard/main.webp",
      alt: "Светлый забор из профнастила с красным металлическим каркасом",
      width: 1000,
      height: 750,
    },
    photos: [
      {
        src: "/images/projects/profnastil-light-yard/main.webp",
        alt: "Светлый забор из профнастила с красным металлическим каркасом",
        width: 1000,
        height: 750,
      },
    ],
    isFeatured: false,
  },
  {
    id: "evroshtaketnik-brown-front",
    title: "Фасадный забор из евроштакетника",
    serviceSlug: "zabory-iz-evroshtaketnika",
    category: "evroshtaketnik",
    categoryLabel: "Евроштакетник",
    city: {
      slug: "vitebsk",
      name: "Витебск",
      oblast: "Витебская область",
    },
    material: "металлический евроштакетник",
    description:
      "Фасадное ограждение с просветами: участок выглядит легче, но граница остаётся аккуратной.",
    mainPhoto: {
      src: "/images/projects/evroshtaketnik-brown-front/main.webp",
      alt: "Коричневый фасадный забор из металлического евроштакетника",
      width: 1200,
      height: 900,
    },
    photos: [
      {
        src: "/images/projects/evroshtaketnik-brown-front/main.webp",
        alt: "Коричневый фасадный забор из металлического евроштакетника",
        width: 1200,
        height: 900,
      },
    ],
    isFeatured: true,
  },
  {
    id: "evroshtaketnik-gray-facade",
    title: "Серый евроштакетник для фасадной линии",
    serviceSlug: "zabory-iz-evroshtaketnika",
    category: "evroshtaketnik",
    categoryLabel: "Евроштакетник",
    city: {
      slug: "lida",
      name: "Лида",
      oblast: "Гродненская область",
    },
    material: "евроштакетник серого цвета",
    description:
      "Металлический штакетник с вертикальным ритмом секций и спокойным современным цветом.",
    mainPhoto: {
      src: "/images/projects/evroshtaketnik-gray-facade/main.webp",
      alt: "Серый забор из евроштакетника перед частным участком",
      width: 1200,
      height: 900,
    },
    photos: [
      {
        src: "/images/projects/evroshtaketnik-gray-facade/main.webp",
        alt: "Серый забор из евроштакетника перед частным участком",
        width: 1200,
        height: 900,
      },
    ],
    isFeatured: false,
  },
  {
    id: "rabitsa-garden-perimeter",
    title: "Сетка-рабица по периметру участка",
    serviceSlug: "zabory-iz-setki-rabitsy",
    category: "rabitsa",
    categoryLabel: "Сетка-рабица",
    city: {
      slug: "polotsk",
      name: "Полоцк",
      oblast: "Витебская область",
    },
    material: "сетка-рабица на металлических столбах",
    description:
      "Лёгкое прозрачное ограждение для сада, дачи или большого периметра без лишнего затенения.",
    mainPhoto: {
      src: "/images/projects/rabitsa-garden-perimeter/main.webp",
      alt: "Забор из сетки-рабицы вокруг зелёного участка",
      width: 1200,
      height: 900,
    },
    photos: [
      {
        src: "/images/projects/rabitsa-garden-perimeter/main.webp",
        alt: "Забор из сетки-рабицы вокруг зелёного участка",
        width: 1200,
        height: 900,
      },
    ],
    isFeatured: true,
  },
  {
    id: "sliding-gate-covered-entry",
    title: "Откатные ворота для въездной группы",
    serviceSlug: "vorota-otkatnye",
    category: "gates",
    categoryLabel: "Ворота",
    city: {
      slug: "novopolotsk",
      name: "Новополоцк",
      oblast: "Витебская область",
    },
    material: "металлические откатные ворота",
    description:
      "Готовая въездная группа с откатной конструкцией, удобной для ежедневного проезда.",
    mainPhoto: {
      src: "/images/projects/sliding-gate-covered-entry/main.webp",
      alt: "Откатные ворота с металлическим заполнением у въезда на участок",
      width: 1000,
      height: 450,
    },
    photos: [
      {
        src: "/images/projects/sliding-gate-covered-entry/main.webp",
        alt: "Откатные ворота с металлическим заполнением у въезда на участок",
        width: 1000,
        height: 450,
      },
    ],
    isFeatured: true,
  },
  {
    id: "swing-gate-brown-entry",
    title: "Распашные ворота с заполнением профнастилом",
    serviceSlug: "vorota-raspashnye",
    category: "gates",
    categoryLabel: "Ворота",
    city: {
      slug: "orsha",
      name: "Орша",
      oblast: "Витебская область",
    },
    material: "распашные ворота, профнастил",
    description:
      "Классическая распашная конструкция в едином цвете с ограждением и аккуратным верхним контуром.",
    mainPhoto: {
      src: "/images/projects/swing-gate-brown-entry/main.webp",
      alt: "Коричневые распашные ворота с заполнением профнастилом",
      width: 1200,
      height: 900,
    },
    photos: [
      {
        src: "/images/projects/swing-gate-brown-entry/main.webp",
        alt: "Коричневые распашные ворота с заполнением профнастилом",
        width: 1200,
        height: 900,
      },
    ],
    isFeatured: true,
  },
  {
    id: "wicket-gray-profnastil",
    title: "Калитка в сером профнастиле",
    serviceSlug: "kalitki",
    category: "wickets",
    categoryLabel: "Калитки",
    city: {
      slug: "slutsk",
      name: "Слуцк",
      oblast: "Минская область",
    },
    material: "калитка с заполнением профнастилом",
    description:
      "Отдельная калитка в цвет основного ограждения с простой геометрией и закрытым заполнением.",
    mainPhoto: {
      src: "/images/projects/wicket-gray-profnastil/main.webp",
      alt: "Серая калитка из профнастила рядом с ограждением участка",
      width: 1200,
      height: 675,
    },
    photos: [
      {
        src: "/images/projects/wicket-gray-profnastil/main.webp",
        alt: "Серая калитка из профнастила рядом с ограждением участка",
        width: 1200,
        height: 675,
      },
    ],
    isFeatured: true,
  },
];

export const featuredProjects = projects.filter(
  (project) => project.isFeatured === true,
);

export function getProjectsByServiceSlug(serviceSlug: ProjectServiceSlug) {
  return projects.filter((project) => project.serviceSlug === serviceSlug);
}

export function getProjectsByCitySlug(citySlug: string) {
  return projects.filter((project) => project.city.slug === citySlug);
}
