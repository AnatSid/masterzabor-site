# Google OAuth Recovery — GOOGLE_REFRESH_TOKEN

**Дата:** 28.05.2026  
**Root cause (confirmed):** Vercel logs → `[analytics] Google OAuth token request failed status=400 invalid_grant Token has been expired or revoked`  
**Affected env:** `GOOGLE_REFRESH_TOKEN` on Vercel Production  
**Not affected:** `GA_PROPERTY_ID`, `NEXT_PUBLIC_GA_ID` (`G-DT0TXHL4DM`), analytics integration code, GA stream.

---

## 1. Текущее состояние OAuth setup в проекте

### Что есть сейчас

| Artifact | Status | Location |
|----------|--------|----------|
| Runtime OAuth integration | ✅ Active | `lib/analytics/google.ts` |
| Traffic reporting | ✅ Active | `lib/analytics/reporting.ts` |
| Env checklist | ✅ | `.env.example` |
| Architecture docs | ✅ | `docs/ANALYTICS.md` |
| Domain/analytics audit | ✅ | `docs/AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md` |
| Telegram bot setup script | ✅ (webhook only) | `scripts/set-telegram-bot.ts` |

### Чего больше нет в репозитории

| Artifact | Status | Notes |
|----------|--------|-------|
| `app/api/debug/google/route.ts` | ❌ Removed | commit `a7ba546` — never committed to git history |
| `app/api/debug/google/oauth/route.ts` | ❌ Removed | local-only OAuth flow, удалён до production commit |
| OAuth recovery script | ❌ Never existed | recovery — manual via OAuth Playground (ниже) |
| README OAuth section | ❌ | только `docs/ANALYTICS.md` + этот runbook |

### Как OAuth работал изначально (май 2026)

1. Локально поднимался `npm run dev` на `http://localhost:3000`
2. Временный endpoint `GET /api/debug/google/oauth`:
   - scope: `https://www.googleapis.com/auth/analytics.readonly`
   - redirect URI: `http://localhost:3000/api/debug/google/oauth`
   - `access_type=offline`, `prompt=consent`
3. После Google redirect endpoint обменивал `code` → tokens и писал `GOOGLE_REFRESH_TOKEN` в `.env.local`
4. Проверка: `/api/debug/google`, Telegram `/traffic`
5. Debug endpoints удалены; token остался только в `.env.local`, на Vercel мог быть не синхронизирован или истёк

### Runtime flow (не менять)

```
getGa4Stats()
  → POST https://oauth2.googleapis.com/token
       grant_type=refresh_token
       client_id=GOOGLE_CLIENT_ID
       client_secret=GOOGLE_CLIENT_SECRET
       refresh_token=GOOGLE_REFRESH_TOKEN
  → POST https://analyticsdata.googleapis.com/v1beta/properties/{GA_PROPERTY_ID}:runReport
```

---

## 2. Google Cloud — что используется

### OAuth Client

- **Client ID / Secret:** значения из Vercel env `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`
- **Где найти:** [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** → OAuth 2.0 Client IDs
- **Тип client:** Web application (использовался с localhost redirect)
- **GCP project (historical):** `masterzabor-analytics` (из deprecated service account `masterzabor-analytics-reader@masterzabor-analytics.iam.gserviceaccount.com`)

> Client ID и Secret **не менять** — только перевыпустить refresh token для существующего client.

### Required OAuth scope (exact)

```
https://www.googleapis.com/auth/analytics.readonly
```

Другие scopes **не нужны**. Код не запрашивает и не использует другие.

### Required API

Google Cloud Console → **APIs & Services** → **Library** → включить:

- **Google Analytics Data API**

### Redirect URIs (для recovery)

Добавить в OAuth client → **Authorized redirect URIs** (если ещё нет):

| URI | Когда нужен |
|-----|-------------|
| `https://developers.google.com/oauthplayground` | **Recovery через OAuth Playground (рекомендуется сейчас)** |
| `http://localhost:3000/api/debug/google/oauth` | Только если когда-нибудь вернёте local debug endpoint |

---

## 3. Почему token expired — testing mode

### Наиболее вероятная причина `invalid_grant`

OAuth consent screen в режиме **Testing**:

- Refresh tokens, выданные в Testing mode, **истекают через 7 дней**
- Первый рабочий token: ~20.05.2026
- Ошибка на production: ~28.05.2026 → **~8 дней** → совпадает с 7-day testing expiry

### Другие причины `invalid_grant`

| Cause | Check |
|-------|-------|
| Token revoked manually | [Google Account → Third-party access](https://myaccount.google.com/permissions) |
| Re-authorized same client >100 times | Google invalidates oldest refresh tokens |
| Wrong `GOOGLE_CLIENT_ID`/`SECRET` pair on Vercel | Token issued for different client |
| Password/account security event | Re-auth required |

### Как сделать refresh token стабильнее

1. **OAuth consent screen → Publish app → Production**
   - Testing → refresh tokens expire in 7 days
   - Production → refresh tokens **не имеют 7-day limit** (при normal use)
2. **Не перевыпускать token без необходимости** — каждый новый consent может инвалидировать старые
3. **Один Google account** с доступом к GA4 property — тот же, что авторизует OAuth
4. **Не удалять app** из Google Account permissions без плана замены token
5. Scope `analytics.readonly` — sensitive; для External app в Production Google может запросить verification, но для **single-user internal use** (свой аккаунт) обычно достаточно Publish без широкой аудитории
6. **Хранить backup** нового refresh token в password manager (не в git)

---

## 4. Exact Recovery Procedure

### Prerequisites

- [ ] Доступ к Google Cloud project с OAuth client
- [ ] Google account с **Viewer+** доступом к GA4 property (`GA_PROPERTY_ID`)
- [ ] Значения из Vercel: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GA_PROPERTY_ID`
- [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` **не менять**

---

### Step A — Google Cloud prep (5 min)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select project (e.g. `masterzabor-analytics`)
3. **APIs & Services → Library** → enable **Google Analytics Data API**
4. **APIs & Services → OAuth consent screen**:
   - If **Testing**: add your Google email to **Test users**
   - **Recommended:** click **Publish App** → move to **Production** (prevents 7-day expiry)
5. **APIs & Services → Credentials** → your OAuth 2.0 Client ID:
   - Add redirect URI: `https://developers.google.com/oauthplayground`
   - Save

---

### Step B — Get new refresh token via OAuth Playground (10 min)

1. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click **gear icon** (OAuth 2.0 configuration):
   - ✅ Check **Use your own OAuth credentials**
   - **OAuth Client ID:** paste `GOOGLE_CLIENT_ID` from Vercel
   - **OAuth Client secret:** paste `GOOGLE_CLIENT_SECRET` from Vercel
   - Close settings
3. **Step 1 — Select & authorize APIs:**
   - In "Input your own scopes" field paste:
     ```
     https://www.googleapis.com/auth/analytics.readonly
     ```
   - Click **Authorize APIs**
   - Sign in with Google account that has GA4 property access
   - Grant consent
4. **Step 2 — Exchange authorization code for tokens:**
   - Click **Exchange authorization code for tokens**
   - In response JSON find **`refresh_token`**
   - Copy the full value (starts with `1//...`)

> ⚠️ `refresh_token` appears only when `access_type=offline` + fresh consent. Playground handles this automatically on first consent after `prompt=consent` equivalent. If no `refresh_token` in response — revoke app access at [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and repeat Step B.

---

### Step C — Verify token locally before Vercel (2 min)

PowerShell / curl — replace placeholders:

```powershell
$body = @{
  client_id     = "YOUR_GOOGLE_CLIENT_ID"
  client_secret = "YOUR_GOOGLE_CLIENT_SECRET"
  refresh_token = "YOUR_NEW_REFRESH_TOKEN"
  grant_type    = "refresh_token"
}
Invoke-RestMethod -Method Post -Uri "https://oauth2.googleapis.com/token" -Body $body
```

**Expected:** JSON with `access_token`, `expires_in`, `token_type: Bearer`  
**Failure:** `{"error":"invalid_grant",...}` → repeat Step B or check client credentials

Optional — test GA4 API (replace `PROPERTY_ID` and `ACCESS_TOKEN`):

```powershell
$headers = @{ Authorization = "Bearer ACCESS_TOKEN"; "Content-Type" = "application/json" }
$reportBody = '{"dateRanges":[{"startDate":"today","endDate":"today"}],"metrics":[{"name":"activeUsers"}]}'
Invoke-RestMethod -Method Post -Uri "https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runReport" -Headers $headers -Body $reportBody
```

**Expected:** JSON with `rows` (may be empty if no traffic today — that's OK)

---

### Step D — Update Vercel env (3 min)

1. [Vercel Dashboard](https://vercel.com/) → project **masterzabor** → **Settings** → **Environment Variables**
2. Update **only**:
   - `GOOGLE_REFRESH_TOKEN` = new refresh token from Step B
3. **Do NOT change:**
   - `GA_PROPERTY_ID`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_GA_ID`
4. Scope: **Production** (and Preview if you test analytics there)
5. **Redeploy** production (env changes require redeploy on Vercel):
   - Deployments → latest → **Redeploy**  
   - or push empty commit / manual redeploy

Optional — sync local `.env.local` with same token for local dev consistency.

---

### Step E — Verify Telegram analytics works (5 min)

#### 1. Vercel Logs

Trigger report, then check **Functions → Logs**:

- Send Telegram command `/traffic_today` (or `/traffic`)
- **Expected:** no `[analytics] Google OAuth token request failed`
- **Expected:** no `invalid_grant`

#### 2. Telegram message

**Expected format (Google block present, no warning):**

```
📈 Трафик сайта за …

GOOGLE ANALYTICS:
👥 Пользователи: X

🔥 Топ страницы:

1. / — …
2. …
3. …

📱 Mobile: …%
💻 Desktop: …%

ЯНДЕКС.МЕТРИКА:
…
```

**Must NOT appear:** `⚠️ Google Analytics временно недоступен`

#### 3. Extended check

- `/traffic_week` — Google block for 7 days
- Wait for cron `analytics-report` (20:00 Minsk) or manually hit `/api/cron/analytics-report` with `Authorization: Bearer CRON_SECRET`

#### 4. Cron manual test (optional)

```powershell
Invoke-WebRequest -Uri "https://www.masterzabor.by/api/cron/analytics-report" -Headers @{ Authorization = "Bearer YOUR_CRON_SECRET" }
```

Expected: `{"success":true}` + Telegram message with Google block.

---

## 5. Env variables reference

### Update on recovery

| Variable | Action |
|----------|--------|
| `GOOGLE_REFRESH_TOKEN` | **REPLACE** with new token |

### Keep unchanged

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | OAuth client (same pair as secret) |
| `GOOGLE_CLIENT_SECRET` | OAuth client |
| `GA_PROPERTY_ID` | Numeric GA4 property ID (NOT `G-DT0TXHL4DM`) |
| `NEXT_PUBLIC_GA_ID` | Browser gtag (`G-DT0TXHL4DM`) |
| `YANDEX_METRIKA_*` | Yandex block (independent) |
| `TELEGRAM_*`, `CRON_SECRET`, `KV_*` | Unrelated |

### Deprecated — do not set

| Variable | Status |
|----------|--------|
| `GOOGLE_CLIENT_EMAIL` | Removed from code |
| `GOOGLE_PRIVATE_KEY` | Removed from code |

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `invalid_grant` after Playground | Wrong client id/secret pair; re-do Step B with Vercel values |
| No `refresh_token` in Playground response | Revoke app at myaccount.google.com/permissions → repeat with fresh consent |
| `403 PERMISSION_DENIED` on runReport | Google account lacks GA4 property access; check GA Admin → Property Access Management |
| `404` on runReport | Wrong `GA_PROPERTY_ID` (don't change unless confirmed wrong) |
| Token works locally but not Vercel | Redeploy after env update; check Production env scope |
| Google block missing, Yandex OK | Only Google env broken — focus on refresh token |
| `403 access_denied` in browser | Add email to Test users OR Publish app |
| Token expires again in ~7 days | OAuth app still in **Testing** — Publish to Production |

---

## 7. Quick checklist

```
[ ] Google Analytics Data API enabled
[ ] OAuth consent screen: Test user added OR app Published to Production
[ ] Redirect URI: https://developers.google.com/oauthplayground added
[ ] New refresh_token obtained via OAuth Playground
[ ] Local token exchange test passed (no invalid_grant)
[ ] GOOGLE_REFRESH_TOKEN updated on Vercel Production
[ ] Production redeployed
[ ] /traffic_today in Telegram → GOOGLE ANALYTICS block, no warning
[ ] Vercel logs clean (no invalid_grant)
```

---

## Related docs

- `docs/ANALYTICS.md` — analytics architecture
- `docs/AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md` — domain + GA env audit
- `.env.example` — env variable reference
- `lib/analytics/google.ts` — runtime OAuth implementation (do not modify for recovery)
