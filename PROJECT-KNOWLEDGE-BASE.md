# PROJECT KNOWLEDGE BASE: MASTERZABOR

Дата начала базы знаний: 2026-06-03  
Проект: `masterzabor`  
Production: https://www.masterzabor.by

## Рабочие файлы проекта

- `PROJECT-ROADMAP-TRACKER.md` - текущие этапы исправлений, статусы, порядок работы и инструкция для нового чата.
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
- Header не содержит явный пункт `Цены` в основной навигации.
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

- `Header`: global navigation, phone and messengers. Missing `Цены` in main nav.
- `Footer`: has full nav including prices/blog/reviews, better coverage than header.
- `FloatingButtons`: mobile conversion layer for calls and messengers.
- `SiteContainer`: good shared layout primitive; should continue expanding to all sections.
- `ServicePage`: good service template; has Product/FAQ/Breadcrumb JSON-LD; uses placeholder images.
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

- Header глобальный, но его nav беднее footer: добавить `Цены`, возможно `Отзывы` и `Блог`.
- Mobile bottom CTA уже есть и body имеет `pb-20`, чтобы не перекрывать контент.
- Мобильный phone+burger может быть тесным на малых ширинах.
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
- Header `Цены`.
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
