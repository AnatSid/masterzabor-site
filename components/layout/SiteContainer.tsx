import type { ElementType, ReactNode } from "react";

/** Shared horizontal rhythm for page sections (1350px + responsive padding). */
export const siteContainerClassName =
  "mx-auto w-full max-w-[1350px] px-4 sm:px-6 lg:px-8";

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
