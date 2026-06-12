import { SITE_URL } from "@/lib/constants";

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  const [pathWithSearch, hash = ""] = path.split("#", 2);
  const [pathnameRaw, search = ""] = pathWithSearch.split("?", 2);
  const pathnameWithLeadingSlash = pathnameRaw.startsWith("/")
    ? pathnameRaw
    : `/${pathnameRaw}`;
  const pathname =
    pathnameWithLeadingSlash === "/"
      ? "/"
      : pathnameWithLeadingSlash.replace(/\/+$/, "");

  return `${pathname}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
}

export function canonicalUrl(path = "/") {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    const url = new URL(path);
    const normalizedPath = normalizePath(`${url.pathname}${url.search}${url.hash}`);

    return normalizedPath === "/" ? url.origin : `${url.origin}${normalizedPath}`;
  }

  const normalizedPath = normalizePath(path);

  return normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
}
