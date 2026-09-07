export type IsoDate = `${number}-${number}-${number}`;

type SitemapFreshnessRegistry = {
  groups: {
    serviceCardsUpdatedAt?: IsoDate;
    serviceProductDataUpdatedAt?: IsoDate;
  };
  templates: {
    homepage?: IsoDate;
    servicePage?: IsoDate;
    cityPage?: IsoDate;
    pricesPage?: IsoDate;
    portfolioPage?: IsoDate;
    blogIndex?: IsoDate;
    blogArticle?: IsoDate;
  };
  static: {
    "/otzyvy"?: IsoDate;
    "/kontakty"?: IsoDate;
  };
};

/**
 * Dates change only when the named rendered surface changes meaningfully.
 * CSS, refactors, dependency updates, builds, and deploys do not bump them.
 * A service edit can require both group dates when it affects both surfaces.
 */
export const sitemapFreshness: SitemapFreshnessRegistry = {
  groups: {},
  templates: {},
  static: {},
};

export function latestMeaningfulDate(
  ...dates: ReadonlyArray<IsoDate | undefined>
): IsoDate | undefined {
  return dates.reduce<IsoDate | undefined>(
    (latest, date) => (!latest || (date && date > latest) ? date : latest),
    undefined,
  );
}
