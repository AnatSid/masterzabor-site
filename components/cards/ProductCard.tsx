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
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl sm:p-6">
      <div className="mb-4 h-20 rounded-lg bg-[linear-gradient(135deg,#1B5E20_0%,#2E7D32_45%,#F5F5F5_45%,#F5F5F5_100%)] sm:mb-5 sm:h-36 sm:rounded-xl" />
      <h3 className="text-sm font-bold leading-tight text-slate-950 sm:text-xl">{title}</h3>
      <p className="mt-2 max-h-[4.75rem] flex-1 overflow-hidden text-xs leading-5 text-slate-600 sm:mt-3 sm:max-h-none sm:text-sm sm:leading-6">
        {description}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <p className="text-sm font-semibold text-[#1B5E20] sm:text-base">
          от {priceFrom} {priceUnit}
        </p>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-[#1B5E20] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 sm:min-h-0 sm:px-4 sm:text-sm"
          href={href}
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
