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

const STRICT_ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertValidSemanticDate(date: string): asserts date is IsoDate {
  if (date.length !== 10 || !STRICT_ISO_DATE_PATTERN.test(date)) {
    throw new Error(
      'Invalid semantic date "' +
        date +
        '": expected strict YYYY-MM-DD format.',
    );
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(date + "T00:00:00.000Z");

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() + 1 !== month ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error(
      'Invalid semantic date "' + date + '": date does not exist in the calendar.',
    );
  }
}

export function latestMeaningfulDate(
  ...dates: ReadonlyArray<IsoDate | undefined>
): IsoDate | undefined {
  let latest: IsoDate | undefined;

  for (const date of dates) {
    if (date === undefined) {
      continue;
    }

    assertValidSemanticDate(date);

    if (!latest || date > latest) {
      latest = date;
    }
  }

  return latest;
}
