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

1. Создать ветку `codex/<stage-name>`.
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
12. Дождаться Vercel Production deployment.
13. Проверить live production: ключевые URL, status codes, canonical/sitemap/robots/redirects, формы/Telegram/API по scope этапа.
14. Дать пользователю production URL/сценарии для ручной проверки.
15. После ручной проверки пользователя и повторной проверки агента отметить этап `done`.

Важно:

- `git push origin codex/<stage-name>` создаёт Preview и не меняет `main`.
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
| P0-02 Close duplicate Vercel URL | in_progress | Code-level host redirect added and checked locally; preview/production verification remains. |
| P0-03 Lead reliability + production secrets | not_started | KV atomic write, Telegram fallback, fail-closed secrets. |
| P0-04 Build/lint/tooling diagnosis | not_started | Ранее завис `next build`; `next lint` deprecated. |
| P1-01 Conversion analytics events | not_started | Calls, messengers, forms, quiz, errors. |
| P1-02 Header/mobile CRO quick wins | not_started | `Цены` в header, mobile phone/menu refinements. |
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

### P1-01 Conversion Analytics Events

Цель:

- бизнес видит, какие CTA и страницы дают лиды.

Events:

- `click_call`
- `click_telegram`
- `click_whatsapp`
- `click_viber`
- `form_start`
- `form_success`
- `form_error`
- `quiz_start`
- `quiz_step`
- `quiz_success`
- `price_view`
- `portfolio_filter`

Done criteria:

- events sent to GA/Yandex where configured;
- no errors when counters are absent;
- source/page data included.

### P1-02 Header / Mobile CRO Quick Wins

Цель:

- улучшить быстрые пути к заявке.

Tasks:

- добавить `Цены` в header;
- проверить mobile phone layout;
- добавить важные links в mobile menu;
- не ломать gates dropdown.

Done criteria:

- desktop/mobile nav readable;
- call/messenger CTAs visible;
- no overlap on narrow mobile.

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
