# SEO-DATA-01A: локальная диагностика Google Search Console

Этот инструмент собирает read-only снимок данных Search Console для
`masterzabor.by`. Он не меняет сайт, sitemap, настройки Google, индекс и не
отправляет URL на индексацию. GA4, Telegram и Vercel env не используются.

## Когда использовать

После отдельного approval OAuth-настройки запустите `doctor`, затем `snapshot`.
Обе команды работают на вашем компьютере и читают только `.env.gsc.local` в корне
проекта. Если файла или данных ещё нет, `doctor` сообщит об этом без вывода
секретов. Пока implementation review не завершён, OAuth-настройку **не запускать**.

## Что потребуется локально

После approval создайте `.env.gsc.local` из `.env.gsc.example` и заполните:

| Имя | Значение |
| --- | --- |
| `GSC_CLIENT_ID` | ID отдельного OAuth client для GSC. |
| `GSC_CLIENT_SECRET` | Secret этого client. |
| `GSC_REFRESH_TOKEN` | Refresh token только со scope `webmasters.readonly`. |
| `GSC_SITE_URL` | ID доступной Search Console property. Для проекта по умолчанию `sc-domain:masterzabor.by`. Допустим также `https://www.masterzabor.by/`, если доступна именно URL-prefix property. |

`.env.gsc.local` уже исключён из Git. Не копируйте эти значения в `.env.example`,
Vercel или чат. Не заменяйте существующие `GOOGLE_*` переменные GA4.

Требуется установленный Node.js с поддержкой `node:util.parseEnv` (проект локально
проверен на Node 24). Новые npm-пакеты не нужны.

## Команды

Из корня проекта:

```powershell
npm run seo:gsc:doctor
npm run seo:gsc:snapshot
```

`doctor` проверяет локальные имена настроек без показа значений, обновляет access
token, вызывает `sites.list`, показывает доступные property и права, проверяет
выбранную `GSC_SITE_URL` и наличие отправленного sitemap. Завершение — понятный
`PASS` или `FAIL`. Если property нет в списке, инструмент не пытается молча
использовать другую.

`snapshot` снова проверяет property, скачивает
`https://www.masterzabor.by/sitemap.xml`, извлекает уникальные canonical `<loc>`,
читает состояние отправленного sitemap через GSC API и три набора Search Analytics:
страницы за 28 и 90 дней, пары запрос+страница за 90 дней. Это финализированные
данные `web`; оба периода заканчиваются тремя днями до текущей даты по Pacific
Time, чтобы уменьшить риск ещё не готовых данных. Пагинация идёт до последней
страницы ответа. Search Analytics может не показывать некоторые строки; отсутствие
строки **не означает**, что URL не проиндексирован.

Затем команда последовательно вызывает URL Inspection для каждого URL sitemap.
Она использует данные известной Google версии, а не live test. При временных
ошибках действует ограниченный retry/backoff. Ошибка отдельного URL записывается
в результат и не останавливает остальные проверки. В snapshot остаются исходные
семантические состояния Google (`verdict`, `coverageState`, `indexingState` и др.),
без выдуманного поля `indexed=true`. `complete=true` означает, что каждый URL
получил результат **или явную ошибку**, а не то, что все инспекции успешны.

Один JSON-файл появляется только в `.tmp/seo/` под именем
`gsc-snapshot-<UTC timestamp>.json`. В нём есть `schemaVersion`, `capturedAt`,
`siteUrl`, `sitemap`, `searchAnalytics`, `urlInspection.results` и `summary`.
`.tmp/` уже исключена из Git. Файл может содержать поисковые запросы и URL;
храните его локально и передавайте только осознанно.

## Типовые ошибки

| Сообщение/статус | Что проверить |
| --- | --- |
| `MISSING_LOCAL_ENV` / `MISSING_GSC_CONFIG` | Файл `.env.gsc.local` и три отдельные GSC OAuth-переменные; не присылайте их в чат. |
| OAuth `invalid_grant` или HTTP 401 | Refresh token отозван/истёк либо client ID/secret не соответствуют token. |
| HTTP 403 / `PROPERTY_NOT_ACCESSIBLE` | Нужный Google-аккаунт имеет доступ к GSC property? Выбран точный ID property? Search Console API включён в Cloud project? |
| HTTP 429 / quota | Подождать до сброса лимита; не запускать обход повторно подряд. Search Analytics также имеет отдельный load quota. |
| `SITEMAP_NOT_SUBMITTED` | Проверить отправленный sitemap именно у выбранной property в Search Console. |
| Отдельные failed inspections | Посмотреть `error` соответствующих URL в JSON; остальные URL должны остаться в файле. |

Не пересылайте полный терминальный вывод вместе с `.env.gsc.local`; сам CLI не
печатает client secret, refresh token или access token.

## OAuth setup — DO NOT RUN UNTIL IMPLEMENTATION REVIEW IS APPROVED

Это подготовленные шаги на будущее, не просьба выполнить их сейчас.

1. В Google Cloud project включить **Search Console API**. Не менять GA4 OAuth
   client, GA4 refresh token и Vercel env.
2. Создать **отдельный** OAuth client типа *Web application* для GSC. Для
   авторизации через OAuth Playground добавить redirect URI
   `https://developers.google.com/oauthplayground`.
3. Проверить статус consent screen. В External/Testing refresh token для этого
   scope обычно истекает через семь дней; переход к долговременному режиму
   согласовать отдельно, не меняя текущую GA4 настройку вслепую.
4. В OAuth Playground включить *Use your own OAuth credentials*, указать новый
   client ID/secret, запросить **только**
   `https://www.googleapis.com/auth/webmasters.readonly` и подтвердить доступ
   Google-аккаунтом с правами на нужную Search Console property.
5. Полученный refresh token вместе с новым client ID/secret сохранить только
   в локальном `.env.gsc.local`. Не вставлять токен в чат, Git или Vercel.
6. Запустить `doctor`. Только после `PASS` запускать `snapshot`.

Для авторизации нужны действия владельца Google-аккаунта. Сам скрипт не создаёт
OAuth credentials и не запрашивает согласие автоматически.

## Чего инструмент не заменяет

Официальный Search Console API не предоставляет Links report. Полный отчёт о
внешних/внутренних ссылках при необходимости экспортируется вручную из интерфейса
Search Console. `referringUrls` отдельной URL Inspection, если Google его вернул,
не является заменой Links report.

Sitemaps API показывает состояние отправки/обработки sitemap, но поле
`contents.indexed` устарело и не используется как число индексированных URL.
URL Inspection API не проводит live test, не отправляет Request Indexing и не
изменяет статус индексации.
