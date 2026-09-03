# PROJECT ROADMAP TRACKER / HANDOFF: MASTERZABOR

Дата handoff: 2026-08-26
Проект: `masterzabor`  
Production: `https://www.masterzabor.by`  
Canonical host: `https://www.masterzabor.by`  
Текущая production точка отсчета: P1-03.2 completion commit `c7ef4da808c07c7479ffeec8039f13696d96e109`

Этот файл - единственный главный handoff/roadmap-документ для нового чата. Он фиксирует текущее состояние после последних P0/P1 этапов и уточняет, какие старые документы являются историей, а какие пункты еще актуальны.

Older prompts may still mention the removed root `PROJECT-ROADMAP-TRACKER.md`; treat that as an old path and read this file instead.

## CURRENT STATE

- Production сайт работает на `https://www.masterzabor.by`.
- Последний production implementation/content baseline: `c7ef4da808c07c7479ffeec8039f13696d96e109` (`feat(projects): feature real projects on homepage`).
- Apex `https://masterzabor.by` остается alias и редиректит на `www`.
- Next.js обновлен до `16.2.9`; React `19.2.7`.
- `npm run lint` использует `eslint .`.
- Next DevTools MCP доступен на running dev server через `nextjs_index` / `nextjs_call`.
- Canonical / sitemap / robots / OG / JSON-LD policy: `www` + no trailing slash.
- Telegram webhook: только `https://www.masterzabor.by/api/telegram-webhook`.
- Главная визуально сильно улучшена: brand mark, новая hero-фотография, 8 benefit cards, утвержденные benefit icons.
- Benefit icons на главной используют production assets из `public/icons/benefits/`.
- Выбран финальный размер benefit icons: `44x44` mobile, `52x52` `sm+ / desktop`.
- Service thumbnails на главной подключены из `public/images/services/<slug>/hero.jpeg`.
- Service pages получили общий photo/hero pattern: desktop hero image wrapper `480x480`, `rounded-3xl`, `overflow-hidden`, `next/image fill + object-cover`, data-driven hero/gallery config и fallback для services без реальных фото.
- `/zabory-iz-evroshtaketnika` - первый визуально утвержденный real-photo reference для ServicePage: hero/gallery подключены из `public/images/services/zabory-iz-evroshtaketnika/`.
- `/zabory-iz-profnastila` - второй визуально утвержденный real-photo ServicePage: hero/gallery подключены из `public/images/services/zabory-iz-profnastila/`.
- `/zabory-iz-setki-rabitsy` - третий визуально утвержденный real-photo ServicePage: hero/gallery подключены из `public/images/services/zabory-iz-setki-rabitsy/`.
- `/vorota-raspashnye` - четвертый визуально утвержденный real-photo ServicePage: hero/gallery подключены из `public/images/services/vorota-raspashnye/`.
- `/vorota-otkatnye` - пятый визуально утвержденный real-photo ServicePage: hero/gallery подключены из `public/images/services/vorota-otkatnye/`.
- `/kalitki` - шестой и последний визуально утвержденный real-photo ServicePage: hero/gallery подключены из `public/images/services/kalitki/`.
- ServicePage photo workflow confirmed on all six real categories: евроштакетник, профнастил, сетка-рабица, распашные ворота, откатные ворота and калитки.
- Standard service photo workflow: `source folder -> hero selection -> gallery selection -> optimize production copies -> update service data -> localhost desktop/mobile visual approval -> commit/push -> production smoke`.
- Do not redesign the shared ServicePage layout for each service; per-service changes should normally be limited to image assets, descriptive `alt`, and optional focal/object-position.
- For square ServicePage hero, a composition prepared for 1:1 is preferred when the full object must stay visible. Important elements should not sit on the very edges of the source image; normal photos are still fine when `480x480 object-cover` works visually.
- Service photo library is separate from the `content/projects.ts` portfolio/project model; homepage, `/nashi-raboty`, city pages and blog are not part of this workflow.
- Остаток после cleanup-попытки: `.tmp/` частично осталась как untracked локальная папка; Chrome держал lock-файлы. Это не production asset и не нужно коммитить.

## COMPLETED

- Базовый сайт на Next App Router: главная, услуги, города, цены, работы, отзывы, контакты, блог.
- 6 service pages.
- 40 city pages через `app/[city]/page.tsx` + `generateStaticParams`.
- Sitemap и robots.
- Metadata, OpenGraph, Twitter cards, JSON-LD.
- Lead API, QuizForm, LeadForm, phone validation.
- Telegram lead delivery, webhook commands, daily report, traffic report.
- Vercel KV для лидов и событий.
- GA4/Yandex client scripts и server-side reports.
- Production domain architecture stabilized on `www`.
- P0-01 canonical / sitemap / no-slash URL policy.
- P0-01.5 Next 16 / MCP readiness.
- P0-02 duplicate Vercel host redirect to canonical.
- P0-03 lead reliability + production secrets hardening.
- P0-04 build/lint/tooling diagnosis.
- P1-01 contact click + minimal quiz funnel analytics.
- P1-01.1 Telegram analytics report formatting.
- P1-02 mobile overflow / burger / CTA cleanup.
- P1-02.1 homepage mobile first-screen density.
- P1-02.2 brand visual foundation and benefit icons.
- P1-02.2 LARGE icon size selection and production deploy.

## AUDITS COMPLETED

- `AUDIT-MASTERZABOR-2026.md`: полный SEO/business/architecture/frontend/mobile/performance/CRO audit.
- `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md`: production host/domain/webhook audit; подтвердил `www` source of truth и историю redirect loop.
- `docs/AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md`: подтвердил, что domain/analytics architecture согласована на `www`; GA server warning связан с env/OAuth, не с доменом.
- `docs/ANALYTICS.md`: production runbook для Telegram/analytics/cron/env.
- `docs/GOOGLE-OAUTH-RECOVERY.md`: восстановление GA OAuth refresh token.

## FIXED ISSUES

- Slash canonical conflict: sitemap/canonical/OG/JSON-LD/internal links приведены к no-slash final URLs.
- Duplicate Vercel URL: `masterzabor-site.vercel.app` закрыт redirect на canonical host.
- Redirect loop risk: custom `www -> apex` redirects не используются; `next.config.ts` не должен возвращать host loop.
- Lead loss risk: новые заявки пишутся атомарно в KV list `leads:v2:{date}` и имеют delivery status.
- Production secret posture: stats/cron/webhook fail-closed in Vercel Production.
- Contact click analytics: call / Telegram / WhatsApp / Viber считаются.
- Minimal quiz funnel: started, 2+ steps, contact step reached.
- Telegram reports: daily/month sections по заявкам, контактным кликам, quiz funnel.
- Mobile header/menu: номер кликабельный, burger drawer справа, без page-level overflow.
- Homepage mobile density: true mobile viewport, компактный first screen, no forced desktop zoom.
- Homepage brand direction: fence+M mark, real-ish hero image, equal 8 benefit cards.
- Benefit icons: final approved asset set подключен через files, не через hand-drawn inline SVG.
- Benefit icon size: selected LARGE `44/52`.
- Portfolio foundation: P1-03 completed on branch `codex/P1-03-project-photos-foundation`; homepage "Наши работы" and `/nashi-raboty` now use real project photos from `content/projects.ts`.
- P1-03.1 real project content completed on branch `codex/P1-03.1-real-project-content`: added 9 own real MasterZabor objects above the existing 8 starter projects; `/nashi-raboty` now has 17 project records.
- P1-03.2 homepage real projects completed on branch `codex/P1-03.2-homepage-real-projects`: homepage "Наши работы" now features 5 stronger own real projects plus the retained old sliding-gate project.

## OPEN ISSUES

- P1-03.1 added the first 9 own real MasterZabor project records. The older 8 starter/demo records remain below them and should be gradually replaced or expanded as more confirmed real objects are prepared.
- `ServicePage` real-photo block завершен: все 6 service pages имеют утвержденные hero/gallery из production assets.
- `CityPage` hero и "Примеры работ" все еще используют `data:image/svg` placeholder-функцию.
- `content/blog-posts.ts` использует generated SVG covers.
- `generateWebsiteJsonLd()` все еще содержит `SearchAction`, но реального поиска нет.
- `generateProductJsonLd()` Offer `url` сейчас указывает на `SITE_URL`, не на конкретную service page.
- `/tseny`, `/kontakty`, `/otzyvy` визуально слабее главной: более простые hero/sections, меньше brand visual system.
- `/otzyvy` содержит текстовые отзывы без внешнего proof: Google/Yandex screenshots, ссылки, фото объекта, город/тип работ.
- City pages остаются templated и нуждаются в real local proof, иначе есть doorway/thin risk.
- Dependencies still use several `latest` ranges in `package.json` (`tailwindcss`, `eslint`, `typescript`, types). Not urgent, but hurts reproducibility.
- Known lint warning: `components/forms/QuizForm.tsx` React Hook Form `watch()` / React Compiler compatibility. Не blocker сейчас.
- `.tmp/` local scratch is ignored in `.gitignore`; if it contains Chrome lock files, do not force-delete while Chrome/processes are running.
- Root `PROJECT-ROADMAP-TRACKER.md` has been removed to avoid two competing roadmap sources; use `docs/PROJECT-ROADMAP-TRACKER.md`.

## REMAINING PAGES / UI WORK

- `/nashi-raboty`: P1-03 foundation and P1-03.1 first real-project content are complete. Дальше не redesign, а постепенное расширение/замена starter records собственными подтвержденными объектами MasterZabor.
- `/tseny`: рабочая, но простая. Не добавлять "Цены" в top nav без новой pricing strategy. Можно улучшить mobile price cards, пояснения "от чего зависит цена", CTA и ссылки на service pages.
- `/otzyvy`: рабочая, но слабая как trust page. Нужны реальные отзывы/скриншоты/источники/объекты, иначе выглядит generic.
- `/kontakty`: рабочая. Можно привести hero/card style к текущему brand direction, но не трогать webhook/domain.
- `/blog`: всего 3 статьи, covers placeholder SVG. Перед масштабированием нужен content model или хотя бы MDX/data decision.
- Blog articles: полезны как база, но нужны реальные изображения, категории, related links, обновление под 2026 SEO.
- City pages: композиция улучшена, но hero/examples используют placeholders. Нужны city-specific proof blocks.
- Service pages: P1-04 завершен; общий hero/gallery photo pattern утвержден на всех 6 услугах.
- Mobile: основные overflow/menu/CTA проблемы закрыты; следующие проверки делать после каждого визуального изменения на 360/390/430 px и iPhone safe-area.

## PHOTOS / CONTENT TO ADD

Source folders from user context:

- `C:\DiscD\проекты сайта\Фото типов забора\`
- user mentioned prepared folders with 5-7 photos per fence type and marked "главная".

Recommended production structure:

- `public/images/projects/{project-id}/main.webp`
- `public/images/projects/{project-id}/gallery-01.webp`
- `public/images/projects/{project-id}/gallery-02.webp`
- `public/images/services/{service-slug}/hero.webp`
- `public/images/blog/{slug}/cover.webp`

Recommended content model:

- `content/projects.ts`
- current P1-03/P1-03.1 fields: `id`, `title`, optional `serviceSlug`, `category`, `categoryLabel`, `city`, `description`, `mainPhoto`.
- optional fields: `material`, `length`, `height`, `priceRange`, `completedAt`, `photos`, `review`, `isFeatured`.
- `city` is data-driven as `{ slug, name, oblast }`, so future city filtering/pages can reuse the same project records.
- Homepage "Наши работы" uses `featuredProjects`; `/nashi-raboty` uses the full `projects` array; both render the same reusable `ProjectCard`.
- P1-03.2 keeps the homepage block layout/design unchanged and changes only `isFeatured` selection in `content/projects.ts`.
- Project assets are separate from the service photo library and live under `public/images/projects/{project-id}/`.
- Current first 9 project records are own real MasterZabor objects; the older 8 starter/demo records remain after them. Replace starter records with confirmed values as more real objects are added; do not hardcode city/category/material inside `ProjectCard`.
- 3D/Gitter projects stay visually labeled as portfolio category `3D-сетка`. In P1-03.2 they are allowed to use `serviceSlug: "zabory-iz-setki-rabitsy"` only as an intentional product routing decision for the `Подробнее` CTA; this does not create a separate 3D service page and does not rename the portfolio category.

Do not bulk-copy huge original photos. First optimize to WebP/JPEG, set useful `alt`, add `sizes`, verify LCP.

## SEO / ANALYTICS / PRODUCTION TASKS

- Keep canonical host `www.masterzabor.by`.
- Keep no-slash URL style.
- Keep sitemap/canonical/OG/JSON-LD aligned with final 200 URLs.
- Remove or implement `SearchAction`.
- Fix Product JSON-LD Offer URL to point to the service URL.
- After real photos, consider image sitemap.
- Check GA/Yandex production env if Telegram `/traffic_*` shows warning.
- Do not duplicate submitted form success as analytics event; lead stats already count заявки.
- Contact click and quiz funnel events are already live and should stay minimal.
- For every `git push origin main`, wait at least 40 seconds before production smoke.

## TECHNICAL DEBT

- Benefits icons true-vector migration: LOW priority cleanup only. Current `public/icons/benefits/*.svg` are SVG wrappers with embedded raster PNG. They are approved production visual source of truth. Future true-vector replacement must preserve look 1:1 and must not use `<image>`, base64, PNG/JPEG/WebP inside. If vector version looks worse, do not replace.
- Placeholder SVG helpers remain in `CityPage` and `content/blog-posts.ts`; portfolio cards and the six ServicePage galleries now use real photo assets.
- `SearchAction` without search.
- Product JSON-LD Offer URLs.
- Dependency ranges with `latest`.
- No automated regression tests for sitemap/canonical/API/phone utils.
- Local scratch `.tmp/` not ignored/cleaned yet due Chrome lock during deletion.

## DO NOT TOUCH / PRODUCTION CONSTRAINTS

- Do not change production domain architecture.
- Do not add `www -> apex` redirects.
- Do not move canonical from `www` to apex.
- Do not register Telegram webhook on apex.
- Do not route Telegram webhook through redirect.
- Do not change Vercel domain settings without a new domain audit.
- Do not change Telegram webhook/domain while doing UI/photo/content tasks.
- Do not rewrite stable analytics architecture without a real bug.
- Do not add "Цены" to header just because old audit mentioned it; user intentionally rejected this for now.
- Do not overwrite approved benefit icons or redraw them.
- Do not delete `_design-assets`; it is design reference/master fallback.
- Do not commit `.cursor/`, `.tmp/`, `.env.local`, `.next/`, local browser profiles.

## NEXT PRIORITIES

### P0 - обязательно

1. `P0-HOUSEKEEPING-local-temp-cleanup`
   - Что сделать: при желании закрыть локальные Chrome lock-процессы и удалить `.tmp/`.
   - Где: `.tmp/`, `.gitignore`.
   - Зачем: `.tmp/` уже ignored, но физическая папка может оставаться после browser checks.
   - Как проверить: `git status --short --branch` не показывает `.tmp/`; `npm run dev` не падает на `.tmp/chrome-*`.

2. `P0-JSONLD-fake-searchaction`
   - Что сделать: убрать `SearchAction` из WebSite JSON-LD или реализовать реальный поиск. Практичнее сейчас убрать.
   - Где: `lib/seo.ts` -> `generateWebsiteJsonLd()`.
   - Зачем: schema не должна заявлять несуществующую функцию.
   - Как проверить: production HTML JSON-LD не содержит `SearchAction`; homepage/blog status `200`; rich results/schema validator без fake search.

### P1 - этапы

1. `P1-03-project-photos-foundation`
   - Статус: DONE after approved local/Preview flow and Production smoke.
   - Что сделано: создан `content/projects.ts` как единый source of truth для portfolio/project metadata; добавлены reusable `ProjectCard` и `PortfolioGallery` от общего project dataset; реальные portfolio photos подключены к homepage "Наши работы" и `/nashi-raboty`.
   - Где: `content/projects.ts`, `components/portfolio/`, `app/page.tsx`, `app/nashi-raboty/page.tsx`, `public/images/projects/`.
   - Зачем: закрыт главный trust/CRO/SEO пробел - вместо generated/data SVG portfolio placeholders появились реальные фото работ.
   - Как проверить: нет `data:image/svg` в portfolio cards; реальные изображения 200; alt описательные; desktop/mobile grid без overflow; `/nashi-raboty` больше не пишет "фото-заглушки"; category + city badges data-driven; filters work.
   - Rules: project metadata не hardcoded внутри `ProjectCard`; city metadata подготовлена для future reuse/filtering; current starter records can use demo/starter city metadata until confirmed real project data replaces it.
   - Scope: ServicePage/CityPage integration deliberately not done in P1-03.

2. `P1-03.1-real-project-content`
   - Статус: DONE after approved local visual review, Preview build, merge to `main`, Production deployment and Production smoke.
   - Что сделано: добавлены 9 собственных реальных объектов MasterZabor в общий portfolio dataset; всего в `content/projects.ts` стало 17 records.
   - Где: `content/projects.ts`, `components/portfolio/ProjectCard.tsx`, `public/images/projects/real-*/`.
   - Порядок: новые 9 объектов идут выше старых 8 starter/demo projects.
   - Homepage: `featuredProjects` намеренно не изменен; выбор новых featured projects остается отдельным решением.
   - 3D/Gitter: на момент P1-03.1 хранился как portfolio-only category `3D-сетка` без `serviceSlug`; P1-03.2 позже добавил intentional CTA routing на `/zabory-iz-setki-rabitsy`.
   - Как проверить: `/nashi-raboty` 200; 17 cards; filters: `Профнастил` 4, `Евроштакетник` 6, `Сетка-рабица` 2, `3D-сетка` 2; images not broken; mobile 390 no overflow; UI не содержит `сварное`, `сварные секции`, `3D-секционное`.
   - Scope: не менять homepage featured, ServicePage, CityPage, domain/canonical, analytics, Telegram.

3. `P1-03.2-homepage-real-projects`
   - Статус: DONE after approved local visual review, Preview build, merge to `main`, Production deployment and Production smoke.
   - Что сделано: homepage block "Наши работы" теперь выбирает 6 утвержденных `featuredProjects` из существующего общего dataset без изменения `ProjectCard`, grid/layout, размеров карточек, typography, spacing или `/nashi-raboty` order.
   - Где: `content/projects.ts` controls the homepage featured selection; `app/nashi-raboty/page.tsx` has a narrow header-width adjustment so the desktop H1 does not wrap the word "заборов" too early.
   - Зачем: homepage proof block should show stronger own real works from P1-03.1 while preserving one old gate card for category variety.
   - Homepage selection: `Евроштакетник на бетонном основании` (Слоним), `Сетка-рабица с калиткой из евроштакетника` (Поставы), `Графитовый евроштакетник с калиткой и цоколем` (Новогрудок), `Ограждение из 3D-сетки с калиткой` (Островец), `Графитовый профнастил с калиткой` (Лепель), `Откатные ворота для въездной группы` (Новополоцк).
   - 3D/Gitter routing: category badge remains `3D-сетка`; `Подробнее` may route to `/zabory-iz-setki-rabitsy` as an approved combined service path for now. Do not create a new 3D ServicePage in this stage.
   - Как проверить: `/` 200; homepage "Наши работы" has exactly 6 cards in the approved order; `/nashi-raboty` still has 17 cards and existing order; filters unchanged; broken images 0; mobile 390 no horizontal overflow; Preview URL may be blocked by Vercel Deployment Protection/SSO.
   - Scope: do not change `main`, Production, homepage layout/design, `ProjectCard`, service galleries, CityPage, domain/canonical, analytics or Telegram without separate approval.

4. `P1-04-service-page-real-gallery`
   - Статус: DONE. Общий ServicePage photo system подтвержден на всех шести категориях; `/zabory-iz-evroshtaketnika`, `/zabory-iz-profnastila`, `/zabory-iz-setki-rabitsy`, `/vorota-raspashnye`, `/vorota-otkatnye` и `/kalitki` заполнены реальными hero/gallery и визуально утверждены.
   - Что сделано: заменены `ServicePage` hero/gallery placeholders на реальные service photos с сохранением общего layout.
   - Где: `components/templates/ServicePage.tsx`, `content/services.ts`, `public/images/services/`.
   - Зачем: service pages уже хорошие по структуре, но placeholder gallery снижает доверие.
   - Как проверить: 6 service pages отдают 200; images not broken; `next/image` имеет адекватные `sizes`; mobile no overflow.
   - Workflow: `source folder -> hero selection -> gallery -> optimization -> service data -> localhost -> desktop/mobile visual approval -> commit/push/production`.
   - Scope: не трогать homepage, `/nashi-raboty`, city pages, blog, domain/canonical, analytics, Telegram; не создавать `content/projects.ts` в рамках service-photo tasks.
   - Примечание: не смешивать с P1-03 project dataset; service photo library and project portfolio library stay separate.

5. `P1-05-city-proof-blocks`
   - Что сделать: добавить на city pages блоки реальных работ/объектов по региону или fallback "работы по Беларуси", без выдуманных фактов.
   - Где: `components/templates/CityPage.tsx`, `content/projects.ts`, `content/cities.ts`.
   - Зачем: снизить doorway/thin risk и повысить доверие на городских страницах.
   - Как проверить: выбранные `/gomel`, `/minsk`, `/brest`, `/vitebsk` показывают реальные/релевантные proof cards; JSON/canonical не ломаются.

6. `P1-06-commercial-pages-visual-polish`
   - Что сделать: привести `/tseny`, `/otzyvy`, `/kontakty` к визуальному уровню главной: brand hero, аккуратные секции, реальные proof blocks.
   - Где: `app/tseny/page.tsx`, `app/otzyvy/page.tsx`, `app/kontakty/page.tsx`.
   - Зачем: эти страницы рабочие, но выглядят проще и менее убедительно.
   - Как проверить: mobile/desktop screenshots, no overflow, CTA visible, contact links tracked, status `200`.

7. `P1-07-product-jsonld-offer-urls`
   - Что сделать: Product JSON-LD Offer `url` привязать к конкретной service page, не к homepage.
   - Где: `lib/seo.ts`, `components/templates/ServicePage.tsx`, `app/tseny/page.tsx`.
   - Зачем: schema должна быть точнее для поисковиков.
   - Как проверить: JSON-LD на `/zabory-iz-profnastila` содержит Offer URL этой страницы; no redirect URL.

### P2 - улучшения позже

1. `P2-blog-content-system`
   - Что сделать: выбрать MDX/CMS/data-source для роста блога, категории и related content.
   - Где: `content/blog-posts.ts`, `app/blog/*`.
   - Зачем: текущие 3 TS-string статьи не масштабируются до 500+.
   - Как проверить: новые статьи добавляются без копирования page code; sitemap обновляется.

2. `P2-image-sitemap-and-performance`
   - Что сделать: после реальных фото добавить image sitemap и Lighthouse checks.
   - Где: `app/sitemap.ts` или отдельный sitemap route, images.
   - Зачем: фото работ могут дать SEO и ухудшить LCP, нужно контролировать оба.
   - Как проверить: Lighthouse mobile, image URLs 200, sitemap valid.

3. `P2-true-vector-benefits-icons`
   - Что сделать: заменить embedded-raster SVG wrappers на true vector SVG.
   - Где: `public/icons/benefits/`.
   - Зачем: техническая чистота и меньший вес.
   - Как проверить: visual diff 1:1 с текущими icons; no `<image>`/base64 inside.

4. `P2-regression-tests`
   - Что сделать: добавить минимальные tests/scripts для sitemap/canonical/API/phone utils.
   - Где: `scripts/`, possibly test setup.
   - Зачем: ловить SEO/API regressions до production.
   - Как проверить: one command runs checks and fails on redirecting sitemap/canonical URLs.

5. `P2-dependency-pin-cleanup`
   - Что сделать: заменить оставшиеся `latest` на pinned versions after controlled install.
   - Где: `package.json`, `package-lock.json`.
   - Зачем: воспроизводимость.
   - Как проверить: clean install, lint/build pass.

## DOC DRIFT CHECK

- `docs/PROGRESS.md`: historical log useful, but not current source of truth. Contains stale checkboxes and older "Next 15" history. Treat as archive.
- `docs/PLAN.MD.md`: original build plan useful for context, but current project has moved beyond it. Contains checklist items that are partially outdated by P0/P1 fixes.
- `AUDIT-MASTERZABOR-2026.md`: valuable audit, but several P0/P1 findings are now fixed. Still current for real photos, SearchAction, Product Offer URL, city thin risk, blog scale, tests.
- `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md`: domain strategy remains valid. Some "docs drift" notes are historical because docs were later synchronized.
- `docs/AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md`: still valid for GA server env/OAuth warning diagnosis.
- `PROJECT-KNOWLEDGE-BASE.md`: mostly current, but benefit icon size line still may mention old `32/40`; new selected size is `44/52`.
- Root `PROJECT-ROADMAP-TRACKER.md`: removed. Source of truth is `docs/PROJECT-ROADMAP-TRACKER.md`.
