# Final Consistency Audit: Analytics / Domain Architecture

**Дата:** 28.05.2026  
**Контекст:** Production host architecture стабилизирована и вручную проверена.  
**Verdict:** **Approve** для domain architecture — runtime и live production согласованы на `www`. Предупреждение GA в Telegram — **отдельная server-side конфигурация**, не следствие миграции на www.

---

## Подтверждено вручную (production)

| Item | Value |
|------|-------|
| Vercel Primary Domain | `www.masterzabor.by` |
| Apex redirect | `masterzabor.by` → 307 → `www` (Vercel) |
| Google canonical | www |
| Google Search Console sitemap | www |
| Яндекс главное зеркало | www |
| Telegram webhook | `https://www.masterzabor.by/api/telegram-webhook` |
| GA4 stream URL | обновлён с apex на www |
| Measurement ID | `G-DT0TXHL4DM` (не менялся) |

---

## 1. Executive Summary

| Область | Статус |
|---------|--------|
| Canonical / OG / JSON-LD / sitemap / robots | ✅ **www** (код + live) |
| Telegram webhook URL | ✅ **www only** |
| Client GA4 (gtag) | ✅ `G-DT0TXHL4DM` на live homepage |
| Server GA4 (Telegram `/traffic`) | ⚠️ Отдельный OAuth stack; warning = `getGa4Stats()` reject |
| Hardcoded apex URL в runtime | ✅ **Не найдено** (кроме brand string) |

### Live verification (28.05.2026)

- `canonical`: `https://www.masterzabor.by`
- `og:url`: `https://www.masterzabor.by`
- `robots.txt`: `Host: www.masterzabor.by`, `Sitemap: https://www.masterzabor.by/sitemap.xml`
- `sitemap.xml`: все `<loc>` на `https://www.masterzabor.by/...`
- gtag ID на странице: `G-DT0TXHL4DM`

---

## 2. Поиск по проекту — результаты

### `https://masterzabor.by`

| Location | Категория |
|----------|-----------|
| `.cursorrules:24` | **SAFE** — документирует apex alias `307 → www` |
| `docs/PLAN.MD.md`, `docs/AUDIT-*.md`, `docs/ANALYTICS.md` | **Informational** — описание redirect/webhook constraints |
| Runtime `.ts/.tsx` | **Не найдено** |

### `masterzabor.by/api`

| Location | Категория |
|----------|-----------|
| Только docs (предупреждение «не использовать apex для webhook») | **Informational** |
| `lib/constants.ts` → `TELEGRAM_WEBHOOK_URL` | ✅ **www** |

### `SITE_URL` / `SITE_HOST`

```ts
// lib/constants.ts
export const SITE_URL = "https://www.masterzabor.by";
export const SITE_HOST = "www.masterzabor.by";
```

Единственный source of truth — `lib/constants.ts`. Env override **нет**. Все SEO-потребители идут через `SITE_URL`:

- `lib/seo.ts` — canonical, metadataBase, OG, Twitter, JSON-LD
- `app/sitemap.ts` — все URL sitemap
- `app/robots.ts` — host + sitemap
- `components/templates/CityPage.tsx` — city JSON-LD

### `canonical` / `sitemap` / `robots`

| File | Host | Status |
|------|------|--------|
| `lib/seo.ts:70-72` | www via `SITE_URL` | ✅ |
| `app/sitemap.ts` | www | ✅ live |
| `app/robots.ts:11-12` | www | ✅ live |
| `next.config.ts` | empty — no redirects | ✅ intentional |

### `G-DT0TXHL4DM`

| Location | Назначение |
|----------|------------|
| `.env.example:27` | Пример для `NEXT_PUBLIC_GA_ID` |
| `docs/PROGRESS.md:190` | Подтверждение Vercel Production |
| `app/layout.tsx:40,95-103` | Client gtag (browser) |
| **Не используется** в `lib/analytics/google.ts` | Server API использует **`GA_PROPERTY_ID`** (numeric) |

---

## 3. Классификация найденного

### ✅ SAFE — намеренный apex / brand usage

| Item | Why safe |
|------|----------|
| `lib/telegram.ts:65` — `"🔔 Новая заявка с сайта masterzabor.by!"` | Brand label, не URL; не влияет на SEO/webhook |
| Docs: «apex → 307 → www» | Operational documentation |
| `.cursorrules` apex alias line | Предупреждение для будущих изменений |
| `package.json` name `"masterzabor"` | NPM identifier |
| `public/manifest.webmanifest` — relative `start_url: "/"` | Resolves on current host (www) |

### ❌ MUST migrate to www

**В runtime-коде — ничего.** Все URL-critical paths уже на www.

Единственный optional cosmetic cleanup (не блокер):

- Telegram lead message: `masterzabor.by` → `www.masterzabor.by` для полной текстовой консистентности (низкий приоритет).

### 📋 Informational only

| Item | Note |
|------|------|
| `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md` § docs drift | Частично устарело: `.cursorrules` и `PLAN.MD.md` уже обновлены на www |
| `docs/PROGRESS.md:187` «без www» | Stale historical note (superseded `00feddf`) |
| `docs/PROGRESS.md:216` `CRON_SECRET` ⬜ | Operational checklist, не domain issue |

---

## 4. Telegram Analytics Reporting — deep dive

### Architecture

```
Telegram /traffic_*  OR  cron /api/cron/analytics-report
        │
        ▼
lib/analytics/reporting.ts  (Promise.allSettled — fail-safe)
        ├── getGa4Stats()      → lib/analytics/google.ts
        └── getYandexMetrikaStats() → lib/analytics/yandex.ts
```

### Property ID — что используется

**Два независимых идентификатора GA4:**

| Variable | Example | Layer | Purpose |
|----------|---------|-------|---------|
| `NEXT_PUBLIC_GA_ID` | `G-DT0TXHL4DM` | Browser (gtag) | Сбор hits на сайте |
| `GA_PROPERTY_ID` | `123456789` (numeric) | Server (Data API) | Telegram reports via `runReport` |

Server path в `lib/analytics/google.ts`:

```ts
function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const propertyId = process.env.GA_PROPERTY_ID;
  // ...
  return { propertyId, clientId, clientSecret, refreshToken };
}
```

API endpoint: `POST https://analyticsdata.googleapis.com/v1beta/properties/{GA_PROPERTY_ID}:runReport`

**Важно:** смена stream URL с apex на www в GA Admin **не затрагивает** Data API. API читает property-level data, не stream hostname.

### Required env variables (server-side GA)

| Variable | Required for Telegram GA block |
|----------|-------------------------------|
| `GA_PROPERTY_ID` | ✅ numeric property ID |
| `GOOGLE_CLIENT_ID` | ✅ OAuth |
| `GOOGLE_CLIENT_SECRET` | ✅ OAuth |
| `GOOGLE_REFRESH_TOKEN` | ✅ OAuth (stable after one-time setup) |

Client-only (не для Telegram reports):

- `NEXT_PUBLIC_GA_ID=G-DT0TXHL4DM` — уже подтверждён на live

Yandex (parallel block):

- `YANDEX_METRIKA_TOKEN`, `YANDEX_METRIKA_COUNTER_ID`

### Fallback / error handling

```ts
// lib/analytics/reporting.ts
const [googleResult, yandexResult] = await Promise.allSettled([
  getGa4Stats(days),
  getYandexMetrikaStats(days),
]);

if (googleResult.status === "rejected") {
  console.error("[analytics] Google request failed", googleResult.reason);
  warnings.push("⚠️ Google Analytics временно недоступен");
}
```

Поведение:

- Один источник падает → warning в Telegram, второй блок всё равно показывается
- Оба падают → «⚠️ Источники аналитики временно недоступны»
- Cron route: outer try/catch → «⚠️ Не удалось получить данные аналитики» только при total failure

Errors в `google.ts` логируются с prefix `[analytics]` и HTTP status + truncated body (до 500 chars).

---

## 5. Root-cause: «⚠️ Google Analytics временно недоступен»

### Что триггерит сообщение

Любой throw из `getGa4Stats()` → `Promise.allSettled` rejected → warning string. **Не связано** с domain/www migration.

### Наиболее вероятные причины (ranked)

| # | Cause | Evidence | Likelihood |
|---|-------|----------|------------|
| **1** | **Server GA env отсутствуют на Vercel Production** | `PROGRESS.md:208` — `GOOGLE_REFRESH_TOKEN` сохранён в `.env.local`; на Vercel явно подтверждены только `NEXT_PUBLIC_GA_ID` и `NEXT_PUBLIC_YM_ID` (`:190`) | **High** |
| **2** | **`GA_PROPERTY_ID` = Measurement ID** | Частая ошибка: подставить `G-DT0TXHL4DM` вместо numeric `123456789` → API 404/400 | **High** |
| **3** | **OAuth token invalid/revoked** | `invalid_grant`, expired testing-mode token, revoked app access | Medium |
| **4** | **Missing API scope / property access** | Refresh token без `analytics.readonly`; Google account без доступа к property | Medium |
| **5** | **GA4 Data API not enabled** | Google Cloud project | Low (работало локально) |
| **6** | **www stream URL change** | Stream URL affects collection hostname only, not Data API | **Unlikely / ruled out** |

### Diagnostic steps (Vercel Dashboard)

1. **Settings → Environment Variables → Production** — проверить наличие всех 4:
   - `GA_PROPERTY_ID` (digits only, из GA Admin → Admin → Property Settings → Property ID)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`

2. **Logs** после `/traffic` или cron `analytics-report`:
   - `[analytics] Google request failed`
   - Типичные body:
     - `GA_PROPERTY_ID is not configured` → env missing
     - `Google Analytics OAuth is not configured` → OAuth trio missing
     - `invalid_grant` → refresh token dead
     - `403 PERMISSION_DENIED` → scope/access
     - `404` → wrong property ID

3. **Cross-check:** если Yandex block в том же сообщении **есть**, а Google — warning → проблема точно в Google server env/OAuth, не в Telegram/webhook/domain.

---

## 6. Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Server GA env only in `.env.local`, not Vercel | **High** | Sync 4 vars to Production |
| `GA_PROPERTY_ID` confused with `G-DT0TXHL4DM` | **High** | Document mapping in Vercel notes |
| `CRON_SECRET` not set (`PROGRESS ⬜`) | Medium | Cron endpoints open if unset |
| Re-add `www→apex` redirect | **Critical** | Forbidden per `.cursorrules` |
| Webhook registered on apex | **Critical** | Already on www ✅ |
| Stale docs mislead future dev | Low | Doc sync only |
| OAuth refresh token one-time nature | Medium | Re-run OAuth flow if revoked |

---

## 7. Low-risk Cleanup Recommendations

**Без изменения redirects, webhook routing, Measurement ID, GA stream:**

| Priority | Action | Risk |
|----------|--------|------|
| P0 | Add `GA_PROPERTY_ID` + OAuth trio to Vercel Production | Config only |
| P0 | Verify property ID: GA Admin → Property Settings (numeric) | Config only |
| P1 | Check Vercel function logs after `/traffic_today` | Read-only |
| P1 | Set `CRON_SECRET` on Vercel if not done | Security |
| P2 | Optional logging enhancement in `reporting.ts`: log error **category** (missing_env / oauth / api) without secrets — behavior unchanged | Low |
| P3 | Cosmetic: `lib/telegram.ts:65` → `www.masterzabor.by` in lead header | UX text only |
| P3 | Update stale lines in `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md` § docs drift | Docs only |
| P3 | Add comment in `.env.example` that `GA_PROPERTY_ID ≠ NEXT_PUBLIC_GA_ID` | Docs only |

**Не рекомендуется:**

- Менять `SITE_URL` на apex
- Добавлять redirects в `next.config.ts`
- Создавать новый GA stream или менять `G-DT0TXHL4DM`
- Связывать GA warning с www migration — это red herring

---

## 8. Architecture Diagram (current stable state)

```mermaid
flowchart TB
    subgraph Browser
        WWW[www.masterzabor.by pages]
        GTAG[NEXT_PUBLIC_GA_ID G-DT0TXHL4DM]
        YM_TAG[NEXT_PUBLIC_YM_ID]
    end

    subgraph Vercel
        APEX[masterzabor.by] -->|307| WWW
        WH[POST /api/telegram-webhook on www]
        CRON[/api/cron/analytics-report]
    end

    subgraph SEO
        SITE_URL[SITE_URL = www]
        SITE_URL --> CANON[canonical / OG / JSON-LD]
        SITE_URL --> SM[sitemap.xml]
        SITE_URL --> RB[robots.txt Host]
    end

    subgraph TelegramReports
        WH --> REP[lib/analytics/reporting.ts]
        CRON --> REP
        REP --> GA_API[GA4 Data API via GA_PROPERTY_ID + OAuth]
        REP --> YM_API[Yandex Metrika API]
    end

    WWW --> GTAG
    WWW --> YM_TAG
```

---

## 9. Positive Findings

- **Single source of truth** для domain: `lib/constants.ts` — правильный паттерн
- **Fail-safe analytics**: `Promise.allSettled` — один источник не ломает весь report
- **Webhook safety**: comment + constant explain 307 constraint
- **Empty `next.config.ts`** — post-incident stable state preserved
- **No middleware host hacks** — reduces redirect loop risk
- **Structured error logging** in `google.ts` with status + truncated body

---

## 10. Final Checklist vs production confirmations

| Item | Code | Live | Match |
|------|------|------|-------|
| Vercel Primary = www | docs | manual ✅ | ✅ |
| Apex 307 → www | docs | manual ✅ | ✅ |
| Google canonical = www | `lib/seo.ts` | verified | ✅ |
| GSC sitemap = www | `app/sitemap.ts` | verified | ✅ |
| Yandex mirror = www | `SITE_HOST` | manual ✅ | ✅ |
| Telegram webhook = www | `TELEGRAM_WEBHOOK_URL` | manual ✅ | ✅ |
| GA4 stream URL → www | N/A in code | manual ✅ | ✅ (client) |
| Measurement ID unchanged | `NEXT_PUBLIC_GA_ID` | `G-DT0TXHL4DM` live | ✅ |
| Telegram GA reports | `GA_PROPERTY_ID` + OAuth | ⚠️ check Vercel env | **Action needed** |

---

## Bottom line

Domain/analytics **architecture полностью консистентна на www**. Предупреждение «Google Analytics временно недоступен» — это **server-side GA4 Data API configuration** (скорее всего missing/wrong env на Vercel), а не следствие apex→www migration или смены stream URL.

---

## Related docs

- `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md` — host/redirect/webhook audit
- `docs/ANALYTICS.md` — analytics architecture, env, cron, commands
- `.env.example` — production env checklist
- `lib/constants.ts` — `SITE_URL`, `SITE_HOST`, `TELEGRAM_WEBHOOK_URL`
