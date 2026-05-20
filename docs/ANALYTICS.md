# Analytics & Telegram (production)

Отдельная система трафика, независимая от lead-report (`/api/cron/daily-report`, `lib/reporting.ts`).

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

Установка: `npx tsx scripts/set-telegram-bot.ts` (webhook + `setMyCommands`).

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

Оба защищены `Authorization: Bearer CRON_SECRET`.

## Production env checklist

См. `.env.example` — секции Required / Optional / Deprecated.

## Constraints

- OAuth refresh token выдаётся один раз (локальный OAuth flow); на Vercel хранить `GOOGLE_REFRESH_TOKEN`.
- Rate limits GA4/Yandex — ошибки логируются, в Telegram warning-блок.
- Нет debug API routes в production.
