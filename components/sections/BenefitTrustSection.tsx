import Image from "next/image";
import { TRUST_FACTS } from "@/lib/constants";

const benefitItems = [
  {
    icon: "experience" as const,
    title: `С ${TRUST_FACTS.sinceYear} года`,
    text: `${TRUST_FACTS.completedFences} заборов — опыт частных участков, дач и въездных групп`,
  },
  {
    icon: "installment" as const,
    title: "Рассрочка и оплата частями",
    text: "подберём комфортный платёж — работаем с 8 банками",
  },
  {
    icon: "delivery" as const,
    title: "Бесплатная доставка",
    text: "организуем доставку и монтаж под ключ",
  },
  {
    icon: "phone" as const,
    title: "Быстрый расчёт по телефону",
    text: "назовите длину и тип забора — подскажем ориентир по цене",
  },
  {
    icon: "crew" as const,
    title: "Свои бригады",
    text: "работаем постоянными монтажниками, без случайных подрядчиков",
  },
  {
    icon: "contract" as const,
    title: "Договор и смета",
    text: "фиксируем объём работ, материалы, сроки и итоговую стоимость",
  },
  {
    icon: "selection" as const,
    title: "Подбор под участок",
    text: "сравним материалы, высоту и цвет под бюджет, дом и грунт",
  },
  {
    icon: "warranty" as const,
    title: "Гарантия на материалы и монтаж",
    text: "срок зависит от материала и условий эксплуатации — всё прописываем в договоре",
  },
] as const;

type BrandIconName = (typeof benefitItems)[number]["icon"];

const benefitIconSrc: Record<BrandIconName, string> = {
  contract: "/icons/benefits/contract.svg",
  crew: "/icons/benefits/crew.svg",
  delivery: "/icons/benefits/delivery.svg",
  experience: "/icons/benefits/experience.svg",
  installment: "/icons/benefits/installment.svg",
  phone: "/icons/benefits/phone.svg",
  selection: "/icons/benefits/selection.svg",
  warranty: "/icons/benefits/warranty.svg",
};

function BrandLineIcon({
  className = "h-8 w-8 text-[#0A5633]",
  name,
}: {
  className?: string;
  name: BrandIconName;
}) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      height={40}
      src={benefitIconSrc[name]}
      unoptimized
      width={40}
    />
  );
}

export function BenefitTrustSection() {
  return (
    <section className="bg-[#F5F5F5] py-5 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefitItems.map((item) => (
            <article
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:rounded-2xl sm:p-6"
              key={item.title}
            >
              <BrandLineIcon
                className="h-11 w-11 text-[#0A5633] sm:h-[52px] sm:w-[52px]"
                name={item.icon}
              />
              <h2 className="mt-3 text-[15px] font-bold leading-tight text-slate-950 sm:mt-5 sm:text-lg">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
