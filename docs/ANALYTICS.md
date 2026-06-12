# Analytics & Telegram (production)

Отдельная система трафика, независимая от lead-report (`/api/cron/daily-report`, `lib/reporting.ts`).

> **Production domain:** canonical и runtime host — **`www.masterzabor.by`**.  
> Apex `masterzabor.by` → 307 → www (Vercel). Подробный audit: `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md`.

## Production domain architecture (фиксировано)

| System | Current host |
|--------|--------------|
| Vercel Primary Domain | `www.masterzabor.by` |
| Runtime (pages, API) | `www.masterzabor.by` |
| Canonical / sitemap / robots / OG / JSON-LD | `www.masterzabor.by` (`SITE_URL` в `lib/constants.ts`) |
| Platform redirect | `masterzabor.by` → **307** → `www.masterzabor.by` |
| App redirects (`next.config.ts`) | **None** (empty config — намеренно) |
| Telegram webhook | `https://www.masterzabor.by/api/telegram-webhook` **only** |

**Safest production setup (текущий — не менять без audit):**
1. Vercel: apex → 307 → www; Primary Domain = www.
2. `next.config.ts`: без host-based redirects.
3. `SITE_URL` / `SITE_HOST` = www в `lib/constants.ts`.
4. Webhook регистрируется **только** на www.

## Architecture

```
Telegram / Cron
       │
       ▼
lib/analytics/reporting.ts  ──► formatTrafficReportTitle (lib/telegram-period.ts)
       │
       ├── getGa4Stats()      → lib/analytics/google.ts (OAuth refresh)
       └── getYandexMetrikaStats() → lib/analytics/yandex.ts

app/api/telegram-webhook/route.ts  ← команды бота
app/api/cron/analytics-report/route.ts  ← cron 20:00 Минск (vercel.json)
```

Fail-safe: `Promise.allSettled` — при падении одного источника второй блок всё равно попадает в сообщение.

## Google Analytics (GA4 Data API)

- **Auth:** OAuth2 refresh token only (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`).
- **Property:** `GA_PROPERTY_ID` (numeric GA4 property id).
- **Flow:** каждый запрос → `POST oauth2.googleapis.com/token` (grant `refresh_token`) → `runReport` на `analyticsdata.googleapis.com`.
- **Metrics:** `activeUsers`, `deviceCategory`, top 3 `pagePath` by `screenPageViews`.
- **Периоды:** `today` = 1 день; `week` = 7 дней (`6daysAgo`…`today`); `month` = 30 дней.

Service account (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`) **deprecated** — удалён из кода.

## Yandex Metrika

- **Env:** `YANDEX_METRIKA_TOKEN`, `YANDEX_METRIKA_COUNTER_ID`.
- **Visitors / devices:** `ym:s:users`, `ym:s:deviceCategory`.
- **Top pages:** `ym:pv:URLPathFull`, `ym:pv:pageviews` (не `ym:s:*` — иначе 400).

## Telegram bot

### Webhook (обязательно www)

| | |
|---|---|
| URL | `https://www.masterzabor.by/api/telegram-webhook` (`TELEGRAM_WEBHOOK_URL`) |
| Secret | header `x-telegram-bot-api-secret-token` = `TELEGRAM_WEBHOOK_SECRET` |
| Chat | только `TELEGRAM_CHAT_ID` |

**Vercel:** apex `masterzabor.by` → **307** → `www`. Telegram не следует за POST redirect → webhook только на **www**.

### Domain & redirect constraints (critical)

**Текущая стратегия (stable, май 2026):** **WWW-primary unified architecture.**

- **Canonical + runtime:** `https://www.masterzabor.by` (не apex).
- **Vercel Primary Domain:** `www.masterzabor.by`.
- **Platform redirect:** Vercel `masterzabor.by/*` → **307** → `www.masterzabor.by/*` (все пути, включая `/api/*`).
- **`next.config.ts`:** пустой — **нет** custom host redirects (намеренно).
- **Apex** — только alias (307 → www), не canonical, не webhook host.

**Telegram webhook constraints:**
- Webhook URL: `https://www.masterzabor.by/api/telegram-webhook` (`TELEGRAM_WEBHOOK_URL` в `lib/constants.ts`).
- POST на apex → 307; Telegram **не гарантирует** follow POST redirect → доставка ломается.
- Endpoint на www: POST → **200 direct**, без 307/308.

**Incident history (май 2026 — infinite redirect loop):**

| | |
|---|---|
| **Причина** | Конфликт Vercel `apex→www` + custom `www→apex` в `next.config.ts` |
| **Commit (добавлен redirect)** | `480f18a` |
| **Commit (hotfix, redirect удалён)** | `2526efe` |
| **Commit (SEO → www)** | `00feddf` — `SITE_URL`/`SITE_HOST` на www |
| **Симптом** | Infinite loop: apex→www→apex→…, сайт недоступен |

**ЗАПРЕЩЕНО без явного domain audit:**
- Добавлять `www→apex` redirect в `next.config.ts` или middleware.
- Менять canonical/`SITE_URL`/sitemap/robots на apex.
- Регистрировать webhook на `masterzabor.by` (apex).
- Менять Vercel Primary Domain или apex→www без проверки webhook + SEO.

**НЕ пытаться «исправить mixed-host» возвратом apex-canonical** — текущая www-primary config проверена в production (audit 26.05.2026) и stable.

Установка webhook: `npx tsx scripts/set-telegram-bot.ts` (webhook + `setMyCommands`).

### Команды

| Autocomplete | Legacy (совместимость) |
|---|---|
| `/traffic_today` | `/traffic` |
| `/traffic_week` | `/traffic week` |
| `/traffic_month` | `/traffic month` |
| `/stats_today` | `/stats` |
| `/stats_week` | `/stats week` |
| `/stats_month` | `/stats month` |
| `/report`, `/top`, `/help` | — |

Парсинг: `lib/telegram-bot-commands.ts`.

### Заголовки периода (трафик)

- **today:** `📈 Трафик сайта за 20 мая 2026 г.`
- **week:** `📈 Трафик за 14–20 мая 2026`
- **month:** `📈 Трафик за 21 апреля – 20 мая 2026`

Часовой пояс: `Europe/Minsk`.

## Cron

`vercel.json`: `0 17 * * *` UTC = 20:00 Минск

- `/api/cron/daily-report` — заявки (KV)
- `/api/cron/analytics-report` — трафик за today

Оба защищены `Authorization: Bearer CRON_SECRET` (если env задан).

### `CRON_SECRET` (Vercel)

- **Endpoints:** `GET /api/cron/daily-report`, `GET /api/cron/analytics-report`
- **Код:** проверка только если `process.env.CRON_SECRET` не пустой; иначе endpoint **открыт**
- **Vercel Cron:** при наличии `CRON_SECRET` в env проекта Vercel **сам** добавляет заголовок `Authorization: Bearer …` на cron-запросы
- **Production:** env **обязателен** (без него любой может вызвать cron URL)

### `STATS_API_TOKEN`

- **Endpoint:** `GET /api/stats?period=today|week|month` — JSON заявок из KV
- **Код:** env **обязателен** для этого route (без токена → `500`)
- **Telegram `/stats_*`:** env **не нужен** — webhook читает KV через `lib/reporting.ts` напрямую

## Production env checklist

См. `.env.example` — секции Required / Optional / Deprecated.

## Constraints

- OAuth refresh token выдаётся один раз (локальный OAuth flow); на Vercel хранить `GOOGLE_REFRESH_TOKEN`.
- Rate limits GA4/Yandex — ошибки логируются, в Telegram warning-блок.
- Нет debug API routes в production.

## OAuth recovery (GOOGLE_REFRESH_TOKEN)

Если Vercel logs показывают `invalid_grant` / `Token has been expired or revoked` — см. **`docs/GOOGLE-OAUTH-RECOVERY.md`**.

Кратко:

1. Scope: `https://www.googleapis.com/auth/analytics.readonly`
2. Новый token через [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) + существующие `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
3. Redirect URI в Google Cloud: `https://developers.google.com/oauthplayground`
4. Обновить только `GOOGLE_REFRESH_TOKEN` на Vercel → redeploy
5. Проверка: `/traffic_today` в Telegram без warning «Google Analytics временно недоступен»

**Testing mode:** refresh tokens истекают через 7 дней → Publish OAuth app to Production.
