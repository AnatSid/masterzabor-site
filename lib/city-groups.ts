import type { City } from "@/content/cities";

export const RELATED_CITY_LIMIT = 8;

export const normalizeOblastGroup = (oblast: string) =>
  oblast === "Минская область" ? "Минск и Минская область" : oblast;

function bySlug(left: City, right: City) {
  if (left.slug === right.slug) {
    return 0;
  }

  return left.slug < right.slug ? -1 : 1;
}

export function getRelatedCities(
  city: City,
  sourceCities: ReadonlyArray<City>,
) {
  const currentGroup = normalizeOblastGroup(city.oblast);
  const groupCities = sourceCities
    .filter((item) => normalizeOblastGroup(item.oblast) === currentGroup)
    .sort(bySlug)
    .filter(
      (item, index, items) =>
        index === 0 || item.slug !== items[index - 1].slug,
    );
  const currentIndex = groupCities.findIndex(
    (item) => item.slug === city.slug,
  );

  if (currentIndex === -1) {
    return [];
  }

  const relatedCount = Math.min(
    RELATED_CITY_LIMIT,
    groupCities.length - 1,
  );

  return Array.from(
    { length: relatedCount },
    (_, offset) => groupCities[(currentIndex + offset + 1) % groupCities.length],
  );
}
