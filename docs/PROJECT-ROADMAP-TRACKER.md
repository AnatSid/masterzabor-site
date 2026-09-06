# PROJECT ROADMAP TRACKER / HANDOFF: MASTERZABOR

Дата handoff: 2026-08-26
Проект: `masterzabor`  
Production: `https://www.masterzabor.by`  
Canonical host: `https://www.masterzabor.by`  
Текущая production точка отсчета: P1-06.5 implementation/main merge SHA `d2d838f4eab4f3891349daf4a15296fdc0fb827e`

Этот файл - единственный главный handoff/roadmap-документ для нового чата. Он фиксирует текущее состояние после последних P0/P1 этапов и уточняет, какие старые документы являются историей, а какие пункты еще актуальны.

Older prompts may still mention the removed root `PROJECT-ROADMAP-TRACKER.md`; treat that as an old path and read this file instead.

## CURRENT STATE

- Production сайт работает на `https://www.masterzabor.by`.
- Последний production implementation/content baseline: `d2d838f4eab4f3891349daf4a15296fdc0fb827e` (`Merge P1-06.5 nationwide copy cleanup`).
- Apex `https://masterzabor.by` остается alias и редиректит на `www`.
- Next.js обновлен до `16.2.9`; React `19.2.7`.
- `npm run lint` использует `eslint .`.
- Next DevTools MCP доступен на running dev server через `nextjs_index` / `nextjs_call`.
- Root `AGENTS.md` создан в TOOLING-01 и является постоянным Codex project-level operating contract.
- Current Codex tooling baseline: Next DevTools MCP, Browser/CUA, screenshots, terminal/git/curl, Node tooling, Vercel CLI, plus relevant existing Skills only when needed.
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
- CityPage visual parity foundation is complete after P1-05.1: all 40 city pages still use one universal `app/[city]/page.tsx -> components/templates/CityPage.tsx -> content/cities.ts` route/template, now with the homepage hero photo, real service images, shared 8-card `BenefitTrustSection`, and real `ProjectCard` proof.
- City proof behavior is deterministic: confirmed `content/projects.ts` records whose `id` starts with `real-` are selected in exact city -> same oblast -> nationwide order; older starter/demo records are excluded from truthful local proof.
- P1-05.1 reference behavior: `/slonim` uses exact-city proof heading `Наши работы в Слониме`; `/lida` uses oblast heading `Наши работы в Гродненской области`; `/gomel` uses nationwide fallback heading `Примеры наших работ по Беларуси`.
- P1-06.1 pricing landing is complete: `/tseny` is now a focused SEO/commercial pricing landing, not a precise price list; it uses existing `content/services.ts` price data, real service photography, service links, cost-factor explanation, approximate-data guidance and a branded compact QuizForm CTA.
- Header intentionally includes `Цены` after `Наши работы` because the pricing strategy is now defined. Final header order: `Профнастил -> Штакетник -> Сетка-рабица -> Ворота -> Наши работы -> Цены -> Контакты`.
- P1-06.2 homepage QuizForm compact refinement is complete: homepage calculator keeps its existing visual design, reuses `QuizForm presentation="compact"`, and splits the approved explanatory copy into two paragraphs.
- P1-06.3 CityPage calculator compact parity is complete: every city route keeps one shared `CityPage` template, now with a homepage-like light calculator composition, dynamic city heading, approved two-paragraph copy and `QuizForm presentation="compact"` while preserving `cityName` and `source`.
- P1-06.4 ServicePage visual parity is complete: all six service pages now use one shared homepage-aligned commercial flow with light branded hero, compact inline hero price, service-specific benefits checklist, real-photo gallery before pricing, honest pricing block, 5-step process timeline, `/tseny`-like compact calculator, useful/SEO content before FAQ, and related links at the bottom.
- ServicePage QuizForm now intentionally uses `presentation="compact"`; validation, API submission, analytics and service defaults were not changed.
- P1-06.5 nationwide copy cleanup is complete: homepage and shared ServicePage commercial copy now use neutral Belarus-wide wording instead of implying "we travel from Gomel"; legitimate Gomel-local context in city/contact/review surfaces is preserved.
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
- P1-06.1 pricing landing strategy and Header pricing nav.
- P1-06.2 homepage QuizForm compact refinement.
- P1-06.3 CityPage calculator compact parity and QuizForm step-count source.
- P1-06.4 ServicePage visual parity and compact calculator.
- P1-06.5 nationwide copy cleanup for homepage FAQ and shared ServicePage useful content.
- TOOLING-01 Codex persistent instructions / workflow cleanup.

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
- P1-05.1 city page visual parity and real proof completed on branch `codex/P1-05.1-citypage-visual-parity`: city pages now reuse the homepage benefit/trust block, real service thumbnails and real project proof with deterministic exact -> oblast -> nationwide fallback. Implementation/main SHA: `1559823776b633359cc8a47c6f847922b8d3d288`.
- P1-06.1 pricing landing completed on branch `codex/P1-06.1-pricing-landing`: `/tseny` was rebuilt from the old table-based price page into a mobile-first SEO/commercial pricing landing with truthful "from" prices from existing service data, real service photography, links to all 6 service pages, cost-factor explanation, approximate-data guidance, branded final CTA and compact QuizForm presentation. Header now intentionally includes `Цены -> /tseny` after `Наши работы`. Implementation commit: `559b21a55ab9c6056ec7d7b03adbe553be49f1a1`; merge/main SHA before docs: `e3ca26e08892562e2a7ae887153c2b45355250c7`.
- P1-06.2 homepage QuizForm compact refinement completed on branch `codex/P1-06.2-homepage-quiz-compact`: homepage calculator retained the existing visual design, reused approved `QuizForm presentation="compact"`, removed unnecessary empty height inside the form, kept question/answers/controls as one gathered flow, and split the approved explanatory copy into two paragraphs. `/tseny` was not changed and regression passed. Implementation commit: `ae739acbbf5854637ac234288730ef5196ba2ab6`; merge/main SHA before docs: `296157b27463df47c34ce6359614e9942836aa2c`.
- P1-06.3 CityPage calculator compact parity completed on branch `codex/P1-06.3-citypage-quiz-compact`: all city routes now use the shared CityPage light calculator section with dynamic city heading, approved two-paragraph copy, `QuizForm presentation="compact"`, and centralized `QUIZ_TOTAL_STEPS` for step count display/copy. QuizForm validation, API submission and analytics events were not changed. Homepage and `/tseny` regression passed; ServicePage, `/kontakty` and blog QuizForm callsites were not redesigned. Implementation commit: `ea64bb8272fe0cd526a07d885b39beb749500ea6`; merge/main SHA before docs: `7643b7fedd38585040092a7054e75dc8cb10d68c`.
- P1-06.4 ServicePage visual parity completed on branch `codex/P1-06.4-servicepage-visual-parity`: shared `ServicePage` was rebuilt into the approved homepage-like commercial flow while preserving the real-photo system, routes, metadata/canonical/schema, service data and lead behavior. It added light branded hero treatment, compact inline hero price, service-specific benefits checklist, real-photo gallery before pricing, honest pricing block, 5-step process timeline, `/tseny`-like compact calculator, useful/SEO content before FAQ, and related links at the bottom. ServicePage QuizForm now intentionally uses `presentation="compact"`. Implementation head: `4a2b8fc79b521bd50d49254569934f5378c6feda`; merge/main SHA before docs: `5cd79a099e2adcf0dc677864dda0eb9f0da2d31d`.
- P1-06.5 nationwide copy cleanup completed on branch `codex/P1-06.5-nationwide-copy-cleanup`: homepage FAQ and shared ServicePage useful content now present MasterZabor as working across Belarus without making geography feel like an automatic price/risk objection; the specialist visit is explicitly described as the next step after preliminary calculation and agreement. Implementation head: `f9739bc6238222ca13c56dfbfc0bc46bd1876d89`; merge/main SHA before docs: `d2d838f4eab4f3891349daf4a15296fdc0fb827e`.
- TOOLING-01 completed on branch `codex/TOOLING-01-codex-workflow-cleanup`: root `AGENTS.md` created for Codex persistent instructions; `.cursorrules` remains historical/reference; roadmap remains the only roadmap source of truth; Knowledge Base remains architecture/project memory; future stage prompts should mostly contain goal, scope and acceptance instead of repeating stable repository rules; no MCP/plugins/dependencies/Skills were added. Implementation/main SHA: `edf728009c2d3b2199e3fc0334330e4a20a10a74`.

## OPEN ISSUES

- P1-03.1 added the first 9 own real MasterZabor project records. The older 8 starter/demo records remain below them and should be gradually replaced or expanded as more confirmed real objects are prepared.
- `ServicePage` visual parity завершен: все 6 service pages имеют утвержденные hero/gallery из production assets and one shared homepage-aligned commercial layout.
- `content/blog-posts.ts` использует generated SVG covers.
- `generateWebsiteJsonLd()` все еще содержит `SearchAction`, но реального поиска нет.
- `generateProductJsonLd()` Offer `url` сейчас указывает на `SITE_URL`, не на конкретную service page.
- Старый P1-06 scope `commercial pages visual polish` superseded продуктовым решением P1-06.1: `/tseny` уже закрыта как pricing landing; `/otzyvy` и `/kontakty` не являются автоматическим хвостом P1-06.
- `/otzyvy` содержит текстовые отзывы без внешнего proof: Google/Yandex screenshots, ссылки, фото объекта, город/тип работ.
- City pages remain templated, but P1-05.1 reduced doorway/thin risk by adding truthful real proof blocks. Future work can add more confirmed local projects, but starter/demo records must not be used as local proof.
- Dependencies still use several `latest` ranges in `package.json` (`tailwindcss`, `eslint`, `typescript`, types). Not urgent, but hurts reproducibility.
- Known lint warning: `components/forms/QuizForm.tsx` React Hook Form `watch()` / React Compiler compatibility. Не blocker сейчас.
- `.tmp/` local scratch is ignored in `.gitignore`; if it contains Chrome lock files, do not force-delete while Chrome/processes are running.
- Root `PROJECT-ROADMAP-TRACKER.md` has been removed to avoid two competing roadmap sources; use `docs/PROJECT-ROADMAP-TRACKER.md`.
- Future copy audit: CityPage and blog still contain older "за 5 минут" wording. Audit/update only in a separate approved content stage.

## REMAINING PAGES / UI WORK

- `/nashi-raboty`: P1-03 foundation and P1-03.1 first real-project content are complete. Дальше не redesign, а постепенное расширение/замена starter records собственными подтвержденными объектами MasterZabor.
- `/tseny`: P1-06.1 DONE. Страница сохранена indexable с canonical `https://www.masterzabor.by/tseny`, использует no-slash links, service data prices, real service photography and compact QuizForm CTA. Header содержит `Цены -> /tseny`.
- `/otzyvy`: не redesign сейчас. Откладывать до появления реальных review proof: screenshots, external sources, confirmed objects.
- `/kontakty`: отдельный redesign сейчас не нужен; текущая функциональная страница остается как есть. Возможен мягкий polish позже только отдельным решением.
- `/blog`: всего 3 статьи, covers placeholder SVG. Перед масштабированием нужен content model или хотя бы MDX/data decision.
- Blog articles: полезны как база, но нужны реальные изображения, категории, related links, обновление под 2026 SEO.
- City pages: P1-05.1 replaced hero/examples placeholders with the approved homepage photo direction, real service images and truthful project proof. P1-06.3 aligned the CityPage calculator with the compact homepage-like flow. Future improvements should add more confirmed local projects, not separate city templates.
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
- Placeholder SVG helpers remain in `content/blog-posts.ts`; CityPage, portfolio cards and the six ServicePage galleries now use real photo assets.
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
- Keep final Header order stable unless a separate navigation task changes it: `Профнастил -> Штакетник -> Сетка-рабица -> Ворота -> Наши работы -> Цены -> Контакты`.
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
   - Статус: DONE after approved local visual/technical review, Preview deployment, merge to `main`, Production deployment and Production smoke.
   - Что сделано: P1-05.1 привел CityPage к визуальному языку homepage и добавил реальные proof cards без выдуманных городских объектов.
   - Где: `app/[city]/page.tsx`, `components/templates/CityPage.tsx`, `components/sections/BenefitTrustSection.tsx`, `content/projects.ts`, `content/cities.ts`.
   - Архитектура: все 40+ city pages используют один universal `CityPage`; homepage и CityPage используют общий `BenefitTrustSection` с 8 утвержденными benefit cards и production icons.
   - Proof logic: `id.startsWith("real-")` marks confirmed real projects; older starter/demo records are excluded. Fallback order is deterministic: exact city -> same oblast -> nationwide.
   - Reference behavior: `/slonim` -> `Наши работы в Слониме`; `/lida` -> `Наши работы в Гродненской области`; `/gomel` -> `Примеры наших работ по Беларуси`.
   - Implementation commit: `32c5b59216a756cb1d8f083086f834b567518208`; merge/main SHA before docs: `1559823776b633359cc8a47c6f847922b8d3d288`.
   - Как проверить: `/`, `/lida`, `/slonim`, `/gomel`, `/bobruysk`, `/zabory-iz-profnastila`, `/nashi-raboty` return 200; CityPage has real hero/service/project images, 8 benefits, no `data:image/svg`, no demo Lida proof, and mobile no horizontal overflow.

6. `P1-06.1-pricing-landing`
   - Статус: DONE after visual + technical approval, merge to `main`, Production deployment and Production smoke.
   - Что сделано: `/tseny` перестроена из старого table-based price page подхода в полноценную SEO/commercial pricing landing.
   - Где: `app/tseny/page.tsx`, `components/forms/QuizForm.tsx`, `components/layout/Header.tsx`.
   - Product decision: цены остаются ориентировочными и берутся только из existing `content/services.ts`; точная стоимость считается под конкретный объект.
   - UX/content: real service photography, links на все 6 service pages, объяснение факторов стоимости, блок примерных данных для расчёта, final branded CTA, compact QuizForm presentation только там, где включен `presentation="compact"`.
   - Navigation: `Цены -> /tseny` намеренно добавлены в global Header, потому что pricing strategy сформирована. Финальный Header order: `Профнастил -> Штакетник -> Сетка-рабица -> Ворота -> Наши работы -> Цены -> Контакты`.
   - Supersedes old P1-06 scope: `/otzyvy` не redesign без реальных review proof; `/kontakty` не требует отдельного redesign сейчас.
   - Implementation commit: `559b21a55ab9c6056ec7d7b03adbe553be49f1a1`; merge/main SHA before docs: `e3ca26e08892562e2a7ae887153c2b45355250c7`.
   - Как проверить: `/` and `/tseny` return 200; Header order stable desktop/mobile; `/tseny` canonical is `https://www.masterzabor.by/tseny`; all 6 service links/images work; compact QuizForm visible; no horizontal overflow; no `Доставка и регион`; no `бесплатный замер`; Next/runtime/Vercel errors absent.

7. `P1-06.2-homepage-quiz-compact-refinement`
   - Статус: DONE after visual + technical approval, merge to `main`, Production deployment and Production smoke.
   - Что сделано: homepage calculator сохранил существующий visual design and section composition, but now reuses approved `QuizForm presentation="compact"`.
   - Где: `app/page.tsx`.
   - UX decision: убрана лишняя пустая высота внутри homepage QuizForm; question, answers and controls visually read as one gathered flow.
   - Copy: explanatory copy обновлён и разбит на 2 paragraphs:
     - `Ответьте на 6 вопросов — этого достаточно, чтобы понять, что вам нужно, и вернуться к вам с понятным ориентиром по цене.`
     - `Уточним детали по телефону, чтобы вы могли сравнить варианты и спокойно принять решение.`
   - Проверено: desktop Step 1, representative tall Step 3 and final Step 6; mobile 360/390/430; fixed mobile CTA does not cover QuizForm controls after scrolling; no horizontal overflow.
   - Regression: `/tseny` не изменялась and pricing landing compact QuizForm still works.
   - Implementation commit: `ae739acbbf5854637ac234288730ef5196ba2ab6`; merge/main SHA before docs: `296157b27463df47c34ce6359614e9942836aa2c`.

8. `P1-06.3-citypage-quiz-compact-parity`
   - Статус: DONE after visual + architecture approval, merge to `main`, Production deployment and Production smoke.
   - Что сделано: CityPage calculator switched from the old full-width dark-green treatment to a light homepage-like calculator composition.
   - Где: `app/page.tsx`, `components/forms/QuizForm.tsx`, `components/forms/quiz-form-config.ts`, `components/templates/CityPage.tsx`.
   - UX decision: all city routes now use `QuizForm presentation="compact"` through one shared `CityPage` template while keeping the dynamic city heading.
   - Data/lead behavior: `cityName={city.name}` and `source={city-${city.slug}}` are preserved; QuizForm validation, API submission and analytics events were not changed.
   - Copy: CityPage uses the approved two-paragraph calculator copy with `QUIZ_TOTAL_STEPS` as the step-count source of truth.
   - Architecture: `QUIZ_TOTAL_STEPS` centralizes only the number of quiz steps; it is not a broader QuizForm refactor.
   - Verification: production `/volkovysk`, `/lida`, `/gomel`, `/kalinkovichi`, `/` and `/tseny` returned 200; mobile 360/390/430 reached Step 6 without horizontal overflow or fixed CTA overlap.
   - Regression: homepage and `/tseny` remain clean; ServicePage, `/kontakty` and blog QuizForm callsites were not changed.
   - Future note: audit remaining default QuizForm surrounding copy separately, especially older "за 5 минут" wording outside homepage/CityPage/`/tseny`.
   - Implementation commit: `ea64bb8272fe0cd526a07d885b39beb749500ea6`; merge/main SHA before docs: `7643b7fedd38585040092a7054e75dc8cb10d68c`.

9. `P1-06.4-servicepage-visual-parity`
   - Статус: DONE after visual + technical approval, Preview deployment, merge to `main`, Production deployment and Production smoke.
   - Что сделано: shared ServicePage template приведен к visual language homepage/`/tseny` without per-service forks.
   - Где: `components/templates/ServicePage.tsx`, `content/services.ts`, `public/images/services/zabory-iz-profnastila/gallery-00-graphite-wicket.webp`.
   - Final design decision: light branded hero, compact inline hero price, service-specific benefits checklist, real-photo gallery before pricing, honest pricing block, 5-step process timeline, `/tseny`-like compact calculator, useful/SEO content before FAQ, related services/cities at the bottom.
   - Photo decision: approved real-photo system preserved; `/zabory-iz-profnastila` gallery has exactly 6 images with graphite+wicket as the first gallery image and the old brown first gallery photo removed.
   - Quiz decision: ServicePage now intentionally uses `QuizForm presentation="compact"`; QuizForm validation, API submission, analytics and service defaults were not changed.
   - Verification: production `/`, `/tseny`, `/lida` and all six service pages returned 200; representative `/zabory-iz-profnastila` and `/vorota-otkatnye` passed desktop/mobile visual, no horizontal overflow, gallery/pricing/process/calculator/order checks, and canonical/Product/FAQ/Breadcrumb schema checks.
   - Implementation head: `4a2b8fc79b521bd50d49254569934f5378c6feda`; merge/main SHA before docs: `5cd79a099e2adcf0dc677864dda0eb9f0da2d31d`.

10. `P1-06.5-nationwide-copy-cleanup`
   - Статус: DONE after Preview approval, merge to `main`, Production deployment and Production smoke.
   - Что сделано: homepage FAQ and shared ServicePage useful content cleaned up nationwide positioning so visitors do not read the site as "a Gomel company traveling far away" on core commercial pages.
   - Где: `app/page.tsx`, `components/templates/ServicePage.tsx`.
   - Homepage FAQ final question: `Работаете ли вы в небольших городах, посёлках и деревнях?`
   - Homepage FAQ final answer: `Да. Работаем по всей Беларуси — в том числе в небольших городах, посёлках и деревнях. Для предварительного расчёта достаточно сообщить основные параметры объекта. После согласования деталей организуем выезд специалиста на объект для заключения договора и подготовки к работам.`
   - ServicePage copy decision: first useful-content paragraph now ends with `После согласования условий организуем выезд специалиста на объект для заключения договора и подготовки к работам.`
   - Product decision: use honest nationwide wording (`Работаем по всей Беларуси`) on homepage/service pages; do not invent local offices, local crews or guaranteed logistics claims; keep legitimate Gomel facts in `/gomel`, `/kontakty`, real reviews/projects and local datasets.
   - Verification: production `/`, all six service pages, `/lida`, `/gomel` and `/kontakty` returned 200; homepage FAQ/FAQ JSON-LD contain the final wording; old Gomel-centric FAQ and old approved-scope "за 5 минут" wording are absent from homepage/service pages; legitimate Gomel contexts remain.
   - Remaining debt: CityPage and blog still contain older "за 5 минут" wording and should be handled only in a separate approved content stage.
   - Implementation head: `f9739bc6238222ca13c56dfbfc0bc46bd1876d89`; merge/main SHA before docs: `d2d838f4eab4f3891349daf4a15296fdc0fb827e`; Production deployment ID: `dpl_4dFcqkB18zhnoAW4HZUj37nCS5RY`.

11. `P1-07-product-jsonld-offer-urls`
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
   - Что сделать: добавить небольшой deterministic regression script для sitemap/canonical/API/phone utils.
   - Где: `scripts/`, possibly package script if a separate task approves it.
   - Зачем: ловить SEO/API regressions до production.
   - Как проверить: one command checks representative 200 pages, canonical host, no trailing slash policy, sitemap URLs without redirects, robots host, apex/duplicate host redirects, protected API unauthorized behavior, and later SearchAction absence / Product Offer URLs.
   - Tooling note: do not add a test framework if a plain Node script is enough.

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
