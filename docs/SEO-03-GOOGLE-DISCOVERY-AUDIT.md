# SEO-03 Google Discovery Audit

Audit date: 2026-09-07  
Production: https://www.masterzabor.by  
Repository baseline: `f4577b6421014a81cac1b16fa088da419ccf589e`  
Stage: `SEO-03-google-discovery-audit`  
Mode: read-only discovery; no implementation, commit, push, GSC API, or search-engine API

## Evidence And Method

Evidence classes are kept separate throughout this document:

- **CONFIRMED FACT**: directly verified in the current repository or live Production.
- **GSC USER OBSERVATION**: manually reported by the user; not obtained through an API in this audit.
- **HYPOTHESIS**: plausible interpretation that cannot be proved from the repository or public HTML alone.
- **UNSUPPORTED**: not supported by the available evidence.

Production checks fetched the current sitemap, robots.txt, and initial server-rendered
HTML for all 55 sitemap URLs. The link graph counts only HTML `<a href>` links between
the 55 canonical public pages. Sitemap membership is not counted as a link. Self-links,
fragment links, telephone/messenger links, and `/_next/image?...` resources are excluded
from incoming-link counts.

The city similarity sample covers `/gomel`, `/minsk`, `/brest`, `/lida`, `/grodno`,
`/glubokoe`, `/zhlobin`, and `/molodechno`. Similarity is measured on visible `<main>`
text with scripts, styles, SVG markup, and HTML tags removed. Five-word shingle Jaccard
similarity is a directional audit metric, not a Google metric.

Official Google references used for interpretation:

- [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [Sitemap overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Crawlable link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Crawl budget guidance](https://developers.google.com/crawling/docs/crawl-budget)
- [Helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Spam policies and doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies)
- [URL Inspection help](https://support.google.com/webmasters/answer/9012289)

## A. Executive Verdict

**Verdict 2: no technical blocker found, but material discovery weaknesses exist.**

All 55 canonical sitemap URLs returned direct `200`, used self-referential canonical
URLs, had no `noindex`, no `nofollow` robots directive, and no `X-Robots-Tag` block.
All are reachable through server-rendered HTML links and no orphan page exists. The
sitemap and robots reference are correct.

The strongest material weakness is the city cluster: one shared template produces
highly similar body content, and 28 of 40 city pages show the same nationwide fallback
project proof instead of local or regional proof. A second, smaller weakness is uneven
internal linking: `/petrikov` has only one incoming source page, while the blog cluster
has low contextual integration despite `/blog` being linked globally in the Footer.

These weaknesses may reduce crawl demand or perceived page value, but they do not prove
why Google scheduled or did not schedule a crawl. The available evidence does not support
calling this a crawl-capacity problem, a canonical problem, or a robots problem.

## B. Known GSC Observations

The following are **manual user-provided GSC observations**, not API results and not
revalidated by this audit:

- Production sitemap was reported as `Success` with 55 current URLs.
- An earlier Page Indexing snapshot reported 16 indexed URLs and 40 URLs in
  `Discovered, currently not indexed`, plus historical redirect URLs.
- `/gomel`, `/tseny`, `/vorota-raspashnye`, and `/blog` were manually inspected in that
  category.
- For those inspected URLs, Google knew the URL but showed no last crawl, no fetch, and
  no canonical selection. This means the sampled pages had not yet been crawled in that
  snapshot; it is incorrect to say Google crawled and rejected them.
- Historical inspection snapshots sometimes did not show a referring sitemap even
  though the current sitemap is correct.
- `/zabory-iz-profnastila` is the indexed control URL and passed the post-SEO-01 Google
  live structured-data validation.
- At least one blog article was reported indexed while `/blog` itself was previously in
  `Discovered, currently not indexed`.
- Yandex was reported to know or index the site more fully than Google.

The current GSC counts, the current status of each URL, and an authoritative list of
indexed city pages are unavailable in this stage.

## C. Full Technical Indexability Audit

Live crawl result: **55/55 direct canonical requests returned `200`; 55/55 canonicals
were self-referential; 55/55 were in the sitemap; 0 robots/indexability anomalies.**

| URL/family | Count | Status/final URL | Canonical | Robots/noindex | Sitemap | Anomaly |
| --- | ---: | --- | --- | --- | --- | --- |
| `/` | 1 | `200`, canonical host | self, `www`, no slash policy | no meta block; no X-Robots | yes | none |
| service pages | 6 | `200`, no redirect | self, `www`, no slash | no meta block; no X-Robots | 6/6 | none |
| city pages | 40 | `200`, no redirect | self, `www`, no slash | no meta block; no X-Robots | 40/40 | none |
| `/tseny` | 1 | `200`, no redirect | self | no meta block; no X-Robots | yes | none |
| `/nashi-raboty` | 1 | `200`, no redirect | self | no meta block; no X-Robots | yes | none |
| `/otzyvy` | 1 | `200`, no redirect | self | no meta block; no X-Robots | yes | none |
| `/kontakty` | 1 | `200`, no redirect | self | no meta block; no X-Robots | yes | none |
| `/blog` | 1 | `200`, no redirect | self | no meta block; no X-Robots | yes | none |
| `/blog/[slug]` | 3 | `200`, no redirect | self | no meta block; no X-Robots | 3/3 | none |

`robots.txt` returned `200` and contains:

```text
User-Agent: *
Allow: /
Disallow: /api/

Host: www.masterzabor.by
Sitemap: https://www.masterzabor.by/sitemap.xml
```

The sitemap returned `200`, contains 55 unique absolute canonical URLs, and has no apex
or trailing-slash page entries. SEO-02 remains intact: only `/blog` and the three blog
posts have `lastmod`, all four equal to `2026-05-18`; the other 51 omit it intentionally.

Exact duplicate checks across the live 55-page set found:

- duplicate `<title>` values: `0`;
- duplicate meta descriptions: `0`;
- duplicate H1 values: `0`.

These unique metadata values do not by themselves make the underlying city bodies
substantially unique.

## D. Internal Link Graph

Definitions:

- `incoming`: total `<a href>` occurrences from other canonical pages;
- `sources`: unique source pages, excluding self-links;
- `context`: unique source pages with the link inside `<main>`, excluding Header/Footer;
- `homepage`: contextual link from the homepage body, not merely its Header/Footer;
- `depth`: shortest HTML-link path from `/`;
- `Strong`: global navigation or at least 12 source pages plus useful context;
- `Medium`: reachable at depth 1 with 5-11 sources, or global Footer support but limited context;
- `Weak`: 2-4 source pages or a small depth-2 cluster;
- `Near-orphan`: exactly one source page;
- `Orphan`: no source page.

| URL | Family | Incoming | Sources | Depth | Header | Footer | Homepage | Context | Class |
| --- | --- | ---: | ---: | ---: | :---: | :---: | :---: | ---: | --- |
| `/` | home | 216 | 54 | 0 | yes | yes | n/a | 54 | Strong |
| `/zabory-iz-profnastila` | service | 172 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/zabory-iz-evroshtaketnika` | service | 232 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/zabory-iz-setki-rabitsy` | service | 200 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/vorota-raspashnye` | service | 156 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/vorota-otkatnye` | service | 157 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/kalitki` | service | 156 | 54 | 1 | yes | yes | yes | 48 | Strong |
| `/gomel` | city | 16 | 16 | 1 | no | no | yes | 16 | Strong |
| `/mozyr` | city | 16 | 16 | 1 | no | no | yes | 16 | Strong |
| `/zhlobin` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/svetlogorsk` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/rechitsa` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/kalinkovichi` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/rogachev` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/dobrush` | city | 10 | 10 | 1 | no | no | yes | 10 | Medium |
| `/khoyniki` | city | 9 | 9 | 1 | no | no | yes | 9 | Medium |
| `/petrikov` | city | 1 | 1 | 1 | no | no | yes | 1 | Near-orphan |
| `/minsk` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/borisov` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/soligorsk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/molodechno` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/zhodino` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/slutsk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/brest` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/baranovichi` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/pinsk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/kobrin` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/bereza` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/zhabinka` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/grodno` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/lida` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/volkovysk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/slonim` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/smorgon` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/novogrudok` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/vitebsk` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/orsha` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/novopolotsk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/polotsk` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/glubokoe` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/lepel` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/mogilev` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/bobruysk` | city | 12 | 12 | 1 | no | no | yes | 12 | Strong |
| `/osipovichi` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/gorki` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/krichev` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/klimovichi` | city | 6 | 6 | 1 | no | no | yes | 6 | Medium |
| `/blog` | blog hub | 57 | 54 | 1 | no | yes | no | 3 | Medium |
| `/blog/kakoy-zabor-luchshe-profnastil-ili-evroshtaketnik` | article | 5 | 3 | 2 | no | no | no | 3 | Weak |
| `/blog/skolko-stoit-postavit-zabor-v-belarusi-2026` | article | 5 | 3 | 2 | no | no | no | 3 | Weak |
| `/blog/nuzhno-li-razreshenie-na-ustanovku-zabora-v-rb` | article | 5 | 3 | 2 | no | no | no | 3 | Weak |
| `/tseny` | commercial | 114 | 54 | 1 | yes | yes | no | 6 | Strong |
| `/nashi-raboty` | portfolio | 149 | 54 | 1 | yes | yes | yes | 41 | Strong |
| `/otzyvy` | trust | 55 | 54 | 1 | no | yes | yes | 1 | Medium |
| `/kontakty` | contact | 108 | 54 | 1 | yes | yes | no | 0 | Strong |

There are **0 orphans** and **1 near-orphan**. All 55 pages are reachable from the
homepage within at most two clicks; all non-article pages are at depth 1.

### Top Weakest URLs

| Rank | URL/group | Sources | Depth | Why weak |
| ---: | --- | ---: | ---: | --- |
| 1 | `/petrikov` | 1 | 1 | only the homepage links to it; the related-city slice never selects it |
| 2 | comparison article | 3 | 2 | blog index plus two sibling articles only |
| 3 | pricing article | 3 | 2 | blog index plus two sibling articles only |
| 4 | permission article | 3 | 2 | blog index plus two sibling articles only |
| 5 | `/borisov` | 6 | 1 | homepage plus a small same-region clique |
| 6 | `/soligorsk` | 6 | 1 | homepage plus a small same-region clique |
| 7 | `/baranovichi` | 6 | 1 | homepage plus a small same-region clique |
| 8 | `/pinsk` | 6 | 1 | homepage plus a small same-region clique |
| 9 | `/lida` | 6 | 1 | homepage plus a small same-region clique |
| 10 | `/volkovysk` | 6 | 1 | homepage plus a small same-region clique |
| 11 | `/orsha` | 6 | 1 | homepage plus a small same-region clique |
| 12 | `/glubokoe` | 6 | 1 | homepage plus a small same-region clique |
| 13 | `/osipovichi` | 6 | 1 | homepage plus a small same-region clique |
| 14 | `/gorki` | 6 | 1 | homepage plus a small same-region clique |
| 15 | `/krichev` | 6 | 1 | homepage plus a small same-region clique |

Twenty-four city routes tie at six unique sources; the table shows representative
members from each region. This is a relative weakness, not an orphan problem.

## E. Indexed Vs Discovered Comparison

| URL | Evidence class | Main words | Images | Sources/context | Depth | Schema/content notes |
| --- | --- | ---: | ---: | --- | ---: | --- |
| `/zabory-iz-profnastila` | indexed control, user-provided GSC | 592 | 7 | 54 / 48 | 1 | Product + Offer, FAQ, Breadcrumb, real hero/gallery |
| `/vorota-raspashnye` | discovered/not crawled, user-provided GSC | 558 | 7 | 54 / 48 | 1 | same shared ServicePage architecture and schema classes |
| `/tseny` | discovered/not crawled, user-provided GSC | 434 | 8 | 54 / 6 | 6 Products, prices, real service images, links to all services |
| `/gomel` | discovered/not crawled, user-provided GSC | 680 | 19 | 16 / 16 | city LocalBusiness + geo, but nationwide fallback proof |
| `/blog` | discovered/not crawled, user-provided GSC | 137 | 3 | 54 / 3 | globally Footer-linked list hub; generated covers |

There is no single technical trait shared by the four discovered pages and absent from
the indexed control. In particular, `/vorota-raspashnye` is nearly equivalent to the
indexed service page in status, canonical, depth, schema, image count, content length,
and link sources. `/tseny` also has strong discovery paths. That evidence argues against
a route-level technical blocker as the common explanation.

The audit cannot compare **indexed city pages** against discovered city pages because
the user-provided observations identify `/gomel` as discovered but do not provide a
current authoritative list of indexed cities. Search-result `site:` checks would not be
a reliable substitute for GSC URL Inspection data.

## F. City Similarity Audit

### Measured Similarity

Across 28 pairwise comparisons in the eight-page sample:

- minimum five-word shingle Jaccard similarity: `0.6424`;
- maximum: `0.8483` (`/lida` vs `/grodno`);
- average: `0.7277`;
- visible `<main>` length: 661-689 words across all 40 city pages;
- image count: exactly 19 on every city page.

The structure is the same on all 40 routes: hero, trust benefits, SEO prose, six service
cards, optional district block, project proof, calculator, and related cities.

### Meaningful Unique Fields

- unique title, meta description, H1, city-name inflections, and oblast wording;
- unique canonical URL and breadcrumb;
- geo metadata (`placename`, coordinates) from each city record;
- city-specific LocalBusiness name, URL, address locality/region, geo, and areaServed;
- optional district names for a small subset of cities;
- related-city link set by oblast;
- project-proof selection where exact-city or same-oblast proof exists.

### Boilerplate Or Low-Variation Surfaces

- the section order and almost all headings;
- benefit/trust cards and commercial claims;
- all six service cards, images, descriptions, and prices;
- calculator and CTA copy;
- four SEO paragraphs, where most sentence structure is identical and city/oblast names
  are substituted;
- nationwide fallback proof cards.

Project proof distribution is especially important:

- 5/40 routes have exact-city confirmed project proof: `/slonim`, `/novogrudok`,
  `/smorgon`, `/glubokoe`, and `/lepel`;
- 7/40 have same-oblast proof;
- 28/40 fall back to the same nationwide proof pattern, including `/gomel`, `/minsk`,
  `/brest`, `/zhlobin`, and `/molodechno` in the sample.

### Risk Classification

**Material similarity/local-differentiation risk: confirmed. Doorway abuse: not
confirmed.** The pages are navigable, contain useful service/pricing/contact actions,
and do not merely redirect users to another final page. However, Google explicitly
calls out substantially similar city-targeted pages that funnel users toward the same
destination as a doorway-abuse pattern. The current pages have enough functionality to
avoid declaring a violation from this audit, but 28 pages with the same fallback proof
and mostly substituted prose are a credible quality and crawl-demand weakness.

The available data does not show that indexed city pages are structurally stronger than
discovered city pages. The current architecture is shared; any difference would most
likely come from proof availability, internal/external signals, age, or Google-side
prioritization, and needs current GSC data to test.

## G. Commercial And Service Audit

The six service pages use one shared template and each has:

- a direct homepage link;
- Header and Footer links in initial HTML;
- links from every city page through six service cards;
- links from `/tseny`, related-service blocks, and matching portfolio records;
- real hero/gallery images;
- unique title/meta/H1 and service prose;
- Product, Offer, FAQ, and Breadcrumb JSON-LD.

The indexed `/zabory-iz-profnastila` and discovered `/vorota-raspashnye` have no material
technical or architectural separation. Their unique-source and contextual-source counts
are identical (`54` and `48`), both are depth 1, and both use seven real images. The gate
page is inside a CSS dropdown on desktop, but its ordinary `<a href>` exists in initial
server-rendered HTML; it does not require interaction for discovery.

`/tseny` is also technically strong: Header/Footer presence, depth 1, 54 unique sources,
six contextual sources, six service links, eight real images, useful price guidance, and
six Product objects. Its lower main-text count and lower contextual-source count than a
ServicePage are objective differences, but neither is an indexability block.

`/nashi-raboty` has 54 source pages and 41 contextual sources because city pages link to
the portfolio. It contains 17 project images and 364 main words. It is a strong internal
proof hub, though eight older starter/demo project records remain known content debt.

Several service `<title>` values still use a Gomel intent while their H1/body target all
Belarus. The indexed control and discovered gate page both share that pattern, so it
cannot explain their different GSC outcomes. It is a future intent-consistency question,
not a crawl blocker.

## H. Blog Audit

- `/blog` has 54 unique source pages because it appears in the global Footer.
- It is absent from the Header and has no contextual homepage-body link.
- Its only contextual sources are the three articles linking back through breadcrumbs.
- All three posts are present as ordinary server-rendered `<a href>` links on `/blog`.
- Each article links to `/blog` and both sibling articles.
- Each article is depth 2 and has three unique source pages.
- Article bodies contain no contextual links to services, `/tseny`, portfolio, or other
  commercial pages; commercial navigation is limited to global Header/Footer and the
  on-page lead form.
- `/blog` has 137 visible main words and three generated SVG covers. It functions as a
  valid list hub, but it is a relatively light hub compared with the commercial pages.
- Articles have 658-663 visible main words, one generated cover each, and Article plus
  Breadcrumb JSON-LD. The legal/permission article provides no external source links,
  which weakens trust for a rules-oriented topic.

The observation that an article was indexed before `/blog` is possible without a bug:
Google can discover URLs through sitemaps, internal links, and external links, then
schedule them differently. The current public evidence cannot identify the path Google
used or prove that it found an article before the hub.

## I. Redirect And History Audit

| Requested form | Current result | Interpretation |
| --- | --- | --- |
| `https://www.../gomel` | direct `200` | canonical form |
| `https://www.../gomel/` | `308` to `/gomel` | expected no-slash normalization, one hop |
| `https://masterzabor.by/gomel` | `307` to `https://www.../gomel` | apex alias to canonical, one hop |
| `https://masterzabor.by/gomel/` | `307` to `www` slash, then `308` to no-slash | two hops only for combined legacy variant |
| `http://www.../gomel` | `308` to HTTPS canonical | expected HTTPS normalization |
| `https://masterzabor-site.vercel.app/gomel` | `308` to canonical | duplicate deployment host closed |
| `/preload` | honest `404` | no live route or internal link |
| `/vorota` | honest `404` | no live route or internal link |

No loop was observed. Current HTML contains zero apex links, zero trailing-slash page
links, zero query-string internal page links, and zero links to nonexistent public routes.
Canonical/sitemap/internal URL policy is consistent. Historical GSC redirect rows can
therefore be stale residue; they are not evidence of a current canonical-route failure.

The apex redirect currently uses `307`, and the apex+slash combination takes two hops.
Because all current sitemap, canonical, and internal links point directly to `www` without
a slash, this is legacy-edge hygiene rather than an explanation for the 40 canonical
URLs. Domain architecture must not be changed without its own approved audit.

## J. Findings

### SEO03-01: City bodies have high template similarity and limited local proof

- **Severity:** P1
- **Status:** CONFIRMED weakness; indexing impact is a HYPOTHESIS
- **Evidence:** average sampled 5-word similarity `0.7277`; all 40 city pages use the
  same structure; 28/40 show nationwide fallback proof; city SEO prose primarily swaps
  city and oblast tokens.
- **Affected URLs:** 40 city routes, strongest concern for the 28 fallback routes.
- **Why it matters:** substantially similar local pages can look less useful and less
  distinctive, lowering crawl demand or index selection. This is not proof of a doorway
  violation or proof of Google's reason.
- **Safest possible remediation:** add verified city/oblast projects and genuinely local
  facts through the existing data model, in a small evidence-led batch. Do not fabricate
  locations or create 40 separate templates.

### SEO03-02: Related-city selection produces an asymmetric graph

- **Severity:** P2
- **Status:** CONFIRMED
- **Evidence:** `getRelatedCities()` filters by region then takes the first eight records.
  `/petrikov`, last in a ten-city group, receives no related-city link and has only the
  homepage as an incoming source. Twenty-four other cities have six source pages.
- **Affected URLs:** `/petrikov` most clearly; secondary-city routes across regions.
- **Why it matters:** all pages remain reachable, but uneven contextual reinforcement
  sends weaker relative importance signals and makes discovery depend heavily on one hub.
- **Safest possible remediation:** make the one shared related-city selector balanced
  and deterministic so every city is linked from several relevant peers; add no new URLs.

### SEO03-03: Blog has global discovery but weak contextual integration

- **Severity:** P2
- **Status:** CONFIRMED
- **Evidence:** `/blog` has 54 source pages only because of Footer repetition, only three
  contextual sources, no Header/homepage-body link, and 137 main words. Each article has
  three source pages at depth 2. Article bodies have no service or pricing links.
- **Affected URLs:** `/blog` and three articles.
- **Why it matters:** the cluster is crawlable, but its topical relationship to the
  commercial site and its hub importance are underexpressed.
- **Safest possible remediation:** add a small number of useful contextual links between
  relevant articles, services, and `/tseny`, and one meaningful route into the blog hub.
  Do not add repetitive exact-match anchors.

### SEO03-04: WebSite SearchAction advertises a search that does not exist

- **Severity:** P2
- **Status:** CONFIRMED
- **Evidence:** `generateWebsiteJsonLd()` emits a SearchAction to
  `/blog?q={search_term_string}` on every page. `/blog` does not read `searchParams` or
  filter posts. `/blog?q=fence` returns the same `200` list with canonical `/blog`.
- **Affected URLs:** global WebSite JSON-LD; query variants if requested.
- **Why it matters:** schema describes functionality users and crawlers do not receive;
  it can cause unnecessary query requests and is inaccurate structured data.
- **Safest possible remediation:** remove SearchAction in its own small stage unless a
  real search is implemented.
- **Can it explain `Discovered, currently not indexed`?** No credible evidence. The
  affected GSC URLs are canonical paths, there are no internal query links, and the
  issue does not block their crawl.

### SEO03-05: No current indexability or canonical blocker was found

- **Severity:** informational/pass
- **Status:** CONFIRMED
- **Evidence:** 55/55 direct `200`, self canonical, sitemap membership, no robots block;
  no broken, apex, slash, query, or onClick-only page navigation in the public graph.
- **Affected URLs:** all 55.
- **Why it matters:** remediation should not reopen canonical, robots, redirects, or
  sitemap membership without new evidence.
- **Safest possible remediation:** none; monitor current GSC and preserve invariants.

### SEO03-06: Historical redirect variants remain distinguishable from current pages

- **Severity:** informational
- **Status:** CONFIRMED current behavior; historical GSC interpretation is a HYPOTHESIS
- **Evidence:** canonical forms are direct `200`; slash/apex variants redirect without a
  loop; duplicate Vercel host redirects permanently; current HTML emits canonical forms.
- **Affected URLs:** historical apex/slash/duplicate-host variants.
- **Why it matters:** old GSC redirect rows may remain visible after the live problem is
  gone and should not be mixed into diagnosis of canonical URLs never crawled.
- **Safest possible remediation:** no redirect change; compare dates in current GSC data.

## K. Root-Cause Ranking

1. **LIKELY:** Google-side crawl demand/prioritization is lower than the number of known
   URLs. This fits the user-provided `Discovered` snapshots with no crawl and the absence
   of a live technical blocker. Authority, popularity, and external signals were not
   measured, so this remains a hypothesis.
2. **LIKELY:** city-template similarity and weak local differentiation reduce the
   perceived incremental value of much of the 40-page city cluster. The similarity and
   proof distribution are confirmed; their effect inside Google is not.
3. **POSSIBLE:** uneven contextual importance contributes for specific subsets: one
   near-orphan city, a light `/blog` hub, and depth-2 article pages. This cannot explain
   `/tseny` or `/vorota-raspashnye`, which have strong internal discovery.
4. **POSSIBLE:** site age or limited external authority lowers crawl demand. No backlink,
   launch-age, or current GSC crawl-stat evidence was available in this stage.
5. **UNSUPPORTED:** robots blocking, `noindex`, canonical mismatch, sitemap membership,
   redirect loop, broad 4xx/5xx failure, JavaScript-only navigation, or host-capacity
   exhaustion as the common cause.

Google's crawl-budget guide targets very large/frequently changing sites, while this
site has only 55 canonical pages. The guide also notes that sites with a large proportion
of discovered/not-indexed URLs may investigate crawl demand, but the label alone does not
prove a capacity problem. Here the live server handled the full audit without 5xx errors;
only GSC Crawl Stats or server/CDN logs could evaluate Googlebot capacity over time.

## L. Three Safest Improvements

Only these three are recommended from the current evidence:

| Priority | What | Why | Affected URLs | Expected benefit | Risk | Size |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Balance the shared related-city selector | fixes the confirmed `/petrikov` near-orphan and data-order bias | 40 city pages | more even contextual discovery and city-to-city reinforcement | low; preserve relevance and avoid oversized lists | small |
| 2 | Expand verified local/regional proof through the existing project/city model | addresses the strongest quality/similarity weakness without inventing copy | prioritize 28 nationwide-fallback city pages using current GSC evidence | stronger local usefulness, differentiation, trust, and potential crawl demand | medium; requires truthful project data and photos | medium/content-led |
| 3 | Strengthen the blog's contextual routes | the Footer provides reach but not topical context; posts do not feed commercial pages | `/blog`, 3 posts, selected relevant service/pricing pages | clearer hub importance and topical relationships | low if links are genuinely useful and sparse | small-medium |

Removing the false SearchAction remains a valid small schema cleanup, but it is not one
of the top three discovery improvements because it has no credible connection to the 40
canonical URLs waiting for crawl.

## M. What Not To Do

- Do not rewrite 40 city pages blindly or create 40 independent templates.
- Do not fabricate city projects, branches, crews, reviews, dates, or local facts.
- Do not add arbitrary word count; Google explicitly says it has no preferred word count.
- Do not request indexing for every URL every day; repeated requests do not accelerate
  crawl and do not guarantee indexing.
- Do not treat sitemap submission as a guarantee of crawl or indexing.
- Do not restore generated current-time `lastmod` values or change SEO-02 semantics.
- Do not change canonical host, no-slash policy, robots, or domain redirects based on
  historical residue.
- Do not add redirects or pages for `/preload` or `/vorota`; current honest `404` is valid.
- Do not block `/_next/image?...` as if it were an indexable page problem.
- Do not keyword-stuff city pages or duplicate exact-match anchors across every page.
- Do not call the site a confirmed doorway-abuse violation without Google-side evidence.

## N. What Cannot Be Concluded

Without current GSC URL Inspection/Page Indexing data, Crawl Stats, and Googlebot logs,
this audit cannot prove:

- whether the earlier 16/40 split is still current;
- which city pages are currently indexed;
- when Google last processed the sitemap or SEO-02 lastmod changes;
- the exact discovery source Google recorded for each URL;
- whether Google scheduled a crawl and deferred it because of crawl demand or host load;
- whether Google would select the declared canonical after crawling;
- whether similarity, authority, external links, site age, or demand was decisive;
- whether historical redirect rows are still active or only report residue;
- whether an indexed blog article was found through `/blog`, sitemap, or an external link;
- whether Google applies any internal quality cluster or spam classification;
- the effect any proposed change would have on crawl frequency or indexing.

Public HTML and repository evidence can disprove several technical blocker hypotheses;
they cannot expose Google's internal scheduling, quality, canonical-selection, or
indexing decisions.

## O. Recommended Next Stage

Recommend one narrow implementation stage:

**`SEO-04-city-internal-link-coverage`**

Scope it only to the shared `getRelatedCities()` selection policy and automated graph
verification. Replace data-order-biased `.slice(0, 8)` behavior with a deterministic,
region-relevant balanced selection so every city receives several peer links. Preserve
all 40 routes, homepage city hub, canonical URLs, copy, sitemap, robots, schema, and
domain behavior.

Why this stage first: it fixes a confirmed, low-risk architecture defect without
inventing content or assuming Google's reason. Expected impact is modest; it should not
be sold as a fix for all 40 GSC URLs. A later content stage should begin only when verified
local project evidence and current GSC city-level status are available.

No implementation is included in SEO-03.
