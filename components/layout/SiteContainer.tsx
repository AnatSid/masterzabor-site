import type { ElementType, ReactNode } from "react";

/** Shared horizontal rhythm for page sections (1350px + responsive padding). */
export const siteContainerClassName =
  "mx-auto w-full max-w-[1350px] px-4 sm:px-6 lg:px-8";

/** Comfortable reading width for service SEO/article blocks (~960px). */
export const serviceProseClassName =
  "max-w-[960px] text-lg leading-[1.75] text-slate-700";

type SiteContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export function SiteContainer<T extends ElementType = "div">({
  as,
  children,
  className,
}: SiteContainerProps<T>) {
  const Tag = as ?? "div";
  const classes = className
    ? `${siteContainerClassName} ${className}`
    : siteContainerClassName;

  return <Tag className={classes}>{children}</Tag>;
}
