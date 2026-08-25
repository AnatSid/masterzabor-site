# PROJECT KNOWLEDGE BASE: MASTERZABOR

Дата начала базы знаний: 2026-06-03  
Проект: `masterzabor`  
Production: https://www.masterzabor.by

## Рабочие файлы проекта

- `docs/PROJECT-ROADMAP-TRACKER.md` - текущие этапы исправлений, статусы, порядок работы и инструкция для нового чата. Это единственный roadmap source of truth.
- `PROJECT-KNOWLEDGE-BASE.md` - архитектурная память проекта.
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
- Header intentionally does not add a separate `Цены` item for now: pricing is variable by city, length, height and fence type, while service pages already show `от ... BYN/м.п.` ориентиры.
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
- `components/portfolio/` - portfolio filter/gallery.
- `content/` - 40 cities, 6 services, 3 posts.
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
- `ProductCard`
- `PortfolioGallery`

Usage and risks:

- `Header`: global navigation, phone and messengers. Do not add `Цены` as a quick header item without a separate pricing strategy.
- `Footer`: has full nav including prices/blog/reviews, better coverage than header.
- `FloatingButtons`: mobile conversion layer for calls and messengers.
- `SiteContainer`: good shared layout primitive; should continue expanding to all sections.
- `ServicePage`: good shared service template; has Product/FAQ/Breadcrumb JSON-LD and approved real-photo system. Desktop hero pattern is `480x480`, `rounded-3xl`, `overflow-hidden`, `next/image fill + object-cover`; services without real photo config still use placeholders as fallback.
- `CityPage`: good city template; unique city text is generated from city data; doorway/thin risk remains if no real city proof.
- `QuizForm`: main conversion form; good qualification flow, but multi-step friction on mobile.
- `LeadForm`: simpler fallback form on homepage.
- `PortfolioGallery`: useful client filter, but current items are generated placeholder images.

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
- Главный CRO-риск: placeholder-изображения вместо реальных работ.
- Главный scale-риск: city pages могут стать doorway/thin pages при расширении без уникального контента.

## Frontend / Mobile / CRO Notes

- Header глобальный; `Цены` не добавлять в быстрый nav без отдельной pricing strategy, потому что цена зависит от параметров объекта.
- Mobile bottom CTA уже есть; body/bottom CTA должны учитывать `safe-area-inset-bottom`, чтобы не перекрывать контент на iPhone.
- Мобильный phone+burger должен помещаться на 320-430 px без горизонтального overflow; номер телефона должен оставаться кликабельным и не переноситься абы как.
- Mobile burger menu: компактный правый drawer, открывается только по нажатию, не рендерит offscreen-панель в закрытом состоянии, не сдвигает страницу и не оставляет пустой full-screen overlay. Внутри меню телефон отдельной full-width строкой, мессенджеры строкой ниже.
- Homepage mobile density: do not emulate Pixel by forcing a desktop/zoomed-out viewport. Pixel can look denser when Chrome uses a wider effective viewport; iPhone/Safari exposes the real mobile layout. Correct approach is true responsive CSS: compact hero spacing/type, concise trust facts, a normal vertical service list, and delayed homepage floating CTA until scroll.
- Brand visual direction after P1-02.2: use the green/white fence+M mark from `C:\DiscD\проекты сайта\Фото типов забора\Иконки-Логотип.png` as the source of truth for brand icon/favicon/app icons. Do not return to generic circle/photo logos or plain letter marks.
- Brand assets live in `public/brand/`; public favicon/app icon compatibility paths still exist at the root (`favicon.ico`, `icon-192.png`, `apple-touch-icon.png`, etc.).
- Homepage visual system should stay in the green fence reference direction: dark green + white + light neutral sections, restrained lime accents, line icons, subtle fence/mark patterns, real fence photos when available.
- Homepage proof/benefit system after P1-02.2: duplicate top dark-green stats strip was removed; use 8 equal practical ordering benefit cards (`С 2015 года`, рассрочка, доставка, быстрый расчёт, свои бригады, договор/смета, подбор под участок, гарантия на материалы и монтаж). User visually approved the final benefit icon design for production.
- Benefit icon assets after P1-02.2: production files live in `public/icons/benefits/` as `experience.svg`, `installment.svg`, `delivery.svg`, `phone.svg`, `crew.svg`, `contract.svg`, `selection.svg`, `warranty.svg`. `BrandLineIcon` loads these files and keeps the existing visual size: `32x32` on mobile and `40x40` on `sm+`. The current files are intentional temporary SVG wrappers with embedded raster graphics to preserve the approved look; future true-vector SVG migration is cleanup, not a blocker. Original design/master files stay under `_design-assets/`.
- Product/service thumbnails on homepage use optimized JPEGs under `public/images/services/<slug>/hero.jpeg` and are wired through `content/services.ts` as `imageSrc`.
- Homepage hero image source after P1-02.2: `C:\DiscD\проекты сайта\Фото типов забора\Исходник с логотипом.png`, optimized into `public/images/hero/homepage-fence-with-logo.jpeg`; keep it as visual-only background while the hero H1/text stays real HTML for SEO and accessibility.
- ServicePage photo workflow after evroshtaketnik/profnastil/rabitsa/raspashnye/otkatnye approval: add real service photos one category at a time using `source folder -> hero selection -> gallery -> optimization -> service data -> localhost -> desktop/mobile visual approval -> commit/push/production`. Do not redesign the shared layout per service; tune only image assets, human `alt`, and optional focal/object-position.
- `/zabory-iz-evroshtaketnika` is the first approved real-photo ServicePage reference; `/zabory-iz-profnastila` is the second; `/zabory-iz-setki-rabitsy` is the third; `/vorota-raspashnye` is the fourth; `/vorota-otkatnye` is the fifth. Homepage, `/nashi-raboty`, city pages and blog are outside this service-photo workflow.
- For square ServicePage hero, prefer a source composition prepared for 1:1 when the full object must stay visible. Keep important visual elements away from the source image edges; ordinary photos are still acceptable when `480x480 object-cover` looks good.
- Service photo assets live in `public/images/services/{slug}/`. Large local PNG/JPEG sources do not need to be stored in repo; commit optimized production WebP copies. `content/services.ts` is the linking layer for hero/gallery assets.
- P1-03 should build a proper portfolio/project model on top of this, not replace these service thumbnails with ad hoc placeholder SVGs.

## Service Photo Source Map

Verified on 2026-08-25 against `content/services.ts`, `public/images/services/*` production assets and local source folders under `C:\DiscD\проекты сайта\Фото типов забора\...`.

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
- `QuizForm` основной канал заявок; добавить "Не знаю длину" и analytics по шагам.
- `LeadForm` остаётся хорошим быстрым fallback.
- Portfolio/reviews требуют реальных доказательств: фото, город, материал, срок, диапазон цены, внешний отзыв.
- Placeholder graphics нельзя считать production portfolio.
- Для таблиц цен на mobile лучше card view или явный горизонтальный scroll.

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
