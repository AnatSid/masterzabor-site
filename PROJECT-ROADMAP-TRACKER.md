# PROJECT ROADMAP TRACKER: MASTERZABOR

Дата создания: 2026-06-12  
Проект: `masterzabor`  
Production: https://www.masterzabor.by  
Canonical host: `https://www.masterzabor.by`

## Назначение файла

Этот файл отвечает на вопросы:

- что уже сделано;
- какой этап следующий;
- какие проверки нужны перед commit/push;
- как продолжить работу в новом чате без потери контекста.

Не заменяет:

- `AUDIT-MASTERZABOR-2026.md` - полный аудит и причины решений;
- `PROJECT-KNOWLEDGE-BASE.md` - карта проекта и архитектурная память;
- `docs/*` - история проекта, production/domain/analytics runbooks.

## Как продолжить в новом чате

Сначала дать агенту такую инструкцию:

```text
Перед работой прочитай:
1. PROJECT-ROADMAP-TRACKER.md
2. PROJECT-KNOWLEDGE-BASE.md
3. AUDIT-MASTERZABOR-2026.md
4. docs/ANALYTICS.md
5. docs/AUDIT-PRODUCTION-HOST-DOMAIN.md

Продолжай следующий незавершённый этап из PROJECT-ROADMAP-TRACKER.md.
После этапа обнови PROJECT-ROADMAP-TRACKER.md и, если появились архитектурные выводы, PROJECT-KNOWLEDGE-BASE.md.
```

## Жёсткие правила проекта

- Не менять canonical host с `www.masterzabor.by` на apex.
- Не добавлять `www -> apex` redirect.
- Не регистрировать Telegram webhook на `masterzabor.by`.
- Не пропускать Telegram webhook через redirect.
- Не исправлять всё одной большой пачкой.
- Один этап = отдельная ветка/commit/preview -> user approval -> merge to `main` -> production verification.
- После каждого этапа обновлять этот tracker.
- Preview deployments are for branch validation only; Production changes happen only after merge/push to `main`.

## Рабочий цикл этапа

1. Создать ветку `codex/<stage-id>-<meaning>`: номер этапа первым, затем короткий смысл.
2. Сделать только изменения выбранного этапа.
3. Обновить `PROJECT-ROADMAP-TRACKER.md`.
4. При необходимости обновить `PROJECT-KNOWLEDGE-BASE.md`.
5. Проверить локально: `git status`, `npm run lint`, `npm run build`, `npm run dev`, Next MCP, Browser/Playwright, `curl`/status codes по scope этапа.
6. Дать пользователю список URL/сценариев для ручной проверки на `localhost:3000`.
7. После подтверждения сделать commit в stage branch.
8. Push stage branch -> Vercel Preview.
9. Проверить Preview deployment и отличать его от Production.
10. После явного подтверждения пользователя написать, что дальше будет merge/push в `main` и это запустит Production deploy.
11. Merge/push stage branch into `main`.
12. Дождаться Vercel Production deployment; после `git push origin main` ждать минимум 40 секунд перед первым production smoke, иначе можно попасть в старый deployment/cache.
13. Проверить live production: ключевые URL, status codes, canonical/sitemap/robots/redirects, формы/Telegram/API по scope этапа.
14. Дать пользователю production URL/сценарии для ручной проверки.
15. После ручной проверки пользователя и повторной проверки агента отметить этап `done`.

Важно:

- `git push origin codex/<stage-name>` создаёт Preview и не меняет `main`.
- Для новых веток использовать stage-first naming: например `codex/P0-03-lead-reliability-secrets`, `codex/P1-01-conversion-analytics`.
- Только `git push origin main` или merge PR в `main` запускает Production deployment.
- Не считать этап завершённым только по Preview.
- Если в рабочем дереве есть чужие изменения (`.gitignore`, `.cursor/`, etc.), не трогать их и не включать в stage.

## Проверки по умолчанию

Локально:

- `npm run lint` или актуальная замена после миграции с `next lint`;
- `npm run build` после отдельной диагностики зависания;
- `npm run dev`;
- Runtime Next DevTools MCP protocol после `npm run dev`:
  1. `nextjs_index` - найти running Next.js server и runtime tools.
  2. `nextjs_call get_errors` - проверить config/build/runtime errors до ручного smoke.
  3. `nextjs_call get_routes` - подтвердить App Router route map.
  4. Browser/Playwright page smoke - открыть homepage, service, city, blog, commercial pages, lead form.
  5. `nextjs_call get_errors` после открытия страниц - поймать browser/runtime/hydration errors.
  6. `curl`/status codes - проверить sitemap/canonical/robots/redirects и no-slash policy.
- ручная проверка на `http://localhost:3000`.

Production/preview:

- status codes ключевых URL;
- canonical;
- sitemap;
- robots;
- формы/Telegram;
- mobile header/bottom CTA;
- console errors.

## Статусы

- `done` - завершено и записано;
- `in_progress` - сейчас делается;
- `blocked` - нужна внешняя информация или доступ;
- `not_started` - ещё не начато.

## Current Status

| Этап | Статус | Комментарий |
|---|---|---|
| S00 Audit docs | done | Созданы `AUDIT-MASTERZABOR-2026.md` и `PROJECT-KNOWLEDGE-BASE.md`. |
| S01 Tracker | done | Создан этот файл. |
| P0-01 Canonical / sitemap / no-slash URL policy | done | Кодовые правки, локальная проверка и пользовательское подтверждение выполнены; commit/push разрешены. |
| P0-01.5 Next 16 / MCP readiness | done | Next 16.2.9 upgrade завершён; `npm run dev`, `npm run lint`, `npm run build` и MCP checks прошли. |
| P0-02 Close duplicate Vercel URL | done | `masterzabor-site.vercel.app` redirects to canonical `www.masterzabor.by`; local, preview/main and production checks passed. |
| P0-03 Lead reliability + production secrets | done | Atomic KV list storage, Telegram delivery status and production fail-closed secrets implemented; local checks, main merge and production smoke passed. |
| P0-04 Build/lint/tooling diagnosis | done | Superseded by P0-01.5 and rechecked: `npm run lint`, `npm run build`, Next MCP, Browser smoke and curl status checks pass. |
| P1-01 Contact click + quiz funnel analytics | done | Contact clicks and minimal quiz funnel implemented; branch, main merge and production smoke passed. |
| P1-01.1 Telegram analytics report formatting | done | Follow-up: `/report` and `/stats_*` split into leads, contact clicks and quiz funnel sections; local simulation, lint/build, MCP, Browser and curl checks passed. |
| P1-02 Mobile layout + CRO quick wins | done | Mobile overflow/menu/CTA cleanup completed; `Цены` intentionally not added to header. Local lint/build/MCP/curl/mobile CDP checks passed. |
| P1-03 Real portfolio photos + project model foundation | not_started | Начать замену placeholder visuals. |
| P1-04 JSON-LD cleanup | not_started | SearchAction, Product Offer URLs, breadcrumbs URL policy. |
| P2-01 Blog/content architecture | not_started | MDX/CMS direction for 500+ articles. |
| P2-02 City page proof/local SEO | not_started | Реальные объекты, отзывы, районы, локальные доказательства. |
| P2-03 Tests/Lighthouse/monitoring | not_started | Regression checks and performance measurements. |

## Stage Details

### P0-01 Canonical / Sitemap / No-Slash URL Policy

Цель:

- все canonical/sitemap/OG/JSON-LD/internal links должны указывать на final 200 URL без trailing slash.

Вероятные файлы:

- `lib/seo.ts`
- `app/sitemap.ts`
- `app/[city]/page.tsx`
- `app/blog/[slug]/page.tsx`
- service pages in `app/*/page.tsx`
- `components/templates/CityPage.tsx`
- `components/templates/ServicePage.tsx`
- `app/blog/page.tsx`
- `lib/reporting.ts`

Done criteria:

- sitemap URL не редиректят;
- canonical совпадает с final URL;
- OpenGraph URL совпадает с canonical;
- JSON-LD URL не указывает на redirecting slash URL;
- локально проверены homepage, service, city, blog, prices.

### P0-01.5 Next 16 / MCP Readiness

Цель:

- перейти с Next 15.5.18 на Next 16.2.9 отдельным controlled stage;
- включить runtime diagnostics через Next DevTools MCP (`/_next/mcp`) и `nextjs_index`/`nextjs_call`;
- не смешивать upgrade с canonical/sitemap SEO-fix.

Когда делать:

- строго после завершения и проверки `P0-01 Canonical / sitemap / no-slash URL policy`;
- до `P0-02`, `P0-03` и больших frontend/mobile/CRO/design правок.

Рабочая ветка:

- `codex/p0-next16-mcp-readiness`

Scope:

- проверить Node.js `20.9+` локально и на Vercel;
- выполнить официальный Next 16 codemod на clean git state;
- заменить deprecated `next lint` на ESLint CLI;
- проверить async Request APIs (`params`, `searchParams`, `cookies`, `headers`) и route handlers;
- проверить `next/image` breaking changes;
- проверить Turbopack dev/build поведение;
- после `npm run dev` проверить Next MCP discovery/tools;
- не включать Cache Components, React Compiler и крупные refactors в этом этапе.

Done criteria:

- `package.json` / lockfile обновлены на Next 16.2.9;
- `npm run dev` стартует;
- `npm run lint` проходит через ESLint CLI (`eslint .`);
- `npm run build` проходит на Next 16.2.9 Turbopack;
- Next DevTools MCP видит running server через `nextjs_index`, доступны runtime tools через `nextjs_call`;
- canonical/sitemap/no-slash policy из P0-01 не сломана;
- smoke test пройден для homepage, service, city, blog, prices, lead form;
- `PROJECT-ROADMAP-TRACKER.md` и при необходимости `PROJECT-KNOWLEDGE-BASE.md` обновлены.

### P0-02 Close Duplicate Vercel URL

Цель:

- `https://masterzabor-site.vercel.app` не должен быть индексируемым дублем production.

Варианты:

- Vercel dashboard domain/project setting;
- `next.config.ts` host-based redirect if safe and without host loop;
- Proxy/headers only if config redirect is insufficient;
- noindex as fallback for non-canonical host.

Done criteria:

- `www.masterzabor.by` работает без redirect loop;
- apex продолжает `307 -> www`;
- Vercel deployment URL redirects to `https://www.masterzabor.by` or returns noindex;
- Telegram webhook на `www` не затронут.

### P0-03 Lead Reliability + Production Secrets

Цель:

- заявки не теряются при сбоях Telegram/KV;
- production endpoints не fail-open.

Вероятные файлы:

- `app/api/lead/route.ts`
- `lib/leads.ts`
- `lib/telegram.ts`
- `app/api/cron/daily-report/route.ts`
- `app/api/cron/analytics-report/route.ts`
- `app/api/telegram-webhook/route.ts`
- `lib/request-auth.ts`
- `.env.example`
- `docs/ANALYTICS.md`

Done criteria:

- atomic write или safer storage model;
- lead has ID/status;
- Telegram failure не означает потерю лида;
- `CRON_SECRET` mandatory in production;
- webhook secret/chat allowlist mandatory in production;
- docs/env checklist updated.

### P0-04 Build / Lint / Tooling Diagnosis

Цель:

- понять и устранить зависание `next build`;
- подготовить lint к Next 16.

Вероятные файлы:

- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- possibly Next config/build scripts.

Done criteria:

- build проходит или причина документирована;
- lint command не зависит от deprecated `next lint`;
- dependency versions pinned or planned.

Result:

- Closed by P0-01.5 Next 16 / MCP readiness and rechecked on `codex/P0-04-build-lint-tooling-diagnosis`.
- `npm run lint` passes with the known React Compiler warning from React Hook Form `watch()` in `QuizForm`.
- `npm run build` passes on Next.js `16.2.9` Turbopack; sandbox-only EPERM on `.next` was resolved by rerunning outside sandbox.
- Next DevTools MCP finds the dev server on `http://localhost:3000`; `get_routes` works and `get_errors` returns empty `configErrors`/`sessionErrors` after Browser smoke.
- Browser/curl smoke: homepage/service/city/blog/prices return `200`; `/sitemap.xml` and `/robots.txt` return `200`; slash service URL redirects `308` to no-slash; duplicate Vercel host redirects `308` to canonical `www`.

### P1-01 Contact Click + Quiz Funnel Analytics

Цель:

- бизнес видит звонки/мессенджеры и базовую воронку квиза без лишней аналитической сложности.

Events:

- `click_call`
- `click_telegram`
- `click_whatsapp`
- `click_viber`
- `quiz_started`
- `quiz_step_3_reached`
- `quiz_contact_step_reached`

Done criteria:

- contact clicks are counted by day in KV and sent to GA/Yandex when configured;
- minimal quiz funnel is counted by day in KV and sent to GA/Yandex when configured;
- daily Telegram report includes contact clicks and quiz funnel counts;
- `/api/stats` includes `conversionEvents`;
- no errors when browser counters are absent;
- source/page/location data included without PII.

Follow-up P1-01.1:

- `/report` shows separated daily/month-to-date sections for leads, contact clicks and quiz funnel;
- `/stats_today`, `/stats_week`, `/stats_month` and legacy `/stats ...` include contact click and quiz funnel blocks for the requested period;
- Daily `/report` year labels omit the `г.` suffix after years.

### P1-02 Mobile Layout / CRO Quick Wins

Цель:

- улучшить мобильную читаемость и быстрые пути к заявке без отдельного пункта `Цены` в header.

Tasks:

- не добавлять `Цены` в header: цены зависят от города, длины, высоты и типа забора; ориентиры уже есть на service pages;
- убрать горизонтальный page-level overflow/right gutter на mobile;
- проверить mobile phone layout, burger и bottom CTA;
- mobile menu должно появляться только после нажатия и не расширять viewport вправо;
- добавить safe-area для iPhone bottom CTA/menu;
- сделать широкие price tables scrollable внутри своего блока;
- не ломать gates dropdown.

Done criteria:

- desktop/mobile nav readable;
- call/messenger CTAs visible;
- no overlap on narrow mobile;
- homepage/service/prices have document-level `overflowX = 0` on 320/360/375/390/430 px;
- mobile menu opens/closes by tap, does not shift the page, avoids unused full-screen overlay space and stays inside viewport.

### P1-03 Real Portfolio Photos + Project Model Foundation

Цель:

- начать замену placeholder graphics реальными proof-assets.

Tasks:

- создать `content/projects.ts`;
- добавить `ProjectCard`;
- заменить хотя бы ключевые homepage/portfolio placeholders реальными records when photos are available.

Done criteria:

- есть структура для 100-300 фото;
- alt/city/service/material stored structurally;
- placeholder usage reduced and tracked.

### P1-04 JSON-LD Cleanup

Цель:

- schema соответствует реальной функциональности сайта.

Tasks:

- убрать или реализовать `SearchAction`;
- Product Offer URL на service URL;
- Breadcrumb/ListItem URLs through canonical helper;
- Article URLs through canonical helper.

Done criteria:

- no fake schema;
- no schema URLs pointing to redirects.

### P2-01 Blog / Content Architecture

Цель:

- подготовить рост до 500-1000 статей.

Tasks:

- выбрать MDX/CMS/data-source direction;
- категории/кластеры;
- related content strategy;
- blog sitemap strategy.

### P2-02 City Page Proof / Local SEO

Цель:

- снизить doorway/thin risk.

Tasks:

- local project blocks;
- city-specific reviews;
- район/срок/логистика;
- selective service-city pages only where justified.

### P2-03 Tests / Lighthouse / Monitoring

Цель:

- ловить регрессии до production.

Checks:

- sitemap URLs return 200;
- canonical matches URL;
- robots valid;
- lead API validation;
- phone utils;
- Lighthouse mobile for homepage/service/city/blog/prices.

## Last Update

2026-06-12:

- Создан tracker.
- Следующий этап: `P0-01 Canonical / sitemap / no-slash URL policy`.
- P0-01: добавлена единая нормализация canonical URL/no-slash для sitemap, metadata, OG, JSON-LD breadcrumbs/article, reporting paths и внутренних ссылок.
- P0-01 local checks: `npm run lint` passed; `npm run dev` проверен на `http://localhost:3001`, потому что `localhost:3000` занят PID 15144.
- P0-01 local checks: homepage, service, city, blog, blog article, prices и `/sitemap.xml` отдают 200; slash-варианты service/city/blog/prices отдают 308 на no-slash.
- P0-01 local checks: sitemap содержит 55 URL, terminal slash URL = 0, все 55 sitemap URL локально отдают 200 без redirect.
- P0-01.5 Next 16 / MCP readiness начат отдельной веткой `codex/p0-next16-mcp-readiness`.

2026-06-13:

- P0-01.5: зависимости обновлены до Next.js `16.2.9`, React `19.2.7`, `eslint-config-next` `16.2.9`; `next lint` заменён на `eslint .`.
- P0-01.5: ESLint flat config переведён на прямой `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, `.cursor/**` исключён из lint scope.
- P0-01.5: `npm run lint` проходит с 1 warning по `react-hook-form`/React Compiler в `QuizForm`; `npm run build` проходит на Next.js 16.2.9 Turbopack.
- P0-01.5: Next DevTools MCP обнаружил dev server на `http://localhost:3001`, `get_errors` вернул пустые ошибки, routes доступны.
- P0-01.5: после resume dev server проверен на `http://localhost:3000`; Next MCP обнаружил 6 tools, `get_errors` чистый, browser console errors/warnings = 0.
- P0-01.5: homepage, service, city, blog, blog article, prices и `/sitemap.xml` отдают 200; slash-варианты service/city/blog/prices отдают 308 на no-slash.
- P0-01.5: sitemap содержит 55 URL, terminal slash URL = 0, все 55 sitemap URL локально отдают 200 без redirect.
- P0-02: started on branch `codex/p0-close-duplicate-vercel-url`.
- P0-02: added host-based redirect in `next.config.ts` for `masterzabor-site.vercel.app` to `https://www.masterzabor.by`, excluding `/api/*` so webhook/API routes are not redirected.
- P0-02 local checks: `npm run lint` passes with the known React Hook Form warning; `npm run build` passes on Next.js 16.2.9 Turbopack.
- P0-02 local checks: dev server and built `next start -p 3002` both return `308` from `Host: masterzabor-site.vercel.app` to `https://www.masterzabor.by/`, `/gomel?utm=test`, `/sitemap.xml`, and `/robots.txt`; `/api/telegram-webhook` is not redirected.
- P0-02 note: slash duplicate URLs such as `/gomel/` first hit Next's no-slash `308` to `/gomel`, then the duplicate host redirect; no duplicate URL returns indexable 200.
- P0-02 remaining: verify preview/production `https://masterzabor-site.vercel.app` after deploy/merge.
- Workflow update: documented branch -> Preview -> approval -> merge to `main` -> Production verification process; `.cursor/` added to `.gitignore`.
- P0-03 Lead reliability + production secrets started on branch `codex/p0-lead-reliability-secrets`.
- P0-03: new leads are written to `leads:v2:{date}` with atomic Redis `rpush`; legacy `leads:{date}` arrays remain readable for reports.
- P0-03: lead API saves first, returns success with `leadId` and `deliveryStatus`; Telegram failure marks `telegram_failed` instead of losing the lead or returning 502.
- P0-03: `CRON_SECRET`, `STATS_API_TOKEN`, `TELEGRAM_WEBHOOK_SECRET` and `TELEGRAM_CHAT_ID` now fail-closed in Vercel Production.
- P0-03 production checks after merge `a2d585a`: homepage `200`, `/api/stats?period=today` without token `401`, `/api/cron/daily-report` without token `401`, `masterzabor-site.vercel.app/zabory-iz-profnastila` `308` to canonical `www`, Browser smoke on homepage has no console errors.
- P0-04 started on branch `codex/P0-04-build-lint-tooling-diagnosis`; no code changes needed.
- P0-04 checks: `npm run lint` passes with known `QuizForm` React Hook Form warning; `npm run build` passes on Next `16.2.9`; Next MCP `get_routes` works and `get_errors` is clean after Browser smoke.
- P0-04 curl smoke: `/sitemap.xml` `200`, `/robots.txt` `200`, `/zabory-iz-profnastila/` `308` to no-slash, duplicate host header `308` to canonical `www`.
- P1-01 started on branch `codex/P1-01-contact-click-quiz-funnel`.
- P1-01 scope narrowed by decision: contact clicks (`click_call`, `click_telegram`, `click_whatsapp`, `click_viber`) plus minimal quiz funnel (`quiz_started`, `quiz_step_3_reached`, `quiz_contact_step_reached`); no form-success duplication because lead stats already count submitted заявки.
- P1-01: added `/api/events` and `analytics-events:v1:{date}` KV hash counters; browser also sends GA4/Yandex events when counters exist.
- P1-01: daily lead report now includes contact click counts and quiz funnel counts; `/api/stats` returns `conversionEvents`.
- P1-01 local checks: `npm run lint` passes with known `QuizForm` warning; `npm run build` passes; Browser payload smoke captures contact and quiz events without writing KV; Next MCP `get_routes` includes `/api/events` and `get_errors` is clean.
- P1-01 production checks after merge `4509b14`: waited for Vercel rollout; homepage `200` with fresh deployment, `/api/events` invalid payload returns `400`, `/api/stats?period=today` without token returns `401`, live Browser smoke console errors/warnings = 0.
- Workflow note: after every future `git push origin main`, wait at least 40 seconds before production smoke checks.

2026-06-14:

- P1-01.1 started on branch `codex/P1-01-report-format-analytics`.
- P1-01.1: Telegram `/report` format split into leads, contact clicks and quiz funnel sections; daily and month-to-date totals are shown separately.
- P1-01.1: `/stats_today`, `/stats_week`, `/stats_month` and legacy `/stats ...` now include contact click and quiz funnel blocks for the selected period.
- P1-01.1: daily Telegram `/report` date/year labels omit the `г.` suffix after years; traffic titles are unchanged.
- P1-01.1 local checks: simulated 15 bot command texts; `npm run lint` passes with known `QuizForm` warning; `npm run build` passes; Next MCP `get_routes` works and `get_errors` is clean after Browser smoke; curl checks returned `/api/stats` `401`, invalid `/api/events` `400`, wrong-secret webhook `200`, `/sitemap.xml` `200`.
- P1-02 started on branch `codex/P1-02-mobile-layout-cro`; scope adjusted by user decision: skip adding `Цены` to header and focus on mobile overflow/menu/CTA.
- P1-02: added global page-level X-overflow guard, compact mobile call CTA, conditional mobile menu rendering, compact right-side drawer, safe-area-aware bottom CTA and horizontal scroll inside price tables.
- P1-02: mobile burger contact block now shows the clickable phone number as a full-width single-line `tel:` CTA, with Telegram/WhatsApp/Viber icons on the next row.
- P1-02 local checks: `npm run lint` passes with known `QuizForm` warning; `npm run build` passes; Next MCP `get_routes` works and `get_errors` is clean; curl checks returned homepage/service/prices `200`; CDP mobile audit on 320/360/375/390/430 px reports document-level `overflowX = 0` for homepage/service/prices and opened menu; opened burger phone CTA stays `nowrap`, uses `tel:+375333135072`, and Telegram/WhatsApp/Viber stay on the next row.
