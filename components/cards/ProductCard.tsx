import Link from "next/link";

type ProductCardProps = {
  title: string;
  description: string;
  href: string;
  priceFrom: number;
  priceUnit: string;
};

export function ProductCard({
  title,
  description,
  href,
  priceFrom,
  priceUnit,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 h-36 rounded-xl bg-[linear-gradient(135deg,#1B5E20_0%,#2E7D32_45%,#F5F5F5_45%,#F5F5F5_100%)]" />
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {description}
      </p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="font-semibold text-[#1B5E20]">
          от {priceFrom} {priceUnit}
        </p>
        <Link
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#1B5E20] hover:text-white"
          href={href}
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
