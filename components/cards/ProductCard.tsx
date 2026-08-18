import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  title: string;
  description: string;
  href: string;
  priceFrom: number;
  priceUnit: string;
  imageSrc?: string;
};

export function ProductCard({
  title,
  description,
  href,
  priceFrom,
  priceUnit,
  imageSrc,
}: ProductCardProps) {
  return (
    <article className="flex h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:flex-col sm:rounded-2xl">
      <div className="relative h-24 w-28 shrink-0 overflow-hidden bg-slate-100 sm:h-36 sm:w-full sm:shrink-0">
        {imageSrc ? (
          <Image
            alt={title}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 384px"
            src={imageSrc}
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#0A5633_0%,#0E6E3E_45%,#F5F5F5_45%,#F5F5F5_100%)]" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-sm font-bold leading-tight text-slate-950 sm:text-xl">{title}</h3>
        <p className="mt-2 max-h-[4.75rem] flex-1 overflow-hidden text-xs leading-5 text-slate-600 sm:mt-3 sm:max-h-none sm:text-sm sm:leading-6">
        {description}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <p className="text-sm font-semibold text-[#0A5633] sm:text-base">
            от {priceFrom} {priceUnit}
          </p>
          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-[#0A5633] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2 sm:min-h-0 sm:px-4 sm:text-sm"
            href={href}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
