# SEO-DATA-01A: локальная диагностика Google Search Console

Этот инструмент собирает read-only снимок данных Search Console для
`masterzabor.by`. Он не меняет сайт, sitemap, настройки Google, индекс и не
отправляет URL на индексацию. GA4, Telegram и Vercel env не используются.

## Когда использовать

Рабочий порядок: запустите `doctor`, проверьте `PASS`, затем запустите `snapshot`.
Обе команды работают локально и читают только `.env.gsc.local` в корне проекта.
Если файла или данных нет, `doctor` сообщит об этом без вывода секретов. Первый
полный snapshot уже получен; повторный запуск создаёт новый локальный JSON-файл.

## Что потребуется локально

На текущем компьютере `.env.gsc.local` уже настроен. При настройке на другом
компьютере создайте его из `.env.gsc.example` и заполните:

| Имя | Значение |
| --- | --- |
| `GSC_CLIENT_ID` | ID отдельного OAuth client для GSC. |
| `GSC_CLIENT_SECRET` | Secret этого client. |
| `GSC_REFRESH_TOKEN` | Refresh token только со scope `webmasters.readonly`. |
| `GSC_SITE_URL` | ID доступной Search Console property. Для проекта по умолчанию `sc-domain:masterzabor.by`. Допустим также `https://www.masterzabor.by/`, если доступна именно URL-prefix property. |

`.env.gsc.local` уже исключён из Git. Не копируйте эти значения в `.env.example`,
Vercel или чат. Не заменяйте существующие `GOOGLE_*` переменные GA4.

Действующая конфигурация: отдельный Google Cloud project `masterzabor-gsc`, OAuth
client `MasterZabor GSC Tools`, тип приложения External, publishing status
**In production**. Используется только scope
`https://www.googleapis.com/auth/webmasters.readonly`. Production refresh token
получен после перевода приложения в этот статус. GA4 OAuth не переиспользуется.

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

Последний подтверждённый `doctor`: `PASS` для `sc-domain:masterzabor.by` с
`permissionLevel=siteFullUser`. Отправленный sitemap найден:
`pending=false`, `errors=0`, `warnings=0`,
`lastDownloaded=2026-09-25T04:56:21.952Z`.

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

## OAuth: восстановление доступа

Если `doctor` сообщает об истёкшем или отозванном refresh token, проверьте
ошибку до перевыпуска. Для восстановления используйте тот же GSC OAuth client
ID/secret; GA4 client и его token не меняйте.

1. Убедитесь, что выбран project `masterzabor-gsc`, а приложение External имеет
   publishing status **In production**. Не создавайте новый client без отдельной
   причины.
2. В OAuth Playground включите *Use your own OAuth credentials*, укажите
   действующий GSC client ID/secret и запросите **только**
   `https://www.googleapis.com/auth/webmasters.readonly`. Подтвердите доступ
   Google-аккаунтом с правами на нужную Search Console property. Для этого
   client настроен redirect URI `https://developers.google.com/oauthplayground`.
3. Обменяйте authorization code на tokens в OAuth Playground и возьмите новый
   refresh token. Не копируйте его в чат или документацию.
4. Сохраните новый refresh token только в `GSC_REFRESH_TOKEN` локального
   `.env.gsc.local`. `GSC_CLIENT_ID` и `GSC_CLIENT_SECRET` не меняйте. Не
   вставляйте token в чат, Git или Vercel.
5. Запустите `doctor`. После `PASS` можно запустить `snapshot`.

Для авторизации нужны действия владельца Google-аккаунта. Сам скрипт не создаёт
OAuth credentials и не запрашивает согласие автоматически.

## Публичные страницы для Google OAuth branding

[Описание MasterZabor GSC Tools](https://www.masterzabor.by/google-api-access)
ведёт на [политику конфиденциальности](https://www.masterzabor.by/google-api-privacy)
и [правила использования](https://www.masterzabor.by/google-api-terms).
Страницы доступны без входа,
проверены в Production и не входят в sitemap. Они не запускают GSC-команды и
не дают посетителям доступ к OAuth credentials или локальным снимкам.

## Чего инструмент не заменяет

Официальный Search Console API не предоставляет Links report. Полный отчёт о
внешних/внутренних ссылках при необходимости экспортируется вручную из интерфейса
Search Console. `referringUrls` отдельной URL Inspection, если Google его вернул,
не является заменой Links report.

Sitemaps API показывает состояние отправки/обработки sitemap, но поле
`contents.indexed` устарело и не используется как число индексированных URL.
URL Inspection API не проводит live test, не отправляет Request Indexing и не
изменяет статус индексации.
