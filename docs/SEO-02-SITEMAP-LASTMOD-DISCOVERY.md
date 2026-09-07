# SEO-02: Sitemap lastmod and discovery

**Status:** implemented, merged, and Production verified.
**Repository baseline:** main / origin/main at 6e2651d when this report was prepared.
**Purpose:** self-contained handoff for reviewing the proposed sitemap freshness architecture in another chat.
The discovery text below is preserved as the pre-implementation design record; the
closure block records the current state.

## Implementation closure

The final surface-aware design below was implemented without changing sitemap URL
membership, canonical/domain policy, `changeFrequency`, or `priority`. Implementation
commit: `62e333688fcd4a9abf00ea34cbdcab29e94e6f83`; defensive strict-date validation:
`a8c699b1b7791b7e9855cbb81e45601f8a0b7b93`; merge/main:
`f3b61a958f68dfdeb854ced90f1209b61f9b3ab1`.

Production deployment `dpl_54khu2MiAcZWDZC6CaJDAMhwUxEL` was Ready and verified on
`https://www.masterzabor.by`. Initial honest coverage is 4/55 URLs: `/blog` and the
three blog articles use `2026-05-18`; the other 51 omit lastmod intentionally because
no trustworthy historical semantic date is available.

## Executive Summary

The current sitemap correctly enumerates about 55 canonical URLs, but assigns
lastModified: new Date() to every entry. Each sitemap response therefore gives all
URLs one run/build-time timestamp, irrespective of whether their user-visible content
changed. It is a technical timestamp, not a trustworthy content-modification signal.

This is not established as the root cause of the 40 Google URLs reported as
"Discovered, currently not indexed". Templates, canonical topology, sitemap
membership, robots, and indexability require a separate diagnosis. SEO-02 should stay
a narrow data-model/sitemap freshness stage, not become a general SEO refactor.

The recommended future design is a surface-aware hybrid:

1. Explicit semantic dates on entities for content that their own route renders.
2. Two central group dates: one for shared service-card fields and one for the
   service Product-data surface rendered as six Product objects on /tseny.
3. A small central freshness registry for static pages and shared template changes.
4. Derived lastmod only from the meaningful fields/surfaces actually rendered by that
   canonical URL.
5. Omission of lastmod where the project cannot honestly establish a date.

Do not use deploy time, build time, file-system mtime, or a blanket "today" value.

## Scope and Guardrails

The approved implementation may change only the semantic date model, shared proof
selector, Article JSON-LD date inputs, and app/sitemap.ts described here. Canonical
policy, robots, redirects, analytics, UI, and deployment configuration remain outside
scope.

| Invariant | Required state |
| --- | --- |
| Canonical host | https://www.masterzabor.by |
| URL form | no trailing slash |
| Apex host | redirect alias to www |
| Sitemap URLs | final canonical www URLs |
| Telegram webhook | https://www.masterzabor.by/api/telegram-webhook |

## A. Current Implementation and Root Cause

The sitemap is implemented in [app/sitemap.ts](../app/sitemap.ts). It imports
services, cities, and blog posts and returns one MetadataRoute.Sitemap array. Its
current effective pattern is:

~~~ts
const now = new Date();

return [
  { url: canonicalUrl("/"), lastModified: now },
  // six service entries: lastModified: now
  // 40 city entries: lastModified: now
  // static entries: lastModified: now
  // blog index and each blog post: lastModified: now
];
~~~

### Root Cause

The timestamp is created during sitemap generation and copied to every URL. It
expresses when the sitemap route ran, not when each URL's significant content changed.

| What happens | Why it matters |
| --- | --- |
| Every URL receives the same timestamp | Crawlers cannot distinguish an edited page from an unchanged one. |
| Revalidation/deployment can update all entries | The lastmod signal becomes noisy and less credible. |
| Content data has almost no modification metadata | Sitemap code has no semantic source for accurate dates. |
| Static and aggregate routes are treated alike | A changed blog post and an untouched contacts page look equally fresh. |

| URL family | Count | Source |
| --- | ---: | --- |
| Homepage | 1 | hard-coded route |
| Service pages | 6 | content/services.ts |
| City pages | 40 | content/cities.ts |
| Static commercial/support pages | 5 | prices, works, reviews, contacts, blog index |
| Blog posts | 3 | content/blog-posts.ts |
| **Total** | **55** | app/sitemap.ts |

## B. Repository Evidence: Content and Rendering Dependencies

The repository state is more authoritative than this report. This mapping comes from
reading the files listed below.

| Route family | Main source(s) | Meaningful shared rendering dependencies |
| --- | --- | --- |
| / | services, cities, featuredProjects | homepage component, shared header/footer, inline reviews/FAQ |
| Six service routes | one Service record | ServicePage, related services, city links, shared sections |
| /[city] (40 routes) | one City record; selected projects; services | CityPage, proof-selection algorithm, service cards, shared sections |
| /tseny | all services | prices page and six Product JSON-LD entries |
| /nashi-raboty | all projects | filters and PortfolioGallery |
| /otzyvy | inline review data | static template and schemas |
| /kontakty | constants and inline content | static template, map/contact data |
| /blog | all blogPosts | ordering and list rendering |
| /blog/[slug] | one BlogPost record | article template and Article JSON-LD |

| Data model | Existing date fields | Important finding |
| --- | --- | --- |
| Service | none | no per-service freshness source |
| City | none | no per-city freshness source |
| Project | optional completedAt in the type | no actual record currently supplies it; completion is not necessarily editorial modification |
| BlogPost | one date string | all three are currently 2026-05-18; it is a publication/display date and will migrate to publishedAt |

[lib/seo.ts](../lib/seo.ts) currently maps the blog post's single date field to both
datePublished and dateModified in Article JSON-LD. SEO-02 will resolve this model
explicitly: existing date values migrate losslessly to publishedAt, no existing article
receives an invented updatedAt, and a future substantive edit adds updatedAt.

## C. Meaning of Lastmod

Lastmod should mean the date of the most recent **significant, crawler-visible change
to that canonical URL**. It should not mean:

- deployment, build, sitemap execution, cache revalidation, or Git commit time;
- a CSS-only or tooling-only change;
- an arbitrary current date intended to encourage crawling;
- the date another unrelated URL changed.

Significant examples: changed primary copy, service price, hero/gallery media, FAQ,
substantial project evidence, primary structured data, or a material template change
that changes the rendered page. Minor formatting, unrelated routes, and ordinary
tooling updates should not fan out across the sitemap.

This follows the conservative interpretation in the sitemap protocol and Google's
guidance: lastmod is a URL modification date and Google benefits when it represents
an accurate significant modification.

- [Google Search Central: Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central: lastmod guidance](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)
- [Sitemaps protocol: XML tag definitions](https://www.sitemaps.org/protocol.html)

## D. Candidate Architecture Options

| Option | Description | Strengths | Risks / why insufficient alone |
| --- | --- | --- | --- |
| A. One coarse Service.updatedAt | every consumer depends on any Service edit | few fields | FAQ/gallery/schema-only edit falsely updates city/card pages |
| B. Per-service detail/card dates | each Service has detailUpdatedAt and cardUpdatedAt | precise per service | editors must remember two values for each of six records |
| C. Central group date for shared cards | service detail dates plus one serviceCardsUpdatedAt surface date | accurate for all pages rendering the complete card group; lowest maintenance | requires clear ownership of card fields |
| D. Runtime dependency graph | infer fields/components while rendering | theoretically granular | unnecessary complexity and fragile for this static TypeScript model |
| E. Git-derived dates | derive from last commit touching a file | no initial manual dates | refactors/merges/formatting can lie; poor fit for Vercel runtime |
| F. Omit if unknown | do not output optional tag | always truthful | no freshness hint for legacy records |

### Recommended Choice

Choose **C**, combined with narrow per-entity dates, template/static registry dates,
aggregate maximums, and omission when unknown:

- Service.detailUpdatedAt belongs to the own-service detail surface only.
- pageFreshness.serviceCardsUpdatedAt represents only title, price, image, or other
  fields actually rendered by the shared service-card group.
- pageFreshness.serviceProductDataUpdatedAt represents the service fields used by
  /tseny Product JSON-LD, including description and its selected hero image.
- City and project records retain one optional updatedAt because their respective
  rendered surfaces are not currently split into multiple independently reused groups.
- The registry carries only static-page/template/group dates.
- Aggregate URLs take the maximum of the specific surfaces they render.
- Legacy records with no trustworthy date omit lastmod.

Do not use E as the published sitemap date source. Git history can help one-time
research, but it is not a semantic editorial clock.

## E. Proposed Model, Without Implementation

The exact names may change, but the architecture should own these concepts:

~~~ts
type IsoDate = string; // validated YYYY-MM-DD or ISO timestamp

type Freshness = {
  updatedAt?: IsoDate;
};

type Service = {
  detailUpdatedAt?: IsoDate; // own detail page fields: FAQ, gallery, schema, copy
  /* existing fields */
};
type City = Freshness & { /* existing fields */ };
type Project = Freshness & { /* existing fields */ };
type BlogPost = {
  publishedAt: IsoDate;
  updatedAt?: IsoDate; // only after a meaningful update
  /* existing fields */
};

const pageFreshness = {
  groups: {
    // Only title/price/image and other fields rendered in shared service cards.
    serviceCardsUpdatedAt: "YYYY-MM-DD",
    // Shared inputs used by the six Product objects rendered on /tseny.
    serviceProductDataUpdatedAt: "YYYY-MM-DD",
  },
  static: {
    "/otzyvy": "YYYY-MM-DD",
    "/kontakty": "YYYY-MM-DD",
  },
  templates: {
    servicePage: "YYYY-MM-DD",
    cityPage: "YYYY-MM-DD",
    pricesPage: "YYYY-MM-DD",
    portfolioPage: "YYYY-MM-DD",
    blogArticle: "YYYY-MM-DD",
    blogIndex: "YYYY-MM-DD",
    homepage: "YYYY-MM-DD",
  },
} as const;
~~~

Rules for the eventual implementation:

1. BlogPost uses publishedAt and updatedAt as separate concepts. Migration renames the
   three current date values to publishedAt without value changes; updatedAt remains
   absent until a substantive edit.
2. Values are human-maintained content facts, never generated during request, build,
   or deployment.
3. A small helper accepts optional dates, returns their maximum, and returns undefined
   when no trustworthy date exists. Next can then omit the optional XML element.
4. The registry needs a short policy describing which changes require a bump. A
   template/group date is opt-in: it changes only for crawler-visible content, schema,
   or internal-link changes with meaning.
5. Keep canonicalUrl() as the sole absolute URL helper.

Use date-only YYYY-MM-DD values initially unless a real editorial workflow needs
time-of-day. Never backfill legacy records with the same invented migration date.

## F. Dependency and Propagation Policy

This policy is needed before coding so dates are neither false nor noisy.

| Event | URLs whose primary rendering actually changes | Suggested consequence |
| --- | --- | --- |
| Service FAQ, detail gallery, own-page copy, or Product JSON-LD changes | that service route only, unless a specific other route renders that exact surface | update Service.detailUpdatedAt; do not fan out to city/card consumers |
| Service title, price, image, or another field in the shared card | every route that renders that shared card group: homepage, city routes, /tseny, and ServicePage routes that render related cards | update pageFreshness.serviceCardsUpdatedAt; intentional fan-out reflects changed rendered content |
| Service description, Product image input, or another field used by /tseny Product JSON-LD | /tseny | update pageFreshness.serviceProductDataUpdatedAt; do not fan out to service/city/home routes solely because of this group |
| City copy/data changes | that city route; homepage if city list reflects it | update city date; homepage derives it |
| Project changes | /nashi-raboty; city route if selected proof; homepage if featured | update project date and derive only actual consumers |
| Blog post publication/substantive edit | that post and /blog | publishedAt stays fixed; only substantive edit sets updatedAt |
| Meaningful CityPage template change | all 40 city routes | bump templates.cityPage once |
| Meaningful ServicePage/template schema change | six service routes | bump templates.servicePage; include /tseny only if rendered there |
| Material Header/Footer content or internal-link change | routes whose header/footer actually changed | add a one-off, named registry dependency and include it only in those route calculations |
| Contacts/reviews content change | corresponding static route | update static registry date |
| CSS-only, spacing/layout polish, lint/refactor, dependency bump, build/deploy | no meaningful crawler-visible change | do not change a sitemap date |

There is no entity-level dependency from a city URL to a whole Service record. A city
URL depends only on the service-card surface it renders. The single group date is
deliberately chosen because every city page renders the same complete commercial card
group; it is accurate and prevents six duplicated card dates from being forgotten.

## G. Route-Family Calculation Outline

| Sitemap entry | Candidate dependencies |
| --- | --- |
| / | templates.homepage + serviceCardsUpdatedAt when cards render + dates of actually rendered featured projects; never max of City.updatedAt |
| /service | own Service.detailUpdatedAt + templates.servicePage + serviceCardsUpdatedAt only where related cards render |
| /city | own City.updatedAt + templates.cityPage + selected proof project + serviceCardsUpdatedAt |
| /tseny | templates.pricesPage + serviceCardsUpdatedAt + serviceProductDataUpdatedAt; never Service.detailUpdatedAt |
| /nashi-raboty | templates.portfolioPage + all visible Project.updatedAt values |
| /otzyvy | static /otzyvy registry date |
| /kontakty | static /kontakty registry date |
| /blog | templates.blogIndex + newest visible BlogPost.updatedAt or publishedAt |
| /blog/[slug] | that post's updatedAt or publishedAt + templates.blogArticle when it materially changes the article output |

Where no dependency has a defensible timestamp, omit lastModified rather than
fabricating a universal date. The migration is not required to cover all 55 URLs.

## H. Next.js Constraints

The installed framework is Next.js 16.2.9. The version-matched local source is:

node_modules/next/dist/docs/01-app/03-api-reference/04-file-conventions/01-metadata/sitemap.md

Confirmed behavior:

- app/sitemap.ts is a metadata route returning MetadataRoute.Sitemap;
- entries support optional lastModified, changeFrequency, and priority;
- sitemap routes are cached by default unless request-time behaviour is enabled.

The repository next.config.ts contains only the existing redirect configuration; it
does not enable cacheComponents. A future implementation requires no cache/config
change merely to replace new Date() with stable content dates. It must still verify
the real XML locally and in production rather than assume cache timing.

[Next.js sitemap file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

## I. Verification Plan for Later Implementation

1. Implement only the agreed data, registry, helper, and sitemap changes on a
   dedicated codex/SEO-02 branch.
2. Run npm run lint.
3. Run npm run build because metadata route output changes.
4. Inspect and parse generated sitemap XML.
5. Assert URL count and existing canonical no-slash www form are unchanged.
6. Assert no entry uses the build/deploy timestamp.
7. Sample each family: /, a service, a city, /tseny, /nashi-raboty, /blog, a post.
8. Change-test a dependency and confirm only expected URL families change dates.
9. Confirm robots, canonical tags, redirects, JSON-LD, and UI have no regression.
10. After Preview approval, wait as required and check production sitemap/pages.

## J. Research and Implementation Precedents

### Primary sources

| Source | Applicable conclusion |
| --- | --- |
| [Google: Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Sitemap is a hint; include canonical URLs and accurate metadata. |
| [Google: lastmod guidance](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) | Google uses lastmod when it is consistently accurate and significant. |
| [Sitemaps.org protocol](https://www.sitemaps.org/protocol.html) | lastmod is optional and describes a URL modification date. |
| [Yandex Webmaster: Sitemap](https://yandex.ru/support/webmaster/ru/controlling-robot/sitemap) | Sitemap aids discovery; URL/canonical validity and correct timestamps matter. |
| [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) | XML sitemap is a discovery signal, not an indexing guarantee. |

### Framework/CMS precedents

| Source | Useful pattern, not a mandate |
| --- | --- |
| [Next.js sitemap metadata route](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) | typed optional lastModified in the native sitemap route |
| [Django sitemap framework](https://docs.djangoproject.com/en/4.2/ref/contrib/sitemaps/) | model-level lastmod data per item |
| [Contentful Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) | content records expose creation/update metadata |
| [Sanity documents](https://www.sanity.io/docs/content-lake/documents) | structured content records have explicit system metadata |
| [Yoast XML sitemap specification](https://developer.yoast.com/features/xml-sitemaps/functional-specification/) | sitemap inclusion/freshness should follow published canonical content rules |

The project does not need a CMS or third-party SEO package. These are only precedents
for a small, explicit data-ownership pattern.

## Resolved Design Decisions

1. A service card update does update all city URLs that render the common card group.
   This is accurate fan-out, not entity-level overreach. FAQ, gallery, and own-page
   Product JSON-LD updates do not use the card group date and do not fan out.
2. Unknown historical Service, City, Project, or static-page dates remain unknown.
   The corresponding lastModified is omitted; migration/today dates are forbidden.
3. Template dates are bumped only for substantive crawler-visible content, schema, or
   internal-link changes. They are never bumped for CSS, layout spacing, lint,
   refactoring, dependency updates, builds, or deployments.
4. BlogPost.date migrates losslessly to publishedAt for the current three posts.
   The new optional updatedAt is not backfilled. It is set only when an article
   receives a substantive update.
5. Header/Footer has no default global timestamp. When a material shared internal-link
   or content change truly affects routes, implementation adds a specifically named
   one-off registry entry and explicitly lists the affected route families. Copyright,
   style, and cosmetic changes do not fan out.

## Non-goals

- Explaining or fixing every "Discovered, currently not indexed" URL.
- Altering canonical/domain/redirect/robots/sitemap URL coverage.
- Adding arbitrary changeFrequency or priority values.
- Making deployments appear as content updates.
- Rewriting historical audit documentation.
- Starting SEO-02 implementation before approval.

## Handoff Summary

**Finding:** sitemap coverage exists, but all lastModified values are derived from
new Date(), so they are not page-content freshness signals.

**Recommended remediation:** semantic per-record timestamps plus a narrow static/page
registry, aggregate maximums for real dependencies, and omission where unknown.

**Risk to control:** shared components and data fan out across service, city,
homepage, prices, portfolio, and blog pages. The dependency policy must be explicit.

**Current state:** discovery and final design are complete. Implementation is tracked
separately on codex/SEO-02-sitemap-lastmod; main and Production remain unchanged until
separate approval.

## FINAL DESIGN

### A. Timestamp fields

| Owner | Field(s) | Semantic scope |
| --- | --- | --- |
| Service | detailUpdatedAt?: YYYY-MM-DD | own detail surface only: copy, FAQ, gallery, service-specific schema/media |
| City | updatedAt?: YYYY-MM-DD | that city's meaningful canonical page content |
| Project | updatedAt?: YYYY-MM-DD | that project's meaningful displayed evidence |
| BlogPost | publishedAt: YYYY-MM-DD; updatedAt?: YYYY-MM-DD | publication and later substantive update, respectively |
| Registry | serviceCardsUpdatedAt?: YYYY-MM-DD | one shared surface for card-visible Service title, price, image, and equivalent fields |
| Registry | serviceProductDataUpdatedAt?: YYYY-MM-DD | shared Service inputs used by the six Product objects on /tseny |

### B. Freshness registry location

Create one small source module near the existing SEO helpers, for example
lib/sitemap-freshness.ts. It owns optional static-route dates and template/group dates:

- templates.servicePage;
- templates.cityPage;
- templates.blogArticle;
- templates.homepage;
- templates.pricesPage;
- templates.portfolioPage;
- templates.blogIndex;
- static /otzyvy and /kontakty;
- groups.serviceCardsUpdatedAt;
- groups.serviceProductDataUpdatedAt;
- no default Header/Footer value.

Every registry value is optional. A material Header/Footer change gets an explicit,
named entry only for that event and only after the affected route families are stated.

### C. Lastmod by route family

| Family | Exact date inputs |
| --- | --- |
| / | homepage template date; serviceCardsUpdatedAt while cards render; updatedAt of actually rendered featured projects; never City.updatedAt automatically |
| service | own detailUpdatedAt; ServicePage template date; serviceCardsUpdatedAt only because related service cards render; explicit applicable Header/Footer entry |
| city | own City.updatedAt; CityPage template date; selected proof Project.updatedAt; serviceCardsUpdatedAt; explicit applicable Header/Footer entry |
| /tseny | prices template date; serviceCardsUpdatedAt; serviceProductDataUpdatedAt; no Service.detailUpdatedAt |
| /nashi-raboty | portfolio template date; visible Project.updatedAt values |
| /otzyvy | its static registry date |
| /kontakty | its static registry date |
| /blog | blog-index template date; maximum of visible posts' updatedAt ?? publishedAt |
| /blog/[slug] | that post's updatedAt ?? publishedAt; blog-article template date |

The result is the maximum trustworthy date in the row. It is omitted if that row has
no trustworthy date.

### D. When lastmod is absent

Lastmod is absent whenever no listed dependency has a reliable meaningful date. This
is expected during legacy migration and is preferable to false coverage. The goal is
accuracy, not populating all 55 entries.

### E. Fan-out rules

- A FAQ/gallery/detail-schema change updates only its own service URL because those
  surfaces are not rendered by CityPage, /tseny, or the shared cards.
- A Service title/price/image card change updates serviceCardsUpdatedAt. It therefore
  updates each URL that renders the shared card group: the homepage, applicable service
  pages, all city pages, and /tseny. The content really changed on every such URL.
- A Product-data-only change updates serviceProductDataUpdatedAt and therefore /tseny,
  but does not update service, city, homepage, blog, portfolio, or static routes.
- A city landing copy/FAQ change updates City.updatedAt for that city only. Homepage
  city navigation/group changes explicitly bump homepage freshness instead of taking
  a maximum across all City.updatedAt values.
- A CityPage or ServicePage material template change updates its own route family.
- A project change propagates only to routes which render that project.
- No broad global fan-out occurs by default.

### F. Blog and Article JSON-LD

Migration replaces each current BlogPost.date property with the identical
BlogPost.publishedAt value. For every post:

~~~text
datePublished = publishedAt
dateModified  = updatedAt ?? publishedAt
sitemap lastmod = updatedAt ?? publishedAt
~~~

When a substantive update occurs, publishedAt remains unchanged and updatedAt is set.
No updatedAt is invented for the current three posts.

### G. Expected implementation files

The likely narrow implementation surface is:

- content/services.ts;
- content/cities.ts;
- content/projects.ts;
- content/blog-posts.ts;
- a new lib/sitemap-freshness.ts (or equivalent small helper/registry);
- lib/seo.ts for Article JSON-LD date semantics;
- app/sitemap.ts.

The actual implementation should re-check callsites before editing. No UI, canonical,
robots, redirects, analytics, Telegram, or deployment-config changes are implied.

### H. Complexity and maintenance

**Implementation complexity:** low to moderate. The code is small, but the semantic
mapping and migration must be reviewed carefully.

**Maintenance burden:** low. Editors update a per-record date only when that
record's own rendered content changes; shared card and Product-data edits update their
two explicit group dates (both when one edit affects both surfaces); material
template/static changes update one registry value. There is no runtime graph and no
requirement to maintain dates for every legacy URL.
