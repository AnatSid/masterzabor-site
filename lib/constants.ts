export const COMPANY_NAME = "МастерЗабор";
export const SITE_NAME = "МастерЗабор";
export const SITE_URL = "https://www.masterzabor.by";
export const SITE_HOST = "www.masterzabor.by";
export const LOGO_PATH = "/images/logo-512.png";

/** Telegram POST не следует за 307; на Vercel apex → www, поэтому webhook только на www. */
export const TELEGRAM_WEBHOOK_URL =
  "https://www.masterzabor.by/api/telegram-webhook";

export const PHONE = "+375333135072";
export const PHONE_RAW = "375333135072";
export const PHONE_DISPLAY = "+375 33 313-50-72";

export const ADDRESS =
  "Беларусь, г. Гомель, пр. Речицкий, 7А, оф. 5.11, 246027";
export const CITY = "Гомель";
export const POSTAL_CODE = "246027";

export const TELEGRAM_USERNAME = "Aleksandr_jeuj";
export const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;
export const WHATSAPP_LINK = "https://wa.me/375333135072";
export const VIBER_LINK = "viber://chat?number=%2B375333135072";

export const COORDINATES = {
  lat: 52.4345,
  lng: 30.9754,
} as const;

export const UNP = "491386585";
export const WORKING_HOURS = "Пн-Вс 10:00-19:00";
export const BANK_DETAILS =
  "BY36ALFA30122E67480010270000, ЗАО «Альфа-Банк», БИК ALFABY2X";
export const DIRECTOR = "Сидоренко Александр Вячеславович";

export const TRUST_FACTS = {
  sinceYear: 2015,
  completedFences: "10 000+",
  warrantyYears: 20,
  installmentMonths: 60,
} as const;
