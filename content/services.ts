import type { IsoDate } from "@/lib/sitemap-freshness";

export type Service = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  priceFrom: number;
  priceUnit: string;
  imageSrc: string;
  heroImage?: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
  galleryImages?: {
    src: string;
    alt: string;
    objectPosition?: string;
  }[];
  description: string;
  heroSubtitle?: {
    lead: string;
    accent: string;
  };
  features: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  detailUpdatedAt?: IsoDate;
};

export const services: Service[] = [
  {
    slug: "zabory-iz-profnastila",
    title: "Заборы из профнастила",
    metaTitle:
      "Заборы из профнастила и металлопрофиля с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Заборы из профнастила и металлопрофиля по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Цвета по RAL, гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    priceFrom: 70,
    priceUnit: "BYN/м.п.",
    imageSrc: "/images/services/zabory-iz-profnastila/hero.jpeg",
    heroImage: {
      src: "/images/services/zabory-iz-profnastila/hero-page.webp",
      alt: "Забор из профнастила рядом с частным домом",
    },
    galleryImages: [
      {
        src: "/images/services/zabory-iz-profnastila/gallery-00-graphite-wicket.webp",
        alt: "Светло-графитовый забор из профнастила с калиткой у частного дома",
      },
      {
        src: "/images/services/zabory-iz-profnastila/gallery-02.webp",
        alt: "Коричневый забор из профнастила вдоль дороги",
      },
      {
        src: "/images/services/zabory-iz-profnastila/gallery-03.webp",
        alt: "Секция забора из профнастила после монтажа",
      },
      {
        src: "/images/services/zabory-iz-profnastila/gallery-04.webp",
        alt: "Профнастил в готовом металлическом ограждении",
      },
      {
        src: "/images/services/zabory-iz-profnastila/gallery-05.webp",
        alt: "Забор из профлиста с металлическими столбами",
      },
      {
        src: "/images/services/zabory-iz-profnastila/gallery-06.webp",
        alt: "Фрагмент установленного забора из профнастила",
      },
    ],
    description:
      "Практичный сплошной забор из профнастила для участка, дома или производства. Подбираем толщину металла, цвет, высоту и комплектуем объект воротами и калиткой.",
    features: [
      "Скрывает участок от улицы и соседей",
      "Быстро монтируется на винтовые или забивные столбы",
      "Большой выбор цветов по каталогу RAL — можно подобрать под фасад, кровлю, ворота или калитку",
      "Подходит для частных домов, дач и промышленных территорий",
    ],
    faq: [
      {
        question: "Сколько стоит забор из профнастила?",
        answer:
          "Ориентировочная цена начинается от 70 BYN за погонный метр. Итог зависит от высоты, толщины листа, столбов и грунта.",
      },
      {
        question: "Можно ли установить профнастил зимой?",
        answer:
          "Да, монтаж возможен круглый год, если подъезд к участку и состояние грунта позволяют безопасно работать.",
      },
    ],
  },
  {
    slug: "zabory-iz-evroshtaketnika",
    title: "Заборы из евроштакетника",
    metaTitle:
      "Заборы из евроштакетника и металлоштакетника с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Заборы из евроштакетника по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Односторонняя и шахматная зашивка, выбор цветов, гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    keywords: [
      "евроштакетник",
      "металлоштакетник",
      "металлический штакетник",
      "забор из металлоштакетника",
    ],
    priceFrom: 85,
    priceUnit: "BYN/м.п.",
    imageSrc: "/images/services/zabory-iz-evroshtaketnika/hero.jpeg",
    heroImage: {
      src: "/images/services/zabory-iz-evroshtaketnika/hero-page.webp",
      alt: "Забор из евроштакетника рядом с садовыми посадками",
    },
    galleryImages: [
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-01.webp",
        alt: "Установленный забор из евроштакетника на участке",
      },
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-02.webp",
        alt: "Фасадный забор из евроштакетника с металлическими столбами",
      },
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-03.webp",
        alt: "Секция забора из евроштакетника после монтажа",
      },
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-04.webp",
        alt: "Евроштакетник для ограждения частного участка",
      },
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-05.webp",
        alt: "Металлический штакетник в готовом ограждении",
      },
      {
        src: "/images/services/zabory-iz-evroshtaketnika/gallery-06.webp",
        alt: "Готовый забор из металлического евроштакетника",
      },
    ],
    description:
      "Евроштакетник (металлоштакетник или металлический штакетник) — популярный выбор для фасадных заборов частных домов: конструкция выглядит аккуратно, пропускает воздух и сохраняет современный вид участка. Доступна односторонняя и шахматная зашивка.",
    features: [
      "Современный внешний вид",
      "Участок проветривается и не выглядит закрытым коробом",
      "Возможна шахматная зашивка для большей приватности",
      "Металл с защитным полимерным покрытием",
    ],
    faq: [
      {
        question: "Чем евроштакетник лучше профнастила?",
        answer:
          "Он легче визуально, пропускает воздух и хорошо подходит для фасадных сторон участка, где важен внешний вид.",
      },
      {
        question: "Можно ли сделать забор без просветов?",
        answer:
          "Да, для большей приватности используем шахматную установку планок с двух сторон.",
      },
      {
        question: "Евроштакетник и металлоштакетник — это одно и то же?",
        answer:
          "Да, это одно и то же изделие. В разных регионах Беларуси его называют по-разному: евроштакетник, металлоштакетник или металлический штакетник. Мы работаем с любой комплектацией и поможем подобрать нужный профиль под ваш участок.",
      },
    ],
  },
  {
    slug: "zabory-iz-setki-rabitsy",
    title: "Заборы из сетки-рабицы",
    metaTitle: "Заборы из сетки-рабицы с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Заборы из сетки-рабицы по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Практичное решение для дачи, участка и большого периметра. Гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    priceFrom: 30,
    priceUnit: "BYN/м.п.",
    imageSrc: "/images/services/zabory-iz-setki-rabitsy/hero.jpeg",
    heroImage: {
      src: "/images/services/zabory-iz-setki-rabitsy/hero-page-new.webp",
      alt: "Забор из сетки-рабицы на металлических столбах у сада",
    },
    galleryImages: [
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-01.webp",
        alt: "Установленный забор из сетки-рабицы на участке",
      },
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-02.webp",
        alt: "Сетка-рабица на металлическом каркасе вдоль участка",
      },
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-03.webp",
        alt: "Забор из сетки-рабицы рядом с зелёным участком",
      },
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-04.webp",
        alt: "Секция забора из сетки-рабицы с металлическими столбами",
      },
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-05.webp",
        alt: "Прозрачное ограждение из сетки-рабицы около дома",
      },
      {
        src: "/images/services/zabory-iz-setki-rabitsy/gallery-06.webp",
        alt: "Готовый забор из сетки-рабицы по периметру участка",
      },
    ],
    description:
      "Бюджетное решение для дачи, сада, огорода и технических зон. Сетка-рабица быстро ставится, не затеняет участок и подходит для больших периметров.",
    heroSubtitle: {
      lead: "Бюджетное решение для дачи, сада, огорода и технических зон.",
      accent:
        "Сетка-рабица быстро ставится, не затеняет участок и подходит для больших периметров.",
    },
    features: [
      "Самый доступный вариант ограждения",
      "Быстрый монтаж больших периметров",
      "Не создаёт тень для растений",
      "Подходит как постоянное или временное ограждение",
    ],
    faq: [
      {
        question: "Какая сетка лучше для забора?",
        answer:
          "Для долговечной эксплуатации рекомендуем оцинкованную или сетку с полимерным покрытием.",
      },
      {
        question: "Можно ли поставить сетку-рабицу на неровном участке?",
        answer:
          "Да, секции и натяжение адаптируем под рельеф после осмотра участка.",
      },
    ],
  },
  {
    slug: "vorota-raspashnye",
    title: "Распашные ворота",
    metaTitle: "Распашные ворота с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Распашные ворота по всей Беларуси. Бесплатный расчёт, изготовление, доставка и установка под ключ. Подбор размеров и заполнения под забор. Гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    priceFrom: 1200,
    priceUnit: "BYN",
    imageSrc: "/images/services/vorota-raspashnye/hero.jpeg",
    heroImage: {
      src: "/images/services/vorota-raspashnye/hero-page-square-new.webp",
      alt: "Распашные ворота с кирпичными столбами в квадратном кадре",
      objectPosition: "center",
    },
    galleryImages: [
      {
        src: "/images/services/vorota-raspashnye/gallery-01.webp",
        alt: "Серые распашные ворота между бетонными столбами",
      },
      {
        src: "/images/services/vorota-raspashnye/gallery-02.webp",
        alt: "Коричневые распашные ворота с декоративной дугой",
      },
      {
        src: "/images/services/vorota-raspashnye/gallery-03.webp",
        alt: "Закрытые распашные ворота между кирпичными столбами",
      },
      {
        src: "/images/services/vorota-raspashnye/gallery-04.webp",
        alt: "Зелёные распашные ворота с калиткой рядом с лесом",
      },
      {
        src: "/images/services/vorota-raspashnye/gallery-05.webp",
        alt: "Распашные ворота с установленной автоматикой",
      },
      {
        src: "/images/services/vorota-raspashnye/gallery-06.webp",
        alt: "Декоративные распашные ворота у жилого дома",
      },
    ],
    description:
      "Классические распашные ворота для частного дома, дачи или производственной территории. Изготавливаем под размер проёма и стиль забора.",
    features: [
      "Надёжная конструкция на усиленных столбах",
      "Заполнение в цвет основного забора",
      "Можно добавить калитку и автоматику",
      "Подходят для широких проездов",
    ],
    faq: [
      {
        question: "Какая ширина распашных ворот нужна для участка?",
        answer:
          "Чаще всего достаточно 3-4 метров, но ширину лучше выбирать по типу транспорта и радиусу заезда.",
      },
      {
        question: "Можно ли установить автоматику?",
        answer:
          "Да, заранее усиливаем конструкцию и учитываем место под привод.",
      },
    ],
  },
  {
    slug: "vorota-otkatnye",
    title: "Откатные ворота",
    metaTitle: "Откатные ворота с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Откатные ворота по всей Беларуси. Бесплатный расчёт, изготовление, доставка и установка под ключ. Надёжная фурнитура, подготовка под автоматику, гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    priceFrom: 3000,
    priceUnit: "BYN",
    imageSrc: "/images/services/vorota-otkatnye/hero.jpeg",
    heroImage: {
      src: "/images/services/vorota-otkatnye/hero-page-square-new.webp",
      alt: "Откатные ворота с кирпичными столбами в квадратном кадре",
      objectPosition: "center",
    },
    galleryImages: [
      {
        src: "/images/services/vorota-otkatnye/gallery-01.webp",
        alt: "Откатные ворота с металлическим заполнением",
      },
      {
        src: "/images/services/vorota-otkatnye/gallery-02.webp",
        alt: "Откатные ворота на участке частного дома",
      },
      {
        src: "/images/services/vorota-otkatnye/gallery-03.webp",
        alt: "Серые откатные ворота с приводом",
      },
      {
        src: "/images/services/vorota-otkatnye/gallery-04.webp",
        alt: "Откатные ворота с профнастилом между кирпичными столбами",
      },
      {
        src: "/images/services/vorota-otkatnye/gallery-05.webp",
        alt: "Закрытые откатные ворота перед двором",
      },
      {
        src: "/images/services/vorota-otkatnye/gallery-06.webp",
        alt: "Откатные ворота рядом с забором из профнастила",
      },
    ],
    description:
      "Откатные ворота экономят место перед въездом и удобны зимой. Рассчитываем проём, фундамент, фурнитуру и заполнение под конкретный участок.",
    features: [
      "Не требуют свободного места перед створками",
      "Удобны для ежедневного въезда",
      "Совместимы с автоматикой и пультами",
      "Прочная рама и роликовая система",
    ],
    faq: [
      {
        question: "Сколько места нужно для отката ворот?",
        answer:
          "Обычно нужна боковая зона, равная ширине проёма плюс технологический запас для противовеса.",
      },
      {
        question: "Нужен ли фундамент?",
        answer:
          "Да, для стабильной работы откатных ворот монтируется закладная или свайное основание.",
      },
    ],
  },
  {
    slug: "kalitki",
    title: "Калитки",
    metaTitle: "Калитки для забора с установкой под ключ - цены по Беларуси",
    metaDescription:
      "Калитки для забора по всей Беларуси. Бесплатный расчёт, изготовление под размер, доставка и установка под ключ. Подбор заполнения, замка и фурнитуры. Гарантия и рассрочка.",
    detailUpdatedAt: "2026-09-22",
    priceFrom: 1000,
    priceUnit: "BYN",
    imageSrc: "/images/services/kalitki/hero.jpeg",
    heroImage: {
      src: "/images/services/kalitki/hero-page.webp",
      alt: "Калитка из профнастила с ручкой и петлями",
      objectPosition: "center",
    },
    galleryImages: [
      {
        src: "/images/services/kalitki/gallery-01.webp",
        alt: "Серая калитка из евроштакетника у частного дома",
      },
      {
        src: "/images/services/kalitki/gallery-02.webp",
        alt: "Коричневая калитка из профнастила с металлическим обрамлением",
      },
      {
        src: "/images/services/kalitki/gallery-03.webp",
        alt: "Зелёная калитка из 3D-сетки",
      },
      {
        src: "/images/services/kalitki/gallery-04.webp",
        alt: "Обычная калитка из коричневого профнастила",
      },
      {
        src: "/images/services/kalitki/gallery-05.webp",
        alt: "Калитка из профнастила с внутренней стороны с козырьком",
      },
      {
        src: "/images/services/kalitki/gallery-06.webp",
        alt: "Калитка из евроштакетника на участке",
      },
    ],
    description:
      "Изготавливаем калитки в едином стиле с забором и воротами. Подбираем ширину, заполнение, замок, петли и сторону открывания.",
    features: [
      "Единый дизайн с забором и воротами",
      "Надёжная фурнитура и замки",
      "Изготовление под размер проёма",
      "Аккуратный монтаж с регулировкой",
    ],
    faq: [
      {
        question: "Можно ли заказать калитку отдельно?",
        answer:
          "Да, калитку можно установить отдельно или вместе с новым забором и воротами.",
      },
      {
        question: "Какая стандартная ширина калитки?",
        answer:
          "Чаще всего делают 900-1100 мм, но точный размер подбирается под участок и удобство прохода.",
      },
    ],
  },
];

export const getServiceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);

export function getRequiredServiceBySlug(slug: string): Service {
  const service = getServiceBySlug(slug);

  if (!service) {
    throw new Error(`Service ${slug} not found`);
  }

  return service;
}
