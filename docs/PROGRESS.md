# Прогресс разработки masterzabor.by

Этот файл ведёт Cursor. После каждого шага — обновить статус.

---

## Промпт 1: Инициализация проекта
- ✅ Next.js 15 + TypeScript + Tailwind CSS v4 настроены
- ✅ lib/constants.ts — данные компании
- ✅ lib/seo.ts — SEO-хелперы (metadata, JSON-LD)
- ✅ lib/telegram.ts — отправка в Telegram
- ✅ content/cities.ts — 40 городов с падежами и координатами
- ✅ content/services.ts — 6 услуг с данными
- ✅ Шрифт Inter подключён
- ✅ Базовый metadata в layout.tsx

## Промпт 2: Layout (шапка, подвал, кнопки)
- ✅ Header: sticky, навигация, телефон, мессенджеры, бургер
- ✅ Footer: 4 колонки, контакты, УНП
- ✅ FloatingButtons: мобильные кнопки позвонить/написать
- ✅ JSON-LD LocalBusiness в layout
- ✅ Geo-метатеги в layout

## Промпт 3: Главная страница
- ✅ Hero секция с h1, CTA
- ✅ Блок доверия (4 карточки)
- ✅ Типы заборов (3 карточки)
- ✅ Ворота и калитки (3 карточки)
- ✅ Квиз-калькулятор (6 шагов)
- ✅ Примеры работ
- ✅ Отзывы
- ✅ География (40 городов)
- ✅ Форма заявки
- ✅ FAQ + JSON-LD FAQPage

## Промпт 4: Страницы услуг (6 штук)
- ✅ ServicePage компонент-шаблон
- ✅ /zabory-iz-profnastila/
- ✅ /zabory-iz-evroshtaketnika/
- ✅ /zabory-iz-setki-rabitsy/
- ✅ /vorota-raspashnye/
- ✅ /vorota-otkatnye/
- ✅ /kalitki/

## Промпт 5: Городские страницы (40 штук)
- ✅ CityPage компонент-шаблон
- ✅ app/[city]/page.tsx с generateStaticParams
- ✅ Все города из content/cities.ts рендерятся
- ✅ Уникальные title/description для каждого
- ✅ Geo-метатеги для каждого города
- ✅ Перелинковка с соседними городами

## Промпт 6: API заявок → Telegram
- ✅ app/api/lead/route.ts
- ✅ Валидация (имя, телефон)
- ✅ Rate limiting
- ✅ Отправка в Telegram
- ✅ Env переменные документированы

## Промпт 7: Формы
- ✅ LeadForm (simple + full варианты)
- ✅ QuizForm (6 шагов, прогресс-бар)
- ✅ React Hook Form подключён
- ✅ Состояния: loading, success, error

## Промпт 8: Блог
- ✅ content/blog-posts.ts — 3 статьи
- ✅ app/blog/page.tsx — список
- ✅ app/blog/[slug]/page.tsx — статья
- ✅ JSON-LD Article

## Промпт 9: Цены, Портфолио, Отзывы, Контакты
- ✅ /tseny/
- ✅ /nashi-raboty/
- ✅ /otzyvy/
- ✅ /kontakty/

## Промпт 10: Sitemap, robots, аналитика
- ✅ app/sitemap.ts (все ~40 URL)
- ✅ app/robots.ts
- ✅ Яндекс.Метрика (условно через env)
- ✅ Google Analytics (условно через env)

## Промпт 11: Счётчик заявок + аналитика
- ✅ Vercel KV подключён
- ✅ Заявки сохраняются в KV при отправке
- ✅ GET /api/stats — endpoint статистики
- ✅ Ежедневная сводка в Telegram (Vercel Cron)
- ✅ (Опционально) Telegram-бот команды /stats, /top

## Промпт 12: Единый QuizForm на внутренних страницах
- ✅ Основные формы на страницах услуг, городов, контактов, цен и блога переведены с `LeadForm` full на `QuizForm`
- ✅ Для услуг добавлен предвыбор в квизе: тип забора/ворот/калитки по slug страницы
- ✅ Для заборных услуг добавлен старт квиза со 2 шага при предвыбранном типе
- ✅ Для городских страниц город автоподставляется в поле населённого пункта и остаётся редактируемым
- ✅ Под полем населённого пункта добавлена подсказка: «Укажите ваш населённый пункт, если он отличается»

## Telegram-аналитика трафика (отдельно от lead-report)
- ✅ Реализована отдельная Telegram-аналитика трафика:
- ✅ Google Analytics 4 API
- ✅ Яндекс.Метрика API
- ✅ отдельный analytics-report cron
- ✅ top 3 pages
- ✅ mobile/desktop статистика
- ✅ Telegram команды /traffic и /traffic week
- ✅ fail-safe обработка ошибок аналитики
- ✅ Консистентность форм: placeholder населённого пункта везде «Город, деревня или посёлок», комментарий с пометкой «Необязательно» и пустым placeholder

## Единая вертикальная сетка городских страниц
- ✅ Добавлен `components/layout/SiteContainer.tsx` — общий контейнер `max-w-[1350px]` + `px-4 sm:px-6 lg:px-8`
- ✅ `CityPage`: hero, intro, секции карточек, форма и «Другие города» переведены на `SiteContainer` (убраны смешанные `max-w-7xl` / `max-w-[1350px]`)
- ✅ Hero city pages: grid `minmax(0,1.45fr)_minmax(300px,380px)`, текстовая колонка без `max-w-3xl`, intro-текст расширен до `max-w-5xl`
- ✅ UX-проверка: `/molodechno`, `/gomel`, `/brest` — единая линия контента, `npm run build` проходит
- ✅ Trust-card «Бесплатная доставка» на главной: подпись заменена с «по Гомелю и области» на «Организуем доставку и монтаж под ключ» (нейтральная формулировка для всей РБ)

## Единая premium-layout система service pages
- ✅ `ServicePage`: все секции переведены на `SiteContainer` (`max-w-[1350px]`), убраны смешанные `max-w-7xl` / `max-w-4xl`
- ✅ SEO/article block: `serviceProseClassName` (`max-w-[960px]`, `leading-[1.75]`) — комфортная ширина чтения, выравнивание по левому краю контейнера
- ✅ Hero subtitle: опциональное поле `heroSubtitle` в `content/services.ts` (lead + accent-line); применено для сетки-рабицы
- ✅ Hero grid: `minmax(0,1.45fr)_minmax(280px,420px)`, стабильная картинка с `aspect-ratio`
- ✅ FAQ на полную ширину контейнера; проверены `/zabory-iz-setki-rabitsy`, `/zabory-iz-profnastila`, `/zabory-iz-evroshtaketnika`

---

## Проблемы и заметки
- ✅ Промпт 1 завершён. Файл плана найден как `docs/PLAN.MD.md` вместо `docs/PLAN.md`.
- ⚠️ `npm install` показывает 2 moderate vulnerabilities в зависимостях; `npm audit fix --force` не запускался, чтобы не вносить потенциально ломающие обновления.
- ✅ `npm run build` проходит на Next.js 15.5.18.
- ✅ Промпт 2 завершён: добавлены Header, Footer, FloatingButtons, LocalBusiness JSON-LD и geo-метатеги.
- ✅ `eslint-config-next` выровнен на 15-ю версию, чтобы сборка не выводила предупреждение о несовместимости ESLint-конфига.
- ✅ `npm run build` и `npm run lint` проходят без ошибок.
- ✅ Промпт 3 завершён: главная страница собрана по структуре из плана, добавлены ProductCard, QuizForm и LeadForm.
- ✅ Расхождение по количеству городов устранено: план, контент и главная синхронизированы на 40 городов.
- ✅ После Промпта 3 `npm run build` и `npm run lint` проходят без ошибок.
- ✅ Обновлены бизнес-правила в `.cursorrules` и `docs/PLAN.MD.md`: вместо «бесплатного замера» используем бесплатный расчёт стоимости.
- ✅ Главная страница и формы обновлены под новые правила: тексты про замер заменены на расчёт, Минск и Минская область объединены в одну группу.
- ✅ После правок бизнес-правил `npm run build` и `npm run lint` проходят без ошибок.
- ✅ Промпт 4 завершён: добавлен `components/templates/ServicePage.tsx`, созданы 6 страниц услуг, добавлены Product/FAQ/Breadcrumb JSON-LD, таблица цен, этапы, галерея, SEO-текст, перелинковка и full-форма заявки.
- ✅ После Промпта 4 `npm run build` и `npm run lint` проходят без ошибок.
- ✅ Промпт 5 завершён: добавлен `components/templates/CityPage.tsx`, создан динамический роут `app/[city]/page.tsx`, настроены `generateStaticParams`, `dynamicParams = false`, metadata, geo-метатеги, LocalBusiness/Breadcrumb JSON-LD и перелинковка по городам области.
- ✅ Промпт 5 и `content/cities.ts` синхронизированы: динамический роут генерирует 40 городских страниц.
- ✅ После Промпта 5 `npm run build` и `npm run lint` проходят без ошибок.
- ✅ Промпт 6 завершён: добавлен API `/api/lead`, серверная валидация белорусского телефона, rate limiting 5 заявок/мин на IP, отправка заявок в Telegram и `.env.example`.
- ✅ `.env.local` добавлен локально и защищён существующим `.gitignore` (`.env*.local`, `.env`).
- ✅ В `docs/PLAN.MD.md` исправлены оставшиеся старые формулировки про бесплатный замер на бесплатный расчёт стоимости.
- ✅ После Промпта 6 `npm run lint`, `npm run build` и тестовый POST на `/api/lead` проходят успешно; API вернул `{ success: true }`.
- ✅ Корректировки между Промптом 6 и 7:
  - Квиз: добавлена кнопка «Не знаю, нужна консультация» на шаге высоты.
  - Телефон: маска +375 с флагом, пользователь вводит 9 цифр.
  - Перезвон: «в течение рабочего дня» вместо «15 минут».
  - Формы: добавлены поля «Населённый пункт» и «Комментарий».
  - API: пустые поля не показываются в Telegram, добавлено поле city.
  - Рассрочка: корректная формулировка «оплата частями, работаем с 8 банками».
  - Города: расширен список с 27 до 40 (добавлены по всем областям).
  - PLAN.MD.md обновлён для синхронизации с .cursorrules.
- ✅ В план добавлен Промпт 11 (Vercel KV, статистика заявок и ежедневная Telegram-сводка) для выполнения после запуска.
- ✅ Git подключён, репозиторий: github.com/AnatSid/masterzabor-site, правила коммитов добавлены в .cursorrules.
- ✅ Промпт 7 завершён полностью: LeadForm и QuizForm приведены к требованиям плана (маска +375, cityName, шаг «Не знаю», финальные поля, fade-анимация), `npm run build` и `npm run lint` проходят.
- ✅ Квиз и формы скорректированы: единый стиль карточек доверия, добавлен шаг «Калитка», обновлены тексты контактов, добавлены SVG/placeholder на шагах и ориентировочная стоимость для менеджера в Telegram.
- ✅ Telegram-ориентир уточнён для прозрачности: в строках «Ворота» и «Калитка» теперь явно показывается выбранная клиентом опция в скобках (например, «Ворота (Распашные)», «Калитка (Калитка с замком)»).
- ✅ Промпт 8 завершён: добавлен `content/blog-posts.ts` с 3 статьями (content в HTML, meta/excerpt/date/image/tags), созданы страницы `/blog/` и `/blog/[slug]/` с `generateStaticParams`, `generateMetadata`, хлебными крошками, сайдбаром, CTA и `LeadForm`.
- ✅ Для блога добавлены JSON-LD схемы `Article` и `BreadcrumbList` на странице каждой статьи.
- ✅ Промпт 9 завершён: добавлены страницы `/tseny/`, `/nashi-raboty/`, `/otzyvy/`, `/kontakty/` с отдельным SEO metadata, хлебными крошками, внутренней перелинковкой и контентом по плану.
- ✅ Для `/tseny/` добавлены таблицы цен по категориям, пометка «цены ориентировочные», CTA-форма и JSON-LD Product; для `/kontakty/` добавлены реквизиты, Google Maps iframe и `LeadForm` в варианте `full`.
- ✅ Промпт 10 завершён: обновлён `app/sitemap.ts` (главная, услуги, города, блог, внутренние страницы с нужными `priority`/`changeFrequency`), добавлен `app/robots.ts` (Allow `/`, Disallow `/api/`, `sitemap`, `host`).
- ✅ В `app/layout.tsx` добавлено условное подключение Яндекс.Метрики (`NEXT_PUBLIC_YM_ID`) и Google Analytics (`NEXT_PUBLIC_GA_ID`) через `next/script` со стратегией `afterInteractive`; `.env.example` дополнен новыми переменными.
- ✅ Промпт 11 завершён (без опционального webhook-бота): подключён `@vercel/kv`, API `/api/lead` сохраняет заявки в KV (`leads:YYYY-MM-DD`), добавлен защищённый `/api/stats?period=today|week|month` с агрегациями `totalLeads/bySource/byCity/byDay`.
- ✅ Добавлен `app/api/cron/daily-report/route.ts` и `vercel.json` (cron `0 17 * * *`, 20:00 Минск): в Telegram отправляется ежедневная сводка (за день + топ страница + топ город + итого за месяц), `.env.example` дополнен `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `STATS_API_TOKEN`, `CRON_SECRET`.
- ✅ Cron-сводка переведена на 20:00 по Минску (вместо 21:00): данные берутся на момент 20:00 и сразу отправляются в Telegram.
- ✅ Проведена E2E-проверка Промпта 11: тестовая заявка через `/api/lead` успешно сохраняется в KV и отправляется в Telegram; `/api/stats` и `/api/cron/daily-report` возвращают корректные данные.
- ✅ Для наглядной проверки аналитики очищены тестовые данные и заложен сценарий из 8 заявок с повторяющимися городами/источниками (явные топы по странице и городу).
- ⚠️ После `vercel env pull` локальный `.env.local` может перезаписываться и терять пользовательские переменные (Telegram/KV/токены); перед тестами проверять наличие нужных env.
- ✅ Для аналитики «топ город» добавлена нормализация по `source` (`city-{slug}`) вместо поля `city` из формы: это делает статистику устойчивой к свободному вводу и опечаткам в населённом пункте.
- ✅ По решению UX Telegram-сводка упрощена: строка «Топ город» удалена, оставлен «Топ страница» в формате URL (`/slug/`) как основной показатель источника заявки.
- ✅ Реализован `app/api/telegram-webhook/route.ts`: команды в боте `/report`, `/stats`, `/stats week`, `/stats month`, `/top`; добавлена проверка чата и поддержка `TELEGRAM_WEBHOOK_SECRET` через заголовок `x-telegram-bot-api-secret-token`.
- ✅ Документация по эксплуатации обновлена: в `docs/PLAN.MD.md` описаны оба ручных сценария (через API и через команды Telegram), а также шаги включения webhook через `setWebhook`.
- ✅ Фикс QuizForm: состояние успеха теперь сбрасывается при монтировании/смене контекста формы (source/city), чтобы сообщение «Заявка отправлена» не переносилось между страницами.
- ✅ Фикс UX QuizForm: контентный контейнер шагов получил стабильную высоту `min-h-[520px]`, чтобы белый блок не прыгал при переходах между шагами.
- ✅ Упрощён UX поля телефона в формах (`QuizForm`, `LeadForm`): placeholder изменён на `29-123-45-67`, длинная красная подсказка заменена короткой ошибкой «Проверьте номер телефона», убран дополнительный текст под полем.
- ✅ Для историчности зафиксированы UX-правила:
  - в квизе ошибка «Введите имя» должна исчезать сразу после корректного ввода;
  - на главной сначала показываем «Примеры работ», затем блок «Калькулятор»;
  - для таких UI-изменений применяем сценарий «сначала правка → ручная проверка пользователем → потом commit/push».
- ✅ Технический аудит перед регистрацией в поисковиках выполнен:
  - `app/layout.tsx`: добавлен явный viewport meta (`width=device-width, initial-scale=1`), LocalBusiness JSON-LD сохранён.
  - `lib/seo.ts`: для LocalBusiness нормализован телефон в международном формате (`+375333135072`).
  - Подтверждено: `app/robots.ts`, `app/sitemap.ts`, canonical-логика и `.env.example` соответствуют требованиям (без `www`).
  - Добавлены отсутствующие ассеты: `public/images/og-masterzabor.jpg`, `public/icon.svg`, `public/favicon.ico`.
- ✅ Фикс для Яндекс.Вебмастера (2026-05, superseded): `Host` временно ставили `masterzabor.by`; **актуально:** `Host: www.masterzabor.by` (= `SITE_HOST`, commit `00feddf`, audit 26.05.2026).
- ✅ Обновлены Vercel env для аналитики: `NEXT_PUBLIC_GA_ID=G-DT0TXHL4DM` и `NEXT_PUBLIC_YM_ID=109298310` (Production); проверено, что `app/layout.tsx` условно подключает GA4 и Яндекс.Метрику через эти переменные с `next/script` и `strategy="afterInteractive"`.
- ✅ Фикс навигации Header/Footer: пункт «Ворота» в шапке переведён на dropdown (desktop) и accordion (mobile) с отдельными ссылками на `/vorota-raspashnye/`, `/vorota-otkatnye/`, `/kalitki/`; в колонке «Услуги» футера названия приведены к формату «Ворота распашные/Ворота откатные/Калитки`.
- ✅ В `Header` восстановлена очередность верхнего меню под прежний UX: `Профнастил → Штакетник → Сетка-рабица → Ворота → Наши работы → Контакты` (при сохранении dropdown/accordion для пункта «Ворота»).
- ✅ SEO-усиление страницы `/zabory-iz-evroshtaketnika/`: добавлены синонимы «металлоштакетник» и «металлический штакетник» в `metaTitle`, `metaDescription`, `keywords`, первый абзац и FAQ; расширен `generatePageMetadata` для передачи page-specific keywords из `content/services.ts`.
- ✅ Визуальные правки главной и шапки: текстовые `TG/WA/VB` заменены на SVG-иконки фирменных цветов в `Header` (desktop + mobile menu) и `FloatingButtons` с hover scale; в Hero обновлён `h1`, подзаголовок разбит на 3 строки и увеличен, блок «Бесплатный расчёт сегодня» расширен до сетки 2×3 с 6 пунктами и уменьшенными внутренними отступами.
- ✅ В `Header` применены официальные SVG иконки Telegram/WhatsApp/Viber (по переданным path) с подписями под каждой иконкой, размер иконок приведён к 22px, сохранены фирменные цвета и ссылки; в Hero обновлён правый блок «Бесплатный расчёт сегодня» на 6 уникальных пунктов без дублирования и с более плотными отступами без пустоты снизу.
- ✅ Фикс layout Hero по причине `CSS Grid align-items: stretch`: правая карточка ранее растягивалась по высоте левой колонки и давала пустоту снизу; добавлены `lg:items-start` для grid-контейнера и `self-start` для правой карточки, чтобы высота была строго по контенту (без `min-height` и фиксированной высоты).
- ✅ Desktop-улучшение Hero и переносов H1: на главной Hero-контейнер расширен до `max-w-[1500px]`, изменены пропорции на `lg:grid-cols-[1.4fr_0.6fr]`, расширена текстовая часть (`max-w-3xl`), а H1 на главной/городских/услугах переведены на управляемые переносы через `<br />` с классами `leading-tight text-balance` для предсказуемой типографики и более «premium» первого экрана.
- ✅ Балансировка desktop Hero после UX-проверки: контейнер скорректирован до `max-w-[1350px]`, пропорции до `lg:grid-cols-[1.35fr_0.65fr]`, межколоночный отступ уменьшен до `lg:gap-12` для более собранной композиции и визуальной связности с остальными секциями.
- ✅ Жёстко зафиксированы переносы H1 на desktop: на главной и услугах добавлен `sm:whitespace-nowrap` для целевых строк, чтобы избежать разрывов вида «под / ключ» и «Заборы из / профнастила» и сохранить ровный двухстрочный заголовок.
- ✅ Локальная диагностика `/vitebsk` и `/gomel`: устранён transient `500` в dev (битый vendor-chunk после hot-reload) через перезапуск проблемных процессов; маршруты стабильно отвечают `200` на `http://localhost:3000`.
- ✅ Визуальный тюнинг правой Hero-карточки «Бесплатный расчёт сегодня»: на desktop блок переведён в `lg:self-stretch` и внутренний `flex` с `justify-between`, чтобы карточка гармоничнее выравнивалась по высоте относительно левой колонки без возврата к неестественной растяжке.
- ✅ Городской Hero (`/borisov` и прочие city-страницы) приведён к композиции главной: добавлен правый блок «Бесплатный расчёт сегодня», обновлён подзаголовок на 3 строки в формате главной (`Профнастил • Евроштакетник • Сетка-рабица`, `Цены от 30 BYN/м.п.`, `Рассрочка и оплата частями до 60 месяцев`) и выровнена ширина контейнера/контента для согласованной сетки.
- ✅ Финальная проверка dev перед фиксацией: после очистки проблемных процессов и повторного запуска подтверждены `200 OK` для `http://localhost:3000/` и `http://localhost:3000/borisov`.
- ✅ Реализована отдельная Telegram-аналитика трафика (`analytics-report`) с источниками Google Analytics 4 и Яндекс.Метрика, отдельным cron и командами `/traffic`, `/traffic week`, `/traffic month`.
- ✅ Для Яндекс.Метрики исправлен запрос top pages на namespace `ym:pv:*`, проверены visitors/top pages/mobile-desktop и корректная сборка Telegram-сообщения.
- ✅ После API-диагностики удалён временный debug/log spam из `lib/analytics/yandex.ts` и `lib/analytics/reporting.ts`; оставлено минимальное production-логирование ошибок без raw dumps.
- ✅ Добавлен OAuth fallback для Google Analytics Data API через `refresh_token` (без service account): получение `access_token` через `https://oauth2.googleapis.com/token` и запросы `runReport` через `https://analyticsdata.googleapis.com/v1beta/...`.
- ✅ OAuth для Google Analytics завершён: `GOOGLE_REFRESH_TOKEN` сохранён в `.env.local`, `authMode: oauth_refresh_token`, GA4 Data API отвечает (users/top pages/mobile-desktop).
- ✅ E2E проверка `/traffic` и `/traffic week`: оба блока (Google + Яндекс) собираются в Telegram-сообщение; за сегодня GA может быть 0 пользователей — это нормально при отсутствии трафика.
- ✅ Исправлен Telegram webhook: причина 307 — Vercel редирект `masterzabor.by` → `www`; webhook на `https://www.masterzabor.by/api/telegram-webhook` (`scripts/set-telegram-bot.ts`).
- ✅ UX Telegram: диапазон дат в заголовке трафика (week/month), команды `/traffic_week`, `/stats_week` и др. + `setMyCommands` для autocomplete; старые `/traffic week` сохранены.
- ✅ Production audit (analytics + Telegram): удалён service account path и `getGa4DebugRaw`; консолидация `lib/analytics/{period,utils}`; документация `docs/ANALYTICS.md`; `.env.example` с Required/Deprecated; webhook только на `www`; `scripts/set-telegram-bot.ts` для webhook + commands.
- ✅ Временные debug endpoint'ы `/api/debug/google` и `/api/debug/google/oauth` удалены после проверки.
- ✅ `.env.example` обновлён под OAuth-переменные Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`); service account на Vercel не нужен.
- ✅ Документация флоу: `docs/ANALYTICS.md` (архитектура, OAuth, webhook www/307, команды, cron, env); `docs/PLAN.MD.md` (ручные сценарии); `.env.example` (Required/Deprecated).
- ⬜ На Vercel вручную добавить `CRON_SECRET` и при необходимости `STATS_API_TOKEN` (см. `docs/ANALYTICS.md`).
- ✅ Push в `main`: commit `a7ba546` (analytics + Telegram production-ready).
- ✅ Единая вертикальная сетка city pages: `SiteContainer` (`max-w-[1350px]`), hero grid `1.45fr / 380px`, intro `max-w-5xl`; проверены `/molodechno`, `/gomel`, `/brest`.
- ✅ Service pages (`ServicePage`): единый `SiteContainer`, article `max-w-[960px]`, hero subtitle lead/accent для сетки-рабицы; проверены 3 fence service pages.

## Тексты и layout подзаголовков на главной
- ✅ Обновлены тексты секций «Ворота и калитки» и «Работаем по Беларуси»: убрана формулировка «Основной регион — Гомель…», нейтральный профессиональный тон без SEO-спама
- ✅ Подзаголовок «Ворота и калитки»: два предложения с явным переносом строки после первого
- ✅ Единые классы intro/subtitle на главной: `sectionIntroClassName` (`lg:max-w-[70%]`, `xl:max-w-[56rem]`), `sectionIntroFlexClassName` для секций с ссылкой справа, `sectionSubtitleClassName` (`text-pretty`, `leading-relaxed`)
- ✅ Расширены description-блоки секций (ранее узкая колонка ~640px): «Типы заборов», «Примеры работ», «Отзывы», «Калькулятор», CTA-форма; на mobile — полная ширина, естественные переносы
- ✅ Типографика hero и CTA: список вместо `<br />`, неразрывные пробелы для «висячих» слов
- ✅ Локальный dev: устранён `500` на `localhost:3000` (битый `.next` после параллельного `build`+`dev`); правила восстановления добавлены в `.cursorrules` и `docs/PLAN.MD.md`
- ✅ `npm run build` проходит после правок

---

## Итоговая проверка
- ✅ npm run build проходит без ошибок
- ⬜ Все страницы открываются на localhost:3000
- ⬜ Мобильная версия выглядит корректно
- ✅ API заявок отправляет данные в Telegram
- ⬜ UI-формы вручную проверить в браузере

---

## Production Domain Architecture (зафиксировано, май 2026)

Полный audit: `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md`.

**Source of truth:** `www.masterzabor.by` — canonical, runtime, Vercel Primary Domain.

| System | Host | Notes |
|--------|------|-------|
| Runtime | **www** | Pages + API отдаются на www |
| Vercel redirect | apex → **307** → www | Platform-level, все пути включая `/api/*` |
| `next.config.ts` | **empty** | Custom host redirects **удалены** (hotfix loop) |
| Canonical / sitemap / robots / OG / JSON-LD | **www** | `SITE_URL` в `lib/constants.ts` |
| Telegram webhook | **www only** | `https://www.masterzabor.by/api/telegram-webhook` |

- ✅ Production audit (26.05.2026): подтверждено live HTTP — apex 307→www, www 200, webhook POST 200 на www.
- ✅ Документация синхронизирована: `.cursorrules`, `ANALYTICS.md`, `PLAN.MD.md`, `PROGRESS.md`.

### Redirect loop incident (май 2026) — история и финальное решение

**Incident:**
- Infinite redirect loop → сайт недоступен.
- **Причина:** Vercel `apex→www` (307) **+** custom `www→apex` в `next.config.ts` (`480f18a`).

**Hotfix (`2526efe`):**
- Custom redirect **полностью удалён** из `next.config.ts`.

**Финальная stable strategy (`00feddf` + audit 2026):**
- **WWW = canonical + runtime host** (не apex).
- Apex только redirect alias → www.
- Telegram webhook **только на www**.
- **Нет** custom host redirects в коде.

**Production checks (26.05.2026):**
- `GET masterzabor.by/` → 307 → `www.masterzabor.by/` → 200
- `GET www.masterzabor.by/` → 200 (без redirect)
- `POST www.masterzabor.by/api/telegram-webhook` → 200 (direct)
- `POST masterzabor.by/api/telegram-webhook` → 307 (unsafe для Telegram)

### Запреты для AI / developers (domain)

- ⛔ Не добавлять `www→apex` в `next.config.ts` — **redirect loop** с Vercel.
- ⛔ Не мигрировать `SITE_URL`/canonical/sitemap на apex.
- ⛔ Не менять webhook URL на apex.
- ⛔ Не менять Vercel domain settings без domain audit.

### Важно (защитное предупреждение — актуально)
- ⚠️ **Нельзя пропускать Telegram webhook через redirect.**
- ⚠️ Endpoint `https://www.masterzabor.by/api/telegram-webhook` обязан отвечать напрямую (POST → 200, без 307/308).
- ⚠️ **Не добавлять** www→apex redirects — риск infinite loop с Vercel apex→www.
- ⚠️ При любых изменениях domain/redirect — читать `docs/AUDIT-PRODUCTION-HOST-DOMAIN.md` первым.

<details>
<summary>Архив: промежуточное решение Redirect/Webhook Fix (480f18a, отменено 2526efe)</summary>

- Была попытка: canonical на apex + `www→apex` redirect в `next.config.ts` (API excluded).
- Привело к **redirect loop** с Vercel `apex→www`.
- Hotfix `2526efe`: redirect удалён; `00feddf`: SEO constants → www.

</details>

## Favicon и app icons (2026-05-23)
- ✅ Аудит prod + Google Search Central: иконки в `public/`, разметка в `lib/seo.ts` → `generatePageMetadata()` (не file-based `app/favicon.*`).
- ✅ `lib/seo.ts`: в `icons.icon` первыми 192×192 и 48×48 PNG, затем `.ico`/16/32, `icon.svg`; добавлен `shortcut` → `/favicon.ico`.
- ✅ Новый файл `public/favicon-48x48.png` (рекомендация Google ≥48×48 для SERP).
- ✅ Дубли в `public/` под Next-имена (прямой **200 OK**, без redirect): `apple-icon.png`, `icon-192.png`, `icon-512.png` — копии `apple-touch-icon`, `android-chrome-192x192`, `android-chrome-512x512`.
- ✅ Принцип: favicon/app icons **не** через 301/308 (кэш ботов и стабильный URL важнее ~12 KB дублей); redirect только для каноникализации домена, не для PNG.
- ✅ `next.config.ts`: без favicon-redirects.
- 📋 После деплоя: Search Console → индексирование `https://www.masterzabor.by/`; глобус в выдаче может оставаться дни–недели (отдельный crawl Google).

### Как заменить логотип / favicon (инструкция для человека и Cursor)

> **Для ИИ (Cursor):** если пользователь просит новый логотип, favicon, иконку сайта или «обновить бренд» — прочитай этот блок целиком, обнови **все** файлы из таблицы ниже, **не** меняй пути в `lib/seo.ts` без необходимости (имена URL должны остаться прежними), **не** добавляй redirect для PNG. После правок: `npm run build`, `npm run lint`, напомнить про деплой и Search Console.

**Исходник:** один квадратный мастер **512×512** (PNG с прозрачностью или на фоне `#1B5E20` — как в текущем стиле). Из него экспортируются все размеры.

#### Таблица файлов (все обязательны при смене логотипа)

| Файл | Размер | Роль |
|------|--------|------|
| `public/android-chrome-512x512.png` | 512×512 | PWA manifest, мастер для ресайза |
| `public/android-chrome-192x192.png` | 192×192 | Manifest + **первый** `rel="icon"` (Google) |
| `public/icon-512.png` | 512×512 | **Дубль** `android-chrome-512x512.png` (скопировать байт-в-байт) |
| `public/icon-192.png` | 192×192 | **Дубль** `android-chrome-192x192.png` |
| `public/apple-touch-icon.png` | 180×180 | iOS «На экран Домой» |
| `public/apple-icon.png` | 180×180 | **Дубль** `apple-touch-icon.png` |
| `public/favicon-48x48.png` | 48×48 | Google SERP (рекомендация ≥48) |
| `public/favicon-32x32.png` | 32×32 | Вкладка браузера |
| `public/favicon-16x16.png` | 16×16 | Старые браузеры |
| `public/favicon.ico` | 16+32 (и желательно 48 в ICO) | Классический favicon, `shortcut icon` |
| `public/icon.svg` | viewBox 64×64 | SVG в `<head>`, `mask-icon` (Safari) — перерисовать или упростить под новый знак |
| `public/images/logo-512.png` | 512×512 | Schema.org `logo` / `image` (`LOGO_PATH` в `lib/constants.ts`) |
| `public/images/og-masterzabor.jpg` | 1200×630 | Open Graph / Twitter (отдельный макет, не просто ресайз 512) |

`public/manifest.webmanifest` — пути **не менять**, только заменить PNG по тем же именам.  
`lib/seo.ts` — менять **только** если переименовываете файлы (лучше не переименовывать: стабильные URL для Google).

#### Порядок работ (человек или ИИ)

1. Подготовить мастер 512×512 (Figma, Illustrator, или [realfavicongenerator.net](https://realfavicongenerator.net/) → скачать пакет и разложить по именам из таблицы).
2. Положить/перезаписать **основные** файлы: `android-chrome-512x512`, `192`, `apple-touch-icon`, `favicon-16/32/48`, `favicon.ico`, `icon.svg`, `images/logo-512.png`.
3. **Скопировать дубли** (иначе 404 на Next-URL):
   - `apple-icon.png` ← `apple-touch-icon.png`
   - `icon-192.png` ← `android-chrome-192x192.png`
   - `icon-512.png` ← `android-chrome-512x512.png`
4. Обновить `public/images/og-masterzabor.jpg` (баннер с логотипом для соцсетей).
5. `npm run build` && `npm run lint` → commit → deploy.
6. Проверить в браузере (hard refresh): вкладка, «Добавить на экран», View Source — первый `rel="icon"` на 192×192.
7. Search Console: URL Inspection → `https://www.masterzabor.by/` → запросить индексирование.

#### Быстрая проверка после деплоя

```text
https://www.masterzabor.by/favicon.ico          → 200
https://www.masterzabor.by/android-chrome-192x192.png → 200
https://www.masterzabor.by/apple-icon.png       → 200 (не redirect)
https://www.masterzabor.by/icon-192.png         → 200
```

#### Частые ошибки

- Обновили только `favicon.ico`, забыли **дубли** `apple-icon` / `icon-192` / `icon-512`.
- Заменили `android-chrome-192x192.png`, но не **`favicon-48x48.png`**.
- Поставили redirect вместо копии файла в `public/`.
- Переименовали файлы → сломали кэш Google и manifest; лучше те же имена, новое содержимое.
