# PROJECT KNOWLEDGE BASE: MASTERZABOR

Дата начала базы знаний: 2026-06-03  
Проект: `masterzabor`  
Production: https://www.masterzabor.by
Latest production implementation/content baseline after P1-06.3: `7643b7fedd38585040092a7054e75dc8cb10d68c` (`Merge P1-06.3 citypage quiz compact`).
Previous production baseline before P1-03: `d612f34b9102c10abfbf5e31a396f2711d9140ea` (`feat(service): add real kalitki photography`)

## Рабочие файлы проекта

- `docs/PROJECT-ROADMAP-TRACKER.md` - текущие этапы исправлений, статусы, порядок работы и инструкция для нового чата. Это единственный roadmap source of truth.
- `PROJECT-KNOWLEDGE-BASE.md` - архитектурная память проекта.
- `AGENTS.md` - постоянный project-level operating contract для Codex: sources of truth, domain/scope/git/dev/verification rules and tooling baseline.
- `AUDIT-MASTERZABOR-2026.md` - полный аудит, причины решений и roadmap.
- `docs/` - история проекта, production/domain/analytics/OAuth runbooks.

## Назначение проекта

Коммерческий сайт для установки заборов и ворот в Беларуси. Главные бизнес-цели:

- получать заявки через формы;
- получать звонки;
- получать обращения в мессенджеры и Telegram;
- получать SEO-трафик;
- масштабировать города, услуги, блог и портфолио без переписывания проекта.

## Текущая техническая база

- Framework: Next.js App Router.
- Version: `next 16.2.9`.
- React: `19.2.7`.
- Styling: Tailwind CSS.
- Forms: `react-hook-form`.
- Storage: `@vercel/kv`.
- Hosting: Vercel.
- Integrations: Telegram, Google Analytics, Yandex Metrika, reporting APIs.

## Codex Workflow / Tooling Baseline

TOOLING-01 created root `AGENTS.md` as the stable Codex project-level operating
contract. It is intentionally short and stores only durable operational rules:
source-of-truth priority, domain invariants, scope discipline, git/deployment
workflow, local dev rules, proportional verification and the current tooling
baseline.

Source-of-truth priority for Codex work:

1. Actual repository state.
2. `docs/PROJECT-ROADMAP-TRACKER.md`.
3. Relevant sections of `PROJECT-KNOWLEDGE-BASE.md`.
4. Historical docs and `.cursorrules` only when relevant.

`.cursorrules` is historical/reference for Codex, not the primary active
instruction source. Do not migrate it wholesale because it contains stale
workflow details.

Stage prompts should now be shorter and mostly contain task-specific goal,
scope, allowed/protected files and acceptance criteria. Detailed backlog,
history, city lists, project records, photo source maps, OAuth/analytics
runbooks and future acceptance criteria stay outside `AGENTS.md`.

The current tooling baseline is sufficient: Next DevTools MCP, Browser/CUA,
screenshots, terminal/git/curl, Node tooling, Vercel CLI, and existing relevant
Skills only when needed. Do not add new MCP servers, plugins, dependencies,
test frameworks, hooks, CI, custom Skills, Vercel settings or domain/Telegram
architecture changes without separate rationale and user decision.

## История проекта и уже принятые решения

Эта база знаний объединяет текущий аудит с историей из `docs/`, а не начинает проект с нуля.

Изученные документы:

- `docs/PROGRESS.md`
- `docs/PLAN.MD.md`
- `docs/ANALYTICS.md`
- `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md`
- `docs/AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md`
- `docs/GOOGLE-OAUTH-RECOVERY.md`

### Исторически выполнено

- Создан сайт на Next.js App Router; в P0-01.5 локально обновлён до Next.js 16.2.9.
- Созданы 6 service pages.
- Созданы 40 city pages через `app/[city]/page.tsx` и `generateStaticParams`.
- Созданы страницы `/tseny`, `/nashi-raboty`, `/otzyvy`, `/kontakty`.
- Создан блог на 3 статьи.
- Созданы `sitemap.ts` и `robots.ts`.
- Добавлены metadata, OpenGraph, Twitter Cards, JSON-LD.
- Добавлены `LeadForm`, `QuizForm`, `BelarusPhoneField`.
- Добавлены API routes для лидов, статистики, Telegram webhook и cron reports.
- Подключены Vercel KV, Telegram, GA4, Yandex Metrika.
- City/Service layouts унифицированы через `SiteContainer`.
- Favicon/app icons приведены к стабильным public paths.

### Исторические инциденты и запреты

- Был redirect loop: Vercel `apex -> www` плюс custom `www -> apex` в `next.config.ts`.
- Hotfix удалил custom host redirects из `next.config.ts`.
- `www.masterzabor.by` стал canonical/runtime/source of truth.
- Запрещено добавлять `www -> apex` redirect.
- Запрещено переносить Telegram webhook на apex.
- Запрещено менять Vercel domain strategy без отдельного domain audit.

### Исторически найдено, но ещё актуально

- P0-03 makes `CRON_SECRET`, `TELEGRAM_WEBHOOK_SECRET` and `TELEGRAM_CHAT_ID` fail-closed in Vercel Production; dashboard env values still need verification.
- In-memory rate limit слаб для serverless.
- P0-03 moves new leads to atomic Redis list storage (`leads:v2:{date}` via `rpush`) while keeping legacy `leads:{date}` arrays readable for reports.
- `SearchAction` в JSON-LD есть без реального поиска.
- P1-06.1 сформировал pricing strategy: `/tseny` сохранена как indexable pricing landing, а Header теперь намеренно содержит `Цены -> /tseny` after `Наши работы`.
- P1-06.3 aligned CityPage calculator UX with the approved compact QuizForm flow while preserving one universal CityPage template and city/source lead context.
- Нужны реальные фото вместо placeholder-графики.
- P1-01 adds lightweight conversion events for contact clicks and minimal quiz funnel; submitted forms remain covered by lead stats.

### Новое уточнение текущего аудита

Прошлые документы правильно выбрали `www` и заметили trailing slash как отдельный от host вопрос. Текущий production-аудит показывает, что trailing slash стал не косметикой, а основной причиной индексирующих конфликтов:

- до P0-01 sitemap/canonical/часть JSON-LD содержали slash URL;
- production final URL без slash;
- slash URL делает 308 redirect;
- P0-01 нормализовал sitemap/canonical/OG/JSON-LD/internal links на no-slash URL.

Целевое решение: сохранять `www`, но нормализовать все внутренние canonical/sitemap/internal/schema URL в no-slash style.

## Canonical Project Decisions

### Canonical host

Текущий canonical host: `https://www.masterzabor.by`.

Решение: оставить `www` как основной host.

Причины:

- `SITE_URL` уже настроен на `www`.
- `robots.txt` указывает `Host: www.masterzabor.by`.
- sitemap указывает `www`.
- Telegram webhook URL указывает `www`.
- История проекта содержит предупреждение не возвращать redirect `www -> apex`, чтобы не получить redirect loop.

### URL style

Текущее production-поведение: URL без trailing slash являются конечными 200 URL.

Текущее кодовое поведение после P0-01: sitemap/canonical/OG/JSON-LD/internal links нормализуются в no-slash style.

Целевое решение: привести проект к no-slash URL style.

Причины:

- Next.js по умолчанию редиректит slash URL на no-slash.
- Production уже работает как no-slash.
- Менять весь проект на `trailingSlash: true` рискованнее, чем убрать slash из генераторов URL.

## Repository Map

- `app/` - App Router pages, layout, metadata routes, API routes.
- `app/layout.tsx` - global metadata, LocalBusiness/Organization/WebSite JSON-LD, GA/Yandex scripts, Header/Footer/FloatingButtons.
- `app/page.tsx` - homepage, hero, trust, services, works, quiz, reviews, geography, lead form, FAQ.
- `app/[city]/page.tsx` - 40 city pages from `content/cities.ts`; `dynamicParams = false`.
- `app/blog/page.tsx` - blog index.
- `app/blog/[slug]/page.tsx` - 3 статей from `content/blog-posts.ts`; Article/Breadcrumb JSON-LD.
- `app/sitemap.ts` - generated sitemap; P0-01 normalizes all loc URLs to no-slash canonical URLs.
- `app/robots.ts` - generated robots; correct host/sitemap.
- `app/api/*` - lead, stats, Telegram webhook, daily reports, analytics reports.
- `components/layout/` - global layout and shared container.
- `components/forms/` - lead capture forms and phone field.
- `components/templates/` - reusable page templates for city/service pages.
- `components/cards/` - repeated product card.
- `components/portfolio/` - portfolio cards and filter/gallery.
- `content/` - 40 cities, 6 services, 3 posts, project portfolio dataset.
- `lib/` - constants, SEO, phone, Telegram, leads, reporting, analytics.
- `public/` - icons, manifest, logo, OG image.
- `docs/` - project history and runbooks.
- `scripts/` - Telegram operational script.

## Route Map

Основные маршруты:

- `/`
- `/zabory-iz-profnastila`
- `/zabory-iz-evroshtaketnika`
- `/zabory-iz-setki-rabitsy`
- `/vorota-raspashnye`
- `/vorota-otkatnye`
- `/kalitki`
- `/[city]`
- `/tseny`
- `/nashi-raboty`
- `/otzyvy`
- `/kontakty`
- `/blog`
- `/blog/[slug]`

API routes:

- `/api/lead`
- `/api/stats`
- `/api/telegram-webhook`
- `/api/cron/daily-report`
- `/api/cron/analytics-report`

Sitemap coverage: all main routes are covered; after P0-01 sitemap loc URLs use no-slash final URLs.

Robots coverage: `/api/` is disallowed; public routes are allowed.

## Component Map

Ключевые компоненты:

- `Header`
- `Footer`
- `FloatingButtons`
- `SiteContainer`
- `LeadForm`
- `QuizForm`
- `BelarusPhoneField`
- `ServicePage`
- `CityPage`
- `BenefitTrustSection`
- `ProductCard`
- `ProjectCard`
- `PortfolioGallery`

Usage and risks:

- `Header`: global navigation, phone and messengers. After P1-06.1 final order is `Профнастил -> Штакетник -> Сетка-рабица -> Ворота -> Наши работы -> Цены -> Контакты`; `Цены` points to no-slash `/tseny`.
- `Footer`: has full nav including prices/blog/reviews, better coverage than header.
- `FloatingButtons`: mobile conversion layer for calls and messengers.
- `SiteContainer`: good shared layout primitive; should continue expanding to all sections.
- `ServicePage`: good shared service template; has Product/FAQ/Breadcrumb JSON-LD and approved real-photo system. Desktop hero pattern is `480x480`, `rounded-3xl`, `overflow-hidden`, `next/image fill + object-cover`; all six service pages have approved real-photo hero/gallery assets.
- `CityPage`: universal city template for all city routes; unique city text is generated from city data. After P1-05.1 it uses the homepage hero photo direction, real service thumbnails, shared `BenefitTrustSection`, and truthful project proof from confirmed real records. After P1-06.3 its calculator section uses a light homepage-like composition, dynamic city heading and compact QuizForm presentation.
- `BenefitTrustSection`: shared 8-card benefit/trust block used by homepage and CityPage. It is the single source for approved benefit titles, text and production icon paths.
- `QuizForm`: main conversion form. Default presentation remains the larger form unless a caller opts into `presentation="compact"`. P1-06.1 uses compact presentation on `/tseny`; P1-06.2 uses the same compact presentation in the homepage calculator section; P1-06.3 uses it in CityPage. These stages did not change validation, API submission or analytics events.
- `LeadForm`: simpler fallback form on homepage.
- `ProjectCard`: reusable project card for portfolio surfaces. It must read category, city, title, service link, photos and optional facts from the project record; do not hardcode cities/materials/project titles in the component.
- `PortfolioGallery`: useful client filter over the shared project dataset.

Duplicated/centralization candidates:

- Messenger icons in `Header` and `FloatingButtons`.
- Placeholder SVG generation in multiple files.
- Trailing slash link construction.
- Breadcrumb URL construction.
- Analytics source-to-page conversion was normalized to no-slash paths in P0-01.

## Dependency Map

Current lockfile versions:

- `next`: 16.2.9
- `react`: 19.2.7
- `react-dom`: 19.2.7
- `tailwindcss`: 4.3.0
- `@tailwindcss/postcss`: 4.3.0
- `@vercel/kv`: 3.0.0
- `react-hook-form`: 7.75.0
- `typescript`: 6.0.3
- `eslint`: 9.39.4
- `eslint-config-next`: 16.2.9

Dependency decisions:

- Keep Next.js/App Router.
- Keep React Hook Form.
- Keep Vercel KV for now, but change data model for leads.
- Pin core framework versions in `package.json`; avoid `latest` for Next/React/React DOM and React types.
- Use ESLint CLI (`eslint .`), not removed `next lint`.

Next 16 / MCP status:

- P0-01.5 is done locally on branch `codex/p0-next16-mcp-readiness`.
- Upgrade target reached locally: Next.js `16.2.9`, React `19.2.7`, React DOM `19.2.7`.
- Runtime Next DevTools MCP is available through `nextjs_index` / `nextjs_call` on a running dev server and exposes project metadata, routes and error diagnostics.
- `npm run lint` uses ESLint CLI and ignores `.cursor/**`; current app lint passes with one React Compiler warning from `react-hook-form` `watch()`.
- `npm run build` passes with Turbopack.
- P0-04 rechecked the tooling baseline: lint/build/dev server/Next MCP/Browser/curl smoke pass; no extra code changes needed.

Future check protocol after `npm run dev`:

1. `nextjs_index` - discover the running Next.js server and available runtime tools.
2. `nextjs_call get_errors` - check config/build/runtime errors before browser smoke.
3. `nextjs_call get_routes` - confirm current App Router route map.
4. Browser/Playwright page smoke - open homepage, service, city, blog, commercial pages and a lead form.
5. `nextjs_call get_errors` after pages are opened - catch browser/runtime/hydration errors.
6. `curl` / status codes - verify sitemap, canonical, robots, redirects and no-slash policy.

## Delivery Workflow Memory

- Work on every stage in a separate `codex/<stage-id>-<meaning>` branch; put the stage number first, then a short readable task meaning.
- Examples: `codex/P0-03-lead-reliability-secrets`, `codex/P1-01-conversion-analytics`, `codex/P1-02-header-mobile-cro`.
- Commit and push the stage branch first; this creates a Vercel Preview deployment only.
- Preview deployments validate branch work, but do not update `main` or the live production site.
- After local checks, Preview checks and explicit user approval, merge/push the branch into `main`.
- Before merging to `main`, tell the user that this action will trigger a Vercel Production deployment.
- After the Production deployment is ready, verify live URLs with Browser/Playwright and `curl`/status codes, then ask the user to click through manually.
- After `git push origin main`, wait at least 40 seconds before the first production smoke check because Vercel rollout/cache can still serve the previous deployment.
- Mark a stage `done` only after both agent production checks and user production checks pass.
- Never stage unrelated local files such as `.cursor/` or user-modified workspace files.

## Сильные стороны

- Используется современный Next.js App Router.
- Есть статическая генерация городских и блоговых страниц.
- Есть sitemap и robots.
- Есть metadata и JSON-LD.
- Есть Telegram-интеграция для заявок.
- Есть daily/analytics reporting.
- Есть базовые страницы: услуги, города, цены, работы, отзывы, контакты, блог.
- Есть единый `SITE_URL`.
- Canonical host в коде в целом согласован как `www`.

## Важные риски

- Главный SEO-риск P0-01 закрыт: sitemap/canonical/OG/JSON-LD/internal links нормализованы на no-slash и проверены после merge.
- Главный duplicate-риск P0-02 закрыт кодом: `next.config.ts` redirects `masterzabor-site.vercel.app` to `https://www.masterzabor.by`; production `308` проверен.
- Главный lead-риск P0-03 снижен: новые заявки пишутся атомарно, имеют `leadId` и delivery status; legacy data remains readable.
- Главный security-риск P0-03 снижен: cron/stats/webhook secrets fail-closed in Vercel Production; production stats/cron without token return `401`.
- Главный CRO-риск снижен по P1 pages: homepage, portfolio, services and CityPage now use real/project/service visual proof instead of generated placeholders. Blog covers still use generated SVG.
- Главный scale-риск для city pages снижен P1-05.1 за счет real proof fallback, но будущие city-local improvements должны добавлять подтвержденные проекты, а не размножать шаблоны.

## Frontend / Mobile / CRO Notes

- Header глобальный; после P1-06.1 `Цены` намеренно добавлены в nav, потому что `/tseny` стала полноценной pricing landing. Keep final order stable unless a separate navigation task changes it: `Профнастил -> Штакетник -> Сетка-рабица -> Ворота -> Наши работы -> Цены -> Контакты`.
- Mobile bottom CTA уже есть; body/bottom CTA должны учитывать `safe-area-inset-bottom`, чтобы не перекрывать контент на iPhone.
- Мобильный phone+burger должен помещаться на 320-430 px без горизонтального overflow; номер телефона должен оставаться кликабельным и не переноситься абы как.
- Mobile burger menu: компактный правый drawer, открывается только по нажатию, не рендерит offscreen-панель в закрытом состоянии, не сдвигает страницу и не оставляет пустой full-screen overlay. Внутри меню телефон отдельной full-width строкой, мессенджеры строкой ниже.
- Homepage mobile density: do not emulate Pixel by forcing a desktop/zoomed-out viewport. Pixel can look denser when Chrome uses a wider effective viewport; iPhone/Safari exposes the real mobile layout. Correct approach is true responsive CSS: compact hero spacing/type, concise trust facts, a normal vertical service list, and delayed homepage floating CTA until scroll.
- Brand visual direction after P1-02.2: use the green/white fence+M mark from `C:\DiscD\проекты сайта\Фото типов забора\Иконки-Логотип.png` as the source of truth for brand icon/favicon/app icons. Do not return to generic circle/photo logos or plain letter marks.
- Brand assets live in `public/brand/`; public favicon/app icon compatibility paths still exist at the root (`favicon.ico`, `icon-192.png`, `apple-touch-icon.png`, etc.).
- Homepage visual system should stay in the green fence reference direction: dark green + white + light neutral sections, restrained lime accents, line icons, subtle fence/mark patterns, real fence photos when available.
- Homepage proof/benefit system after P1-02.2: duplicate top dark-green stats strip was removed; use 8 equal practical ordering benefit cards (`С 2015 года`, рассрочка, доставка, быстрый расчёт, свои бригады, договор/смета, подбор под участок, гарантия на материалы и монтаж). User visually approved the final benefit icon design for production.
- Benefit icon assets after P1-05.1: production files live in `public/icons/benefits/` as `experience.svg`, `installment.svg`, `delivery.svg`, `phone.svg`, `crew.svg`, `contract.svg`, `selection.svg`, `warranty.svg`. Shared `BenefitTrustSection` loads these files and keeps the approved visual size: `44x44` mobile, `52x52` `sm+ / desktop`. The current files are intentional temporary SVG wrappers with embedded raster graphics to preserve the approved look; future true-vector SVG migration is cleanup, not a blocker. Original design/master files stay under `_design-assets/`.
- Product/service thumbnails on homepage use optimized JPEGs under `public/images/services/<slug>/hero.jpeg` and are wired through `content/services.ts` as `imageSrc`.
- Homepage hero image source after P1-02.2: `C:\DiscD\проекты сайта\Фото типов забора\Исходник с логотипом.png`, optimized into `public/images/hero/homepage-fence-with-logo.jpeg`; keep it as visual-only background while the hero H1/text stays real HTML for SEO and accessibility.
- ServicePage photo workflow is complete for all six service pages: real service photos were added one category at a time using `source folder -> hero selection -> gallery -> optimization -> service data -> localhost -> desktop/mobile visual approval -> commit/push/production`. Do not redesign the shared layout per service; tune only image assets, human `alt`, and optional focal/object-position.
- CityPage visual parity and proof are complete after P1-05.1. All 40+ city URLs still use one route/template chain: `app/[city]/page.tsx -> components/templates/CityPage.tsx -> content/cities.ts`. CityPage reuses `BenefitTrustSection`, real service thumbnails and `ProjectCard` proof cards.
- City proof selection after P1-05.1 is deterministic: confirmed projects are `content/projects.ts` records with `id.startsWith("real-")`; older starter/demo records are excluded from truthful local proof. Selection order is exact city -> same oblast -> nationwide, preserving featured-first/source order inside each bucket.
- City proof reference behavior after P1-05.1: `/slonim` shows exact-city heading `Наши работы в Слониме`; `/lida` shows oblast heading `Наши работы в Гродненской области`; `/gomel` shows nationwide fallback heading `Примеры наших работ по Беларуси` and does not claim works in Gomel.
- `/zabory-iz-evroshtaketnika` is the first approved real-photo ServicePage reference; `/zabory-iz-profnastila` is the second; `/zabory-iz-setki-rabitsy` is the third; `/vorota-raspashnye` is the fourth; `/vorota-otkatnye` is the fifth; `/kalitki` is the sixth and final P1-04 page. Homepage, `/nashi-raboty`, city pages and blog are outside this service-photo workflow.
- For square ServicePage hero, prefer a source composition prepared for 1:1 when the full object must stay visible. Keep important visual elements away from the source image edges; ordinary photos are still acceptable when `480x480 object-cover` looks good.
- Service photo assets live in `public/images/services/{slug}/`. Large local PNG/JPEG sources do not need to be stored in repo; commit optimized production WebP copies. `content/services.ts` is the linking layer for hero/gallery assets.
- P1-03 built the portfolio/project model on top of this. It does not replace the service photo library; project photos live separately in `public/images/projects/{project-id}/`.

## Pricing / Commercial Pages Decision

Status: P1-06.1 pricing landing is DONE after visual + technical approval, merge to `main`, Production deployment and Production smoke.

Source of truth: `/tseny` uses existing `content/services.ts` price data and service image data. Do not invent fixed prices or ranges outside the service records.

Implemented product decision:

- `/tseny` stays indexable with canonical `https://www.masterzabor.by/tseny` and no-slash internal links.
- The page is not a precise price list. It explains that prices are ориентировочные and that final cost is calculated for the concrete object.
- The old table-based price-page approach was replaced with a mobile-first SEO/commercial pricing landing.
- All six services are shown with real approved service photography, a short scan-friendly description, `от ...` price from `content/services.ts`, correct unit and a link to the matching service page.
- Cost factors are truthful and do not include `Доставка и регион` as a standalone pricing factor.
- The page includes approximate-data guidance for calculation and a branded final CTA.
- `QuizForm` logic is unchanged; `/tseny` uses the compact presentation only as a visual/spacing variant.
- Header now intentionally includes `Цены -> /tseny` after `Наши работы` because the pricing strategy is formed.

Superseded old P1-06 scope:

- The old stage idea `commercial pages visual polish` for `/tseny`, `/otzyvy`, `/kontakty` should not be treated as three automatically required redesigns anymore.
- `/otzyvy` should not be redesigned now without real review proof: screenshots, external sources, confirmed objects.
- `/kontakty` does not need a separate redesign now; the current functional page remains as is. A soft polish can be considered later only as a separate decision.

P1-06.1 implementation commit: `559b21a55ab9c6056ec7d7b03adbe553be49f1a1`.

P1-06.1 merge/main SHA before docs: `e3ca26e08892562e2a7ae887153c2b45355250c7`.

## Homepage Calculator / QuizForm Decision

Status: P1-06.2 homepage QuizForm compact refinement is DONE after visual + technical approval, merge to `main`, Production deployment and Production smoke.

Implemented product decision:

- The homepage calculator section keeps its existing visual design and composition: label/heading/copy on the left, QuizForm on the right.
- Homepage now reuses approved `QuizForm presentation="compact"` instead of the larger default form presentation.
- The change removes unnecessary empty height inside the homepage QuizForm so question, answers and controls read as one gathered flow.
- QuizForm business logic is unchanged: steps, validation, API submission and analytics events were not changed.
- `/tseny` was not changed in P1-06.2 and its pricing landing compact QuizForm regression passed.
- Mobile 360/390/430 was checked; fixed mobile CTA does not cover homepage QuizForm controls after scrolling.

Approved homepage calculator copy:

Paragraph 1:

`Ответьте на 6 вопросов — этого достаточно, чтобы понять, что вам нужно, и вернуться к вам с понятным ориентиром по цене.`

Paragraph 2:

`Уточним детали по телефону, чтобы вы могли сравнить варианты и спокойно принять решение.`

P1-06.2 implementation commit: `ae739acbbf5854637ac234288730ef5196ba2ab6`.

P1-06.2 merge/main SHA before docs: `296157b27463df47c34ce6359614e9942836aa2c`.

## CityPage Calculator / QuizForm Decision

Status: P1-06.3 CityPage calculator compact parity is DONE after visual + architecture approval, merge to `main`, Production deployment and Production smoke.

Implemented product decision:

- CityPage keeps one shared template for all city routes; there are no per-city calculator forks.
- The old full-width dark-green CityPage calculator treatment was replaced with a light homepage-like calculator composition.
- CityPage now uses `QuizForm presentation="compact"` with the approved two-paragraph explanatory copy.
- The city heading stays dynamic: `Рассчитайте стоимость забора в {city.namePrepositional}`.
- Lead context is preserved: `cityName={city.name}` keeps the city prefilled in the contact step, and `source={city-${city.slug}}` remains the CityPage source passed to lead submission.
- `QUIZ_TOTAL_STEPS` is the shared source of truth for the number of quiz steps. P1-06.3 centralized only the step-count source; it was not a broader QuizForm logic refactor.
- QuizForm validation, API submission and analytics events were not changed.
- Homepage and `/tseny` regression passed. ServicePage, `/kontakty` and blog QuizForm callsites were not redesigned in P1-06.3.

Approved CityPage calculator copy:

Paragraph 1:

`Ответьте на 6 вопросов — этого достаточно, чтобы понять, что вам нужно, и вернуться к вам с понятным ориентиром по цене.`

Paragraph 2:

`Уточним детали по телефону, чтобы вы могли сравнить варианты и спокойно принять решение.`

P1-06.3 implementation commit: `ea64bb8272fe0cd526a07d885b39beb749500ea6`.

P1-06.3 merge/main SHA before docs: `7643b7fedd38585040092a7054e75dc8cb10d68c`.

## Project Portfolio Foundation

Status: P1-03 project photos foundation is DONE after approved local visual/technical review, Preview build, merge to `main`, Production deployment and Production smoke.

P1-03.1 real project content is DONE after approved local visual review, Preview build, merge to `main`, Production deployment and Production smoke. It added 9 own real MasterZabor project objects above the existing 8 starter/demo records, so the portfolio dataset now contains 17 records.

P1-03.2 homepage real projects is DONE after approved local visual review, Preview build, merge to `main`, Production deployment and Production smoke. It changed homepage `featuredProjects` to show stronger real works while preserving the existing block design and keeping `/nashi-raboty` unchanged at 17 records.

Source of truth: `content/projects.ts`.

Implemented rules:

- `content/projects.ts` is the single source of truth for portfolio/project metadata.
- Project assets live in `public/images/projects/{project-id}/`.
- `ProjectCard` is reusable and data-driven; it must not hardcode city/category/material/project titles.
- `PortfolioGallery` filters the shared project dataset.
- Homepage "Наши работы" uses `featuredProjects` from the shared dataset.
- `/nashi-raboty` uses the full `projects` array from the same dataset.
- Portfolio cards use real optimized WebP photos, not generated/data SVG placeholders.
- Category + city badges are data-driven from project records.
- Project `city` metadata is `{ slug, name, oblast }`, which prepares future reuse for city filtering/pages.
- `serviceSlug` is optional. It is used when a portfolio card should show `Подробнее` and route to a matching service page.
- P1-03.2 product decision: 3D/Gitter records keep category/categoryLabel `3D-сетка`, but can use `serviceSlug: "zabory-iz-setki-rabitsy"` for the CTA because the current site has no separate 3D ServicePage and the user prefers a route instead of a missing button. This is an intentional combined routing decision, not a claim that the category is сетка-рабица.
- ServicePage and CityPage integration with project records was deliberately kept out of P1-03 scope.
- P1-05.1 later integrated CityPage with confirmed real project records while excluding starter/demo records from truthful city proof.

Current project fields:

- Required: `id`, `title`, `category`, `categoryLabel`, `city`, `description`, `mainPhoto`.
- Optional: `material`, `length`, `height`, `priceRange`, `completedAt`, `photos`, `review`, `isFeatured`.
- Optional service mapping: `serviceSlug`, used only when the project has a truthful matching service page.

Current first 9 portfolio records are own real MasterZabor objects from P1-03.1. The older 8 starter/demo records remain below them and should be gradually replaced or expanded as more confirmed real MasterZabor projects are prepared. Future updates should be simple data/file changes: add optimized production images under `public/images/projects/{project-id}/`, then add or update a record in `content/projects.ts`.

P1-03.1 current first 9 order on `/nashi-raboty`:

1. Евроштакетник на бетонном основании - Слоним.
2. Сетка-рабица с калиткой из евроштакетника - Поставы.
3. Графитовый евроштакетник с калиткой и цоколем - Новогрудок.
4. Ограждение из 3D-сетки для участка - Щучин.
5. Ограждение из 3D-сетки с калиткой - Островец.
6. Зелёный профнастил в металлической окантовке - Глубокое.
7. Графитовый профнастил с калиткой - Лепель.
8. Двухсторонний евроштакетник для частного участка - Ошмяны.
9. Комбинированный забор с бетонным основанием - Сморгонь.

Homepage `featuredProjects` was intentionally not changed in P1-03.1; selecting the strongest new real projects for homepage remains a separate product decision.

P1-03.2 homepage featured selection:

1. Евроштакетник на бетонном основании - Слоним - Евроштакетник.
2. Сетка-рабица с калиткой из евроштакетника - Поставы - Сетка-рабица.
3. Графитовый евроштакетник с калиткой и цоколем - Новогрудок - Евроштакетник.
4. Ограждение из 3D-сетки с калиткой - Островец - 3D-сетка; CTA routes to `/zabory-iz-setki-rabitsy`.
5. Графитовый профнастил с калиткой - Лепель - Профнастил.
6. Откатные ворота для въездной группы - Новополоцк - Ворота.

P1-03.2 change rules:

- Change only the `featuredProjects` data selection through `content/projects.ts`; do not redesign the homepage block.
- Keep `/nashi-raboty` at 17 cards and preserve the existing full portfolio order.
- Keep `ProjectCard` reusable and data-driven; do not hardcode homepage-only titles, cities or categories in the component.
- Keep one old gate project in homepage featured to preserve visual/category variety.
- `app/nashi-raboty/page.tsx` may keep the small `max-w-5xl` intro width adjustment so the desktop H1 does not wrap "заборов" too early.
- P1-03.2 is now production baseline; future homepage featured changes should still be data-only unless the user explicitly asks for redesign.

Future real-project expansion workflow:

`source folder реальных работ -> read-only inventory -> group photos by object -> choose main/gallery photos -> determine serviceSlug -> prepare project metadata -> optimize production WebP -> public/images/projects/{project-id}/ -> add/update content/projects.ts -> visual check homepage and /nashi-raboty`.

Important future rules:

- One real job equals one project record.
- Several photos of the same object stay in one project gallery; do not turn them into separate projects.
- Do not commit large original source photos unless there is a separate reason.
- Commit optimized production assets.
- Do not redesign `ProjectCard` or portfolio architecture for each new object.
- Real confirmed projects should gradually replace or expand the current starter/demo records.
- Homepage should select the strongest `featuredProjects`; `/nashi-raboty` can contain the fuller set.
- Use known real cities and metadata when confirmed.
- Do not start bulk photo processing before a separate read-only inventory of the new source folder.

## Service Photo Source Map

Verified on 2026-08-26 against `content/services.ts`, `public/images/services/*` production assets and local source folders under `C:\DiscD\проекты сайта\Фото типов забора\...`.

Reusable workflow: `local source folder -> selected hero/gallery sources -> optimized production WebP -> content/services.ts -> localhost visual approval -> production`.

General rules:

- Service photo assets live in `public/images/services/{slug}/`.
- Source PNG/JPEG files stay outside repo unless there is a separate reason to commit them.
- Production assets committed to repo should be optimized WebP copies.
- `content/services.ts` is the source of truth linking service hero/gallery assets to pages.
- Desktop ServicePage hero stays `480x480`, `rounded-3xl`, `overflow-hidden`, `next/image fill`, `object-cover`.
- If a wide source works with `480x480 object-cover`, use it. If important elements are cut off, prefer a composition prepared for 1:1 instead of changing the shared layout.
- Per-service `objectPosition` is allowed when needed, but should stay data-driven.

### `/zabory-iz-evroshtaketnika`

Source folder: `C:\DiscD\проекты сайта\Фото типов забора\ЕВРОШТАКЕТНИК`.

Hero: `Запасная.jpg` -> `public/images/services/zabory-iz-evroshtaketnika/hero-page.webp` (`1200x1200`) -> hero. Object position: default/center. Note: selected after replacing the first hero candidate because the previous image duplicated the homepage service thumbnail too closely.

Gallery:

- `1.jpg` -> `gallery-01.webp` (`1200x900`) -> gallery.
- `2.jpg` -> `gallery-02.webp` (`1200x1200`) -> gallery.
- `3.jpg` -> `gallery-03.webp` (`1200x900`) -> gallery.
- `4.jpg` -> `gallery-04.webp` (`1200x553`) -> gallery.
- `5.jpg` -> `gallery-05.webp` (`1200x900`) -> gallery.
- `6.jpg` -> `gallery-06.webp` (`1200x900`) -> gallery.

### `/zabory-iz-profnastila`

Source folder: `C:\DiscD\проекты сайта\Фото типов забора\ПРОФНАСТИЛ`.

Hero: `Главная-2.png` -> `public/images/services/zabory-iz-profnastila/hero-page.webp` (`1200x800`) -> hero. Object position: default/center.

Gallery:

- `1.jpg` -> `gallery-01.webp` (`1200x900`) -> gallery.
- `2.jpg` -> `gallery-02.webp` (`1200x674`) -> gallery.
- `3.jpeg` -> `gallery-03.webp` (`1000x750`) -> gallery.
- `4.jpeg` -> `gallery-04.webp` (`1000x750`) -> gallery.
- `5.jpeg` -> `gallery-05.webp` (`1000x750`) -> gallery.
- `6.jpg` -> `gallery-06.webp` (`769x577`) -> gallery.

### `/zabory-iz-setki-rabitsy`

Source folder: `C:\DiscD\проекты сайта\Фото типов забора\СЕТКА-РАБИЦА`.

Hero: `5(новый с хорошим качетсвом).png` -> `public/images/services/zabory-iz-setki-rabitsy/hero-page-new.webp` (`1200x675`) -> hero. Object position: default/center. Note: older low-quality `5` source and `Главная для заставки.jpeg` are not production hero assets.

Gallery:

- `1.webp` -> `gallery-01.webp` (`1024x768`) -> gallery.
- `2.jpg` -> `gallery-02.webp` (`1200x900`) -> gallery.
- `3.jpg` -> `gallery-03.webp` (`1200x800`) -> gallery.
- `4.jpg` -> `gallery-04.webp` (`1200x678`) -> gallery.
- `6.png` -> `gallery-05.webp` (`1200x800`) -> gallery.
- `7.png` -> `gallery-06.webp` (`1200x800`) -> gallery.

### `/vorota-raspashnye`

Source folder: `C:\DiscD\проекты сайта\Фото типов забора\ВОРОТА РАСПАШНЫЕ`.

Hero: `Главная квадратная hero.png` -> `public/images/services/vorota-raspashnye/hero-page-square-new.webp` (`1200x1200`) -> hero. Object position: center. Note: FIT/WIDE preview variants were explored but are not the production solution; final hero uses a composition prepared for standard square ServicePage hero.

Gallery:

- `4.jpg` -> `gallery-01.webp` (`1200x552`) -> gallery.
- `2.jpg` -> `gallery-02.webp` (`1200x900`) -> gallery.
- `1.jpg` -> `gallery-03.webp` (`1024x768`) -> gallery.
- `6.jpg` -> `gallery-04.webp` (`1200x900`) -> gallery.
- `3.jpg` -> `gallery-05.webp` (`1200x900`) -> gallery.
- `5.jpg` -> `gallery-06.webp` (`885x1180`) -> gallery.

### `/vorota-otkatnye`

Source folder: `C:\DiscD\проекты сайта\Фото типов забора\ВОРОТА ОТКАТНЫЕ`.

Hero: `Главная квадратная hero.png` -> `public/images/services/vorota-otkatnye/hero-page-square-new.webp` (`1200x1200`) -> hero. Object position: center. Note: original `Главная.png` was tested first, but in standard square hero it cut off important gate/pillar context; the square source is the approved production hero.

Gallery:

- `1.jpeg` -> `gallery-01.webp` (`1000x450`) -> gallery.
- `2.jpeg` -> `gallery-02.webp` (`1000x450`) -> gallery.
- `3.jpeg` -> `gallery-03.webp` (`1000x692`) -> gallery.
- `4.jpg` -> `gallery-04.webp` (`1200x800`) -> gallery.
- `5.jpg` -> `gallery-05.webp` (`1200x800`) -> gallery.
- `6.jpg` -> `gallery-06.webp` (`1200x800`) -> gallery.

### `/kalitki`

Status: visually approved real-photo ServicePage.

Hero source folder: `C:\DiscD\проекты сайта\Фото типов забора\КАЛИТКИ`.

Hero: `главная.png` -> `public/images/services/kalitki/hero-page.webp` (`1200x900`) -> hero. Object position: center.

Gallery source folder: `C:\DiscD\проекты сайта\Фото типов забора\КАЛИТКИ\новый формат не обрезанный`.

Note: this gallery set was prepared with extra space around the wicket so `/kalitki` can return to the standard ServicePage gallery layout: fixed wide cards, `object-cover`, centered crop, no `contain` fields. Early `contain` / portrait-aware previews were removed after the final wide sources worked in the standard gallery. Confirmed rule from `/kalitki`: when a standard gallery card is about 1.73:1 and uses `object-cover`, vertical or 4:3 sources can crop the object too aggressively; for gate/wicket photos, prefer a wide source close to 16:9 with the full object kept inside a safe zone.

Gallery:

- `gallery-new-01-профнастил-коричневый.png` -> `gallery-01.webp` (`1200x675`) -> gallery.
- `gallery-new-02-евроштакетник-серый.png` -> `gallery-02.webp` (`1200x800`) -> gallery.
- `gallery-new-03-3dsetka-zelenaya.png` -> `gallery-03.webp` (`1200x675`) -> gallery.
- `gallery-new-04-profnastil-antratsit-zakrytaya.png` -> `gallery-04.webp` (`1200x675`) -> gallery.
- `gallery-new-05-profnastil-iznutri-kozyrek.png` -> `gallery-05.webp` (`1200x675`) -> gallery.
- `gallery-new-06-evroshtaketnik-korichneviy.png` -> `gallery-06.webp` (`1000x750`) -> gallery.

Unverified source filenames: none for the six completed ServicePage sets based on current repository, local source folders and task decisions. The mapping is kept here as operational documentation because optimized WebP files do not embed their original local source path.

## Remaining Frontend / Mobile / CRO Notes

- Floating CTA behavior: on homepage it should not cover the first viewport because header phone and hero CTAs are already visible; on deeper pages it can stay visible immediately as a conversion shortcut.
- `QuizForm` основной канал заявок; keep default behavior stable and use `presentation="compact"` only where explicitly chosen by the page/section. Current intentional compact callsites are homepage `/`, `/tseny` and CityPage.
- QuizForm usage map after P1-06.3:
  - Homepage `/`: `presentation="compact"`, source `home-quiz`, surrounding copy depends on `QUIZ_TOTAL_STEPS`.
  - `/tseny`: `presentation="compact"`, source `prices-page`, surrounding copy does not use a literal step count.
  - CityPage / all city routes: `presentation="compact"`, source `city-${city.slug}`, `cityName={city.name}`, surrounding copy depends on `QUIZ_TOTAL_STEPS`.
  - ServicePage / all 6 service routes: default presentation, source `service-${slug}`, service defaults preserved.
  - `/kontakty`: default presentation, source `contacts-page`.
  - Blog posts: default presentation, source `blog-post-${post.slug}`.
- If QuizForm ever changes from 6 to 7+ steps, check `QUIZ_TOTAL_STEPS`, QuizForm progress/validation/contact-step threshold, homepage copy, CityPage copy, all callsites and surrounding marketing copy.
- Future content task: audit remaining default QuizForm surrounding copy in ServicePage, `/kontakty` and blog, especially old "за 5 минут" wording. This was intentionally not changed in P1-06.3.
- `LeadForm` остаётся хорошим быстрым fallback.
- Portfolio/reviews требуют реальных доказательств: фото, город, материал, срок, диапазон цены, внешний отзыв.
- Placeholder graphics нельзя считать production portfolio.
- `/tseny` no longer depends on wide horizontal-scroll price tables for core UX after P1-06.1; future pricing changes should preserve the mobile-first card/landing approach.

## Performance Notes

- `next/font` для Inter - правильное решение.
- GA/Yandex scripts подключены `afterInteractive`.
- `Image` используется, но `fill` images требуют `sizes`.
- После добавления реальных фото проверить LCP.
- Large source PNG photos should be converted/optimized before committing to `public/`; P1-02.2 converted service thumbnails to ~170-340 KB JPEGs instead of committing multi-megabyte PNG copies.
- `next build` завис во время аудита и был остановлен; нужна отдельная диагностика.
- `next lint` deprecated; перед Next 16 заменить на ESLint CLI.
- Yandex Webvisor может ухудшить INP/TTI, проверять в Lighthouse/CrUX после запуска трафика.

## SEO Notes

- `www` как canonical host подтверждён историей и production.
- URL policy должна быть no-slash.
- Sitemap/canonical/OpenGraph/JSON-LD/internal links должны совпадать с final 200 URL.
- `SearchAction` удалить или реализовать поиск.
- Product Offer URL должен быть URL конкретной услуги.
- City pages требуют уникальных proof-assets, иначе doorway/thin risk.
- Blog должен перейти на MDX/CMS/data model перед ростом до 500+ статей.

## Target Architecture

### Keep

- Next.js App Router.
- Vercel.
- `www.masterzabor.by` as canonical/runtime host.
- Host redirect in `next.config.ts` is allowed only for closing the `masterzabor-site.vercel.app` duplicate surface; do not change canonical `www` strategy without a domain audit.
- `CityPage` and `ServicePage` templates.
- `SiteContainer`.
- Telegram and analytics reporting.

### Canonical URL Policy

- No trailing slash for all canonical URLs.
- `normalizePath()` / `canonicalUrl()` helper should be the single source for sitemap, metadata, breadcrumbs, JSON-LD and reports.
- Never point canonical to a redirecting URL.
- Never set webhook to apex while apex redirects to www.

### Content Model

Short term:

- `services`
- `cities`
- `blogPosts`
- `projects`

Future:

- MDX or CMS for `articles`.
- Structured `projects` for portfolio/case studies.
- Typed schema validation for content records.

### Project Entity

Fields:

- `id`
- `citySlug`
- `serviceSlug`
- `title`
- `material`
- `length`
- `height`
- `priceRange`
- `completedAt`
- `photos`
- `review`
- `isFeatured`

### Image Structure

- `public/images/projects/{project-id}/main.webp`
- `public/images/projects/{project-id}/before.webp`
- `public/images/projects/{project-id}/after.webp`
- `public/images/services/{service-slug}/hero.webp`
- `public/images/blog/{slug}/cover.webp`
- `public/images/og/...`

### Component System

Add or formalize:

- `Section`
- `SectionHeader`
- `Button`
- `PhoneLink`
- `MessengerLinks`
- `Breadcrumbs`
- `JsonLdScript`
- `ProjectCard`
- `ProjectGallery`
- `PriceTable` / `PriceCardsMobile`
- `FAQ`
- `RelatedLinks`

### Lead Pipeline Target

1. Validate request.
2. Assign `leadId`.
3. Atomically persist lead to `leads:v2:{date}` before Telegram delivery.
4. Send Telegram.
5. If Telegram fails, keep lead and mark status `telegram_failed`.
6. Retry/report delivery failures.
7. Return success once lead is safely stored.

### Analytics Event Taxonomy

- `click_call`
- `click_telegram`
- `click_whatsapp`
- `click_viber`
- `quiz_started`
- `quiz_step_3_reached`
- `quiz_contact_step_reached`

Current decision:

- Do not duplicate successful form/quiz submissions in analytics because lead storage and daily/monthly reports already count submitted заявки.
- Store contact/funnel counters in KV by day under `analytics-events:v1:{date}` and also send browser events to GA4/Yandex when configured.
- Keep event payload free of PII: event type, page path, source and UI location only.
- Daily Telegram `/report` shows conversion analytics in separated sections: daily contact clicks, month-to-date contact clicks, daily quiz funnel and month-to-date quiz funnel.
- Daily Telegram `/report` date labels omit the Russian `г.` suffix after years.

## Roadmap Summary

Critical now:

- Fix no-slash canonical/sitemap/internal/schema URL policy.
- After P0-01, run dedicated `P0-01.5 Next 16 / MCP readiness`.
- Close `masterzabor-site.vercel.app` duplicate surface.
- Make lead storage atomic.
- Fail-close cron/webhook secrets.
- Remove or implement `SearchAction`.
- Add image `sizes`.
- Keep lint/build/MCP checks in every stage to catch regressions.

Important:

- Real portfolio/project photos.
- Project content model.
- Contact click and quiz funnel events.
- Mobile layout/CRO cleanup: no page-level horizontal overflow, stable burger menu, safe-area-aware bottom CTA.
- Quiz "Не знаю длину".
- Product JSON-LD service URLs.
- Pin dependencies and replace `next lint`.
- Tests for sitemap/canonical/API.

Desirable:

- MDX/CMS for 500+ articles.
- Blog categories/clusters.
- Image sitemap.
- Case study pages.
- Mobile price cards.
- CRM/inbox for leads.

## Решения: оставить / улучшить / удалить / перепроектировать

Оставить:

- Next.js App Router.
- Static generation для текущего объёма страниц.
- `www` canonical host.
- Telegram как быстрый канал для лидов.
- `content/` как временно достаточную структуру для малого объёма.

Улучшить:

- URL/canonical builder.
- Sitemap generation.
- Lead delivery/storage.
- Analytics events.
- City/service content uniqueness.
- Real image pipeline.
- Design system tokens/components.

Удалить или заменить:

- Фальшивый `SearchAction`, если поиск не реализован.
- Placeholder visuals как production portfolio.
- `latest` dependency pins.
- `next lint` script после проверки текущей версии tooling.

Перепроектировать:

- Lead storage на атомарную модель.
- Reporting security.
- Content architecture для 500-1000 статей.
- Portfolio/image structure.
