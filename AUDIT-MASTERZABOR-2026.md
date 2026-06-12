# AUDIT MASTERZABOR 2026

Дата аудита: 2026-06-03  
Проект: `masterzabor`  
Production: https://www.masterzabor.by  
Репозиторий: `C:\DiscD\проекты сайта\masterzabor`

## Статус этапов

- Этап A. Production audit: завершено.
- Этап B / 7. Search Console & indexing audit: завершено по production/code-сигналам; без доступа к аккаунтам GSC/Yandex Webmaster.
- Этап C / 11. Favicon & search appearance audit: завершено.
- Этап D / 8 / 9 / 10. Infrastructure, domains, Telegram, analytics: завершено по коду и production; без доступа к Vercel dashboard/env/account data.
- Этап 0. Business audit: завершено.
- Этап 1. Project discovery: завершено.
- Этап 2. Architecture audit: завершено.
- Этап 3. Frontend audit: завершено.
- Этап 4. Mobile-first audit: завершено.
- Этап 5. Performance audit: завершено статически; без Lighthouse/build из-за зависшего `next build`.
- Этап 6. SEO audit: завершено.
- Этап 12. Городские страницы: завершено.
- Этап 13. Блог: завершено.
- Этап 14. CRO audit: завершено.
- Этап 15. Target architecture: завершено.
- Этап 16. Roadmap: завершено.

## Ограничения аудита

- Есть доступ к интернету и production-проверкам.
- Есть доступ к локальному репозиторию.
- Нет доступа к приватным кабинетам Google Search Console, Yandex Webmaster, Google Analytics, Yandex Metrika, Vercel dashboard и фактическим env values.
- Поэтому выводы по кабинетам являются технической диагностикой на основании live URL, HTML, HTTP-ответов и кода.

## История проекта из `docs/`

Перед продолжением аудита изучены все документы из `docs/`:

- `PROGRESS.md`
- `PLAN.MD.md`
- `ANALYTICS.md`
- `AUDIT-PRODUCTION-HOST-DOMAIN.md`
- `AUDIT-ANALYTICS-DOMAIN-CONSISTENCY.md`
- `GOOGLE-OAUTH-RECOVERY.md`

### Что уже было обнаружено ранее

- В мае 2026 уже был production incident: redirect loop из-за конфликта Vercel `apex -> www` и custom `www -> apex` в `next.config.ts`.
- Уже было установлено, что source of truth для production: `https://www.masterzabor.by`.
- Уже было зафиксировано, что Telegram webhook нельзя регистрировать на apex, потому что `POST https://masterzabor.by/api/telegram-webhook` получает `307`.
- Уже была обнаружена проблема fail-open для cron routes при отсутствующем `CRON_SECRET`.
- Уже была отмечена слабость in-memory rate limiting на serverless.
- Уже был отмечен `Fake SearchAction JSON-LD`.
- Уже был отмечен UX/SEO-долг: пункт `Цены` отсутствует в главном desktop/mobile header.
- Уже была зафиксирована favicon-архитектура: стабильные файлы в `public/`, без favicon redirects.
- Уже была обнаружена отдельная проблема GA server reports: `GOOGLE_REFRESH_TOKEN` / OAuth / `GA_PROPERTY_ID`, не связанная с доменной миграцией.

### Что уже исправлено ранее

- Custom host redirects удалены из `next.config.ts`.
- `SITE_URL`, `SITE_HOST`, sitemap, robots, OG, JSON-LD и Telegram webhook переведены на `www`.
- `TELEGRAM_WEBHOOK_URL` указывает на `https://www.masterzabor.by/api/telegram-webhook`.
- Debug Google OAuth endpoints удалены.
- Yandex Metrika top pages переведены на правильный namespace `ym:pv:*`.
- Добавлены favicon/app icons, включая `favicon-48x48.png`.
- City pages и service pages переведены на единый `SiteContainer`.
- Внутренние формы в основном унифицированы через `QuizForm`.
- Документы после 26-29 мая в целом синхронизированы на `www`-primary model.

### Что остаётся актуальной проблемой

- `CRON_SECRET` всё ещё проверяется только если env задан; при пустом env cron routes открыты.
- `TELEGRAM_WEBHOOK_SECRET` и `TELEGRAM_CHAT_ID` остаются опциональными, а не обязательными для production.
- Lead storage в KV остаётся неатомарным: read-modify-write может потерять заявки при параллельных отправках.
- Rate limiting в памяти serverless остаётся слабой защитой.
- `SearchAction` в WebSite JSON-LD остаётся без реального поиска.
- Header по-прежнему не даёт быстрый доступ к `Цены` в основной навигации.
- GA server reporting зависит от корректных Vercel env и OAuth token; без доступа к Vercel это нельзя подтвердить.
- Production Vercel deployment URL `masterzabor-site.vercel.app` отдаёт 200 и остаётся duplicate surface.
- Главная новая критичная актуальная проблема: sitemap/canonical/OG/JSON-LD используют trailing slash там, где production final URL без slash.

### Что подтвердил текущий аудит

- Прошлый вывод о `www` как source of truth подтверждён live-проверкой.
- Прошлый запрет на `www -> apex` redirect подтверждён и остаётся критическим.
- Прошлый вывод, что GA warning не связан с `www` migration, подтверждается архитектурой кода.
- Прошлая оценка favicon-архитектуры в целом подтверждена.
- Прошлое замечание "trailing slash not host-related" подтверждено, но серьёзность уточнена: это не доменная проблема, а критическая canonical/sitemap/indexing проблема.

## Главный вывод

Проект уже можно считать рабочим коммерческим сайтом: есть App Router, статическая генерация страниц, sitemap/robots, metadata, JSON-LD, формы, Telegram, отчёты и аналитическая инфраструктура.

Критическая проблема сейчас не в отсутствии SEO, а в конфликтующих SEO-сигналах:

- production отдаёт рабочие HTML-страницы без trailing slash;
- sitemap, canonical, OpenGraph и часть JSON-LD указывают URL с trailing slash;
- URL со slash делают redirect на URL без slash;
- canonical на рабочей странице часто указывает обратно на redirecting URL.

Это создаёт прямую причину для статусов Google Search Console:

- `Страница с переадресацией`;
- `Вариант страницы с canonical`;
- `Обнаружена, не проиндексирована`;
- `Просканирована, но не проиндексирована`;
- возможная `Ошибка переадресации` на части URL и доменных вариантов.

## Этап 0. Business Audit

Оценка: требует доработки.

Если бы сайт был единственным источником клиентов для бизнеса по установке заборов в Беларуси, первый приоритет был бы не визуальный редизайн, а устранение потерь в трёх местах:

1. SEO-сигналы: привести sitemap/canonical/final URL к одному виду.
2. Доверие: заменить placeholder-графику реальными фото объектов.
3. Лиды: сделать хранение и доставку заявок отказоустойчивыми.

### Что мешает заявкам

- Квиз требует несколько шагов до контакта; это хорошо для квалификации, но часть мобильных пользователей захочет быстрый звонок/мессенджер.
- Placeholder-фото снижают доверие к реальности выполненных работ.
- Нет полной аналитики событий: непонятно, где пользователи бросают квиз/форму.
- Если Telegram или KV падает, пользователь может получить ошибку и бизнес может потерять лид.

### Что мешает звонкам и Telegram

- В мобильном header телефон виден, но длинный номер рядом с burger может быть тесным на узких экранах.
- Messenger buttons есть, но нет явного измерения кликов.
- Header не содержит `Цены`, хотя для коммерческого запроса это сильный быстрый путь к заявке.

### Что мешает доверию и продажам

- Реальные работы заменены SVG-placeholder.
- Отзывы есть как контент, но без сильных внешних доказательств: Google/Yandex reviews, скриншоты, фото объекта, город, тип работ.
- City pages выглядят как templated local pages; без реальных городских объектов это риск доверия и SEO.

### ТОП-10 точек роста бизнеса

1. Исправить sitemap/canonical/trailing slash.
2. Закрыть duplicate surface `masterzabor-site.vercel.app`.
3. Добавить реальные портфолио-фото с городом, материалом, сроком и ценовым диапазоном.
4. Сделать lead storage атомарным и добавить retry/fallback для Telegram.
5. Сделать production secrets fail-closed.
6. Добавить conversion events: звонки, мессенджеры, form start/success/error, quiz steps.
7. Добавить `Цены` в основную навигацию.
8. Усилить city pages уникальными локальными proof-блоками.
9. Убрать/реализовать `SearchAction`.
10. Подготовить content/image architecture для 100+ работ и 500+ статей.

## Этап 1. Project Discovery

Оценка: хорошо как текущая база, требует доработки для роста.

### Repository Map

- `app/` - Next.js App Router: страницы, layout, sitemap/robots, API routes.
- `app/[city]/page.tsx` - динамические городские страницы, `generateStaticParams`, `dynamicParams = false`.
- `app/blog/[slug]/page.tsx` - динамические статьи блога.
- `app/api/lead/route.ts` - приём заявок.
- `app/api/stats/route.ts` - защищённая статистика лидов.
- `app/api/telegram-webhook/route.ts` - команды Telegram bot.
- `app/api/cron/daily-report/route.ts` - ежедневный отчёт по лидам.
- `app/api/cron/analytics-report/route.ts` - ежедневный отчёт по трафику.
- `components/layout/` - Header, Footer, FloatingButtons, SiteContainer.
- `components/forms/` - LeadForm, QuizForm, BelarusPhoneField.
- `components/templates/` - ServicePage, CityPage.
- `components/cards/` - ProductCard.
- `components/portfolio/` - PortfolioGallery.
- `content/` - статические данные: 40 городов, 6 услуг, 3 статьи.
- `lib/` - constants, SEO, Telegram, leads, reporting, analytics, phone utilities.
- `public/` - favicon/app icons, manifest, logo, OG image.
- `docs/` - история проекта, domain/analytics audits, OAuth recovery.
- `scripts/` - Telegram webhook setup.

### Route Map

Production/content routes:

- `/`
- 6 service pages: `/zabory-iz-profnastila`, `/zabory-iz-evroshtaketnika`, `/zabory-iz-setki-rabitsy`, `/vorota-raspashnye`, `/vorota-otkatnye`, `/kalitki`
- 40 city pages через `/[city]`
- `/tseny`
- `/nashi-raboty`
- `/otzyvy`
- `/kontakty`
- `/blog`
- 3 blog articles через `/blog/[slug]`

API routes:

- `POST /api/lead`
- `GET /api/stats`
- `POST /api/telegram-webhook`
- `GET /api/cron/daily-report`
- `GET /api/cron/analytics-report`

Sitemap coverage:

- Покрывает главную, услуги, города, блог, статьи и коммерческие страницы.
- Проблема: покрывает их slash URL, которые redirect to no-slash.

Robots coverage:

- `Allow: /`
- `Disallow: /api/`
- `Sitemap: https://www.masterzabor.by/sitemap.xml`
- `Host: www.masterzabor.by`

### Component Map

- `Header` используется в `app/layout.tsx`; содержит desktop nav, gates dropdown, mobile menu, phone, messenger links.
- `Footer` используется в `app/layout.tsx`; содержит навигацию, услуги, контакты, реквизиты.
- `FloatingButtons` используется в `app/layout.tsx`; mobile call/messenger CTA.
- `SiteContainer` используется в city/service templates; правильное направление для дизайн-системы.
- `ProductCard` используется на главной, city pages и service cross-links.
- `LeadForm` используется на главной как простая форма.
- `QuizForm` используется на главной, услугах, городах, ценах, контактах и статьях; это основной lead capture.
- `BelarusPhoneField` переиспользуется в LeadForm и QuizForm.
- `ServicePage` - главный шаблон для 6 услуг.
- `CityPage` - главный шаблон для 40 городов.
- `PortfolioGallery` - клиентский фильтр портфолио.

Дублирование:

- Placeholder image generation повторяется в `app/page.tsx`, `CityPage`, `ServicePage`, `PortfolioGallery`, `blog-posts`.
- Messenger SVG icons дублируются между `Header` и `FloatingButtons`.
- Trailing slash URL construction повторяется во многих компонентах и route metadata.

### Dependency Map

`package-lock.json` фиксирует текущие версии:

- `next`: 15.5.18
- `react`: 19.2.6
- `react-dom`: 19.2.6
- `tailwindcss`: 4.3.0
- `@tailwindcss/postcss`: 4.3.0
- `@vercel/kv`: 3.0.0
- `react-hook-form`: 7.75.0
- `typescript`: 6.0.3
- `eslint`: 9.39.4
- `eslint-config-next`: 15.5.18

Риски:

- В `package.json` много `latest`, что ухудшает воспроизводимость новых install.
- `next lint` уже deprecated и будет удалён в Next.js 16.
- Проект на Next.js 15, поэтому runtime Next MCP недоступен без upgrade.
- `@vercel/kv` подходит для проекта, но текущая модель записи лидов использует его неатомарно.

## Этап 2. Architecture Audit

Оценка: удовлетворительно/хорошо для текущего размера, требует доработки перед масштабированием.

### Что сделано хорошо

- App Router выбран уместно.
- 40 city pages и 3 blog articles статически генерируются.
- `dynamicParams = false` защищает от случайных городских URL.
- Есть единый `SITE_URL` и `SITE_HOST`.
- Есть централизованный `lib/seo.ts`.
- Есть шаблоны `CityPage` и `ServicePage`, а не 40 вручную скопированных страниц.
- Есть `SiteContainer`, который уже решил часть layout inconsistency.
- Есть Telegram/reporting/analytics integration, что для малого бизнеса ценно.
- Есть docs/runbooks по доменам и OAuth.

### Что сделано плохо или временно

- URL normalization не централизована: slash/no-slash рассыпаны по sitemap, metadata, breadcrumbs, links, reports.
- `absoluteUrl(path)` не нормализует path к canonical policy.
- Lead storage неатомарен.
- Production security у cron/webhook зависит от наличия env, а не от строгого fail-closed поведения.
- Placeholder visuals живут как production content.
- Content хранится в TS arrays; для 40 городов и 3 статей это нормально, но для 500-1000 статей станет неудобно.
- JSON-LD `SearchAction` заявляет несуществующий поиск.
- Product JSON-LD offer URL указывает на homepage, а не на страницу услуги.

### Что выглядит как решение новичка/вайбкодинг

- Ручные `data:image/svg` placeholder-функции в нескольких местах.
- Много `href`/`url` с trailing slash, но без единого URL helper.
- In-memory rate limit в serverless.
- KV array read-modify-write для лидов.
- `latest` dependencies.
- `SearchAction` без реальной функции.

### Что станет проблемой через 6 месяцев

- Рост city/service/blog URLs усилит canonical/indexing хаос, если URL style не нормализовать.
- Реальные лиды могут теряться при пиковых отправках.
- Без conversion events непонятно, какие страницы и CTA работают.
- Без реальных фото SEO и конверсия будут ограничены.

### Что станет проблемой через 2 года

- TS arrays для 500-1000 статей и 100-300 фото будут неудобны.
- Нужна контентная модель: MDX/CMS/data source, категории, теги, image metadata, related content.
- Нужна отдельная архитектура portfolio/project entities.
- Нужны automated tests для sitemap/canonical/API.

### Оставить / улучшить / удалить / перепроектировать

Оставить:

- Next.js App Router.
- `www` canonical strategy.
- `CityPage`/`ServicePage` templates.
- `SiteContainer`.
- Telegram как быстрый канал лидов.
- GA/Yandex reporting как бизнес-сводки.

Улучшить:

- URL helper и canonical policy.
- Sitemap/metadata/breadcrumb generation.
- Header navigation.
- Conversion tracking.
- Error logging categories.
- Dependency pinning.

Удалить:

- Fake `SearchAction`, если поиск не будет реализован.
- Placeholder images из production portfolio.
- `latest` ranges.

Перепроектировать:

- Lead storage/delivery.
- Cron/webhook security.
- Content/image architecture для масштабирования.

### Проверка процессов и build/lint

- Во время аудита был найден зависший `next build`: `cmd.exe /c next build` и соответствующий `node.exe`.
- Процессы остановлены.
- Повторный список процессов не показал активный `next build`/`next lint` для проекта.
- Новую сборку в этом проходе не запускал повторно, чтобы не зациклить аудит.
- Исторически в `docs/PROGRESS.md` зафиксированы успешные `npm run build` и `npm run lint`; текущий `npm run lint` также успел вывести `No ESLint warnings or errors` и предупреждение о deprecated `next lint`.

## Этап 3. Frontend Audit

Оценка: удовлетворительно/хорошо, требует доработки контента и дизайн-системы.

Что сделано хорошо:

- Есть понятная структура: hero, услуги, работы, квиз, отзывы, география, форма, FAQ.
- Есть sticky header, footer, mobile floating buttons.
- Есть единая сетка `SiteContainer` для city/service templates.
- Есть reusable `ProductCard`, `QuizForm`, `LeadForm`, `BelarusPhoneField`.
- Цвета и tone соответствуют коммерческому сайту услуг.

Проблемы:

- Главная не до конца является архитектурной основой остальных страниц: city/service pages уже унифицированы через `SiteContainer`, но homepage, blog, prices, reviews, contacts всё ещё используют локальные `max-w-7xl` и разные section patterns.
- Много крупных `rounded-2xl/rounded-3xl`; визуально это дружелюбно, но не всегда соответствует плотному коммерческому интерфейсу.
- Header беднее Footer: в footer есть `Цены`, `Отзывы`, `Блог`; в header нет `Цены`, `Отзывы`, `Блог`.
- Messenger icons дублируются вручную в двух компонентах.
- Placeholder graphics не дают реального впечатления продукта.

Решение:

- Расширить `SiteContainer` и section primitives на все страницы.
- Добавить `Цены` в header.
- Создать shared messenger icon/link component.
- Заменить placeholder visuals реальными изображениями и project cards.

## Этап 4. Mobile-First Audit

Оценка: требует доработки.

### Header

Плюсы:

- Телефон виден на мобильном.
- Есть burger menu.
- Есть mobile side drawer.

Риски:

- Полный номер `+375 33 313-50-72` рядом с burger может быть тесным на узких экранах.
- В мобильном меню нет `Цены`, хотя это один из самых важных путей к заявке.

Решение:

- На узких экранах заменить номер на compact call button или icon+short label.
- Добавить `Цены`, `Отзывы`, `Блог` в mobile menu.

### Hero

Плюсы:

- CTA на расчёт и звонок есть сразу.
- Коммерческие аргументы видны: цена, гарантия, рассрочка.

Риски:

- Hero использует placeholder image; это не продаёт реальную работу.
- Forced line breaks в H1 могут быть хороши на desktop, но требуют визуальной проверки на малых ширинах.

### Quiz

Плюсы:

- Понятная 6-step структура.
- Есть прогресс.
- Есть маска телефона.
- Есть стабильная высота блока, чтобы layout не прыгал.

Риски:

- `min-h-[520px]` на мобильном может создавать длинный экран.
- Длина забора обязательна; часть пользователей не знает длину и может уйти.
- Нет analytics events по шагам.

Решение:

- Добавить вариант "Не знаю длину".
- Отслеживать `quiz_start`, `quiz_step`, `quiz_submit`, `quiz_error`.
- Сохранять быстрый CTA рядом с квизом: звонок/Telegram.

### Формы

Плюсы:

- Валидация белорусского телефона.
- Simple и full variants.
- Реальный POST на `/api/lead`.

Риски:

- Error state слишком общий.
- Нет client-side conversion tracking.
- Если API частично сохранил лид, но Telegram упал, пользователь видит ошибку.

### Portfolio / Reviews

Проблема:

- Для мобильного доверия критичны реальные фото и отзывы; сейчас portfolio синтетический.

Решение:

- Делать карточки: фото, город, материал, длина, срок, диапазон цены, отзыв/результат.

## Этап 5. Performance Audit

Оценка: удовлетворительно статически, требует измерения Lighthouse после исправлений.

Что хорошо:

- `next/font` используется для Inter; font loading правильнее, чем внешний CSS Google Fonts.
- Analytics scripts подключены `afterInteractive`.
- Большая часть pages server-rendered/static.
- `Image` используется вместо обычных `img`.
- `iframe` карты lazy-loaded.
- App Router даст route-level splitting.

Риски:

- `next build` завис во время аудита; процесс остановлен. Нужна отдельная диагностика build.
- `Image fill` в hero-изображениях не имеет `sizes`, что может приводить к неоптимальному выбору image sizes, особенно после замены placeholder на реальные фото.
- Текущие `data:image/svg` не являются реальными optimized images; после добавления фото важно проверить LCP.
- `Header`, `QuizForm`, `LeadForm`, `PortfolioGallery`, `FloatingButtons` являются client components; это нормально, но bundle нужно измерить.
- Yandex Webvisor может влиять на INP/TTI на мобильных.
- Tables на `/tseny` имеют `min-w-[680px]`; на mobile нужен горизонтальный scroll/адаптивные cards.

Показатели:

- LCP: сейчас, вероятно, лёгкий из-за SVG-placeholder; после реальных hero photos может ухудшиться.
- CLS: стабильный в формах за счёт `min-h`, но нужно проверить hero/image sizing.
- INP: риск от quiz, mobile drawer, analytics/webvisor.
- TTFB: Vercel + static pages должны быть хорошими.
- Bundle: требуется `next build` / analyzer после устранения зависания.

Решение:

- Диагностировать зависший `next build`.
- Добавить `sizes` для всех `Image fill`.
- Для реальных фото использовать responsive sizes и webp/avif.
- Проверить Lighthouse mobile на homepage, service, city, blog post, prices.

## Этап 6. SEO Audit

Оценка: критическая проблема из-за URL/canonical; content/local SEO требует доработки.

### Technical SEO

Хорошо:

- Есть robots.
- Есть sitemap.
- Есть canonical.
- Есть OpenGraph/Twitter.
- Есть JSON-LD LocalBusiness/Organization/WebSite/Product/FAQ/Breadcrumb/Article.
- Есть geo metadata для городов.
- Есть `dynamicParams = false`.

Проблемы:

- canonical/sitemap/links/schema часто slash, final URL no-slash.
- Product Offer URL указывает на homepage.
- `SearchAction` без поиска.
- Blog index не имеет Breadcrumb JSON-LD, только визуальные breadcrumbs.
- Hreflang не нужен, потому что сайт русскоязычный для BY; отсутствие не проблема.

### Google

Главный indexing blocker: inconsistent canonical/redirect/sitemap.

Ranking blockers:

- мало реальных изображений;
- city pages templated;
- мало blog depth;
- мало external/local proof;
- нет Google Business Profile evidence в коде, кроме Google Maps reviews link.

### Yandex

Хорошо:

- `Host: www.masterzabor.by`.
- Yandex Metrika supported.
- Regional focus Беларусь/Гомель отражён.

Риски:

- Yandex может игнорировать canonical, если canonical URL редиректит.
- Нужен Yandex Webmaster recrawl после исправления sitemap.
- Для региональности нужны Яндекс Бизнес/Справочник и локальные сигналы, не только meta.

### Local SEO

Хорошо:

- Есть 40 городов.
- Есть координаты, области, районы для некоторых городов.
- Есть LocalBusiness JSON-LD.

Риск:

- Городские страницы могут быть doorway/thin pages, если не добавить реальные локальные proof-assets.

### Content SEO

Хорошо:

- Один H1 на страницах.
- Есть коммерческие titles/descriptions.
- Есть internal linking services <-> cities.
- Есть FAQ и статьи.

Проблемы:

- Service meta titles часто "в Гомеле", хотя страницы позиционируются "в Беларуси".
- Blog всего 3 статьи.
- Статьи хранятся как HTML string; для роста лучше MDX/content model.

## Этап 12. Городские страницы

Оценка: удовлетворительно сейчас, высокий риск при масштабировании без уникального контента.

Текущее состояние:

- 40 городов.
- `generateStaticParams`.
- `dynamicParams = false`.
- Уникальные title/description на основе города.
- City LocalBusiness JSON-LD.
- Перелинковка на услуги и соседние города.

Doorway/thin risks:

- Большая часть текста шаблонная с подстановкой города.
- Фото объектов тоже generated placeholder.
- Нет уникальных отзывов/проектов/цен/сроков по каждому городу.
- При расширении до 50 городов проблема станет заметнее, если не добавить реальные локальные данные.

Как строило бы сильное SEO-агентство:

- Главная city landing: `/gomel`, `/minsk`, `/brest`.
- Внутри города: реальные объекты, районы, сроки выезда, фото, отзывы.
- Service-city pages создавать выборочно, только где есть спрос и уникальный proof, а не 50 x 15 автоматически.
- Добавить project entities: объект связан с city, service, material, photos, review.

## Этап 13. Блог

Оценка: требует доработки перед масштабированием.

Текущее состояние:

- 3 статьи.
- Static generation.
- Article JSON-LD.
- Related posts.
- CTA в статье.

Проблемы:

- Нет категорий/тегов как маршрутов.
- Нет поиска, но WebSite JSON-LD заявляет SearchAction.
- Контент хранится HTML string в TS file.
- Нет автора/экспертного блока/даты обновления как отдельной UI-сущности.
- Нет контентных кластеров и pillar pages.

Для 500-1000 статей:

- Перейти на MDX или CMS/data source.
- Категории: материалы, цены, документы/нормы, монтаж, уход, ворота, города.
- Теги использовать для related content, но не плодить thin tag pages без индексационной стратегии.
- Разделить sitemap на page sitemap, blog sitemap, image sitemap.

## Этап 14. CRO Audit

Оценка: требует доработки.

Что уже хорошо:

- Телефон, мессенджеры, формы и квиз присутствуют.
- CTA повторяются в ключевых местах.
- Есть цены и объяснение "ориентировочно".
- Есть отзывы.
- Есть реквизиты и контакты.

Точки потери клиентов:

- Недостаток реальных фото.
- Неизмеряемые клики по телефону и мессенджерам.
- Multi-step quiz без "не знаю длину".
- Нет trust proof внутри форм: сколько времени ждать, кто перезвонит, что подготовить.
- Error states не дают понятного fallback, если API частично упал.
- Нет видимой связки portfolio -> CTA -> price estimate.

Решение:

- Реальные project cards.
- События аналитики на все conversion actions.
- Упростить быстрый путь: "Позвонить", "Telegram", "Получить расчёт" всегда доступны.
- Улучшить формы: fallback phone, source page, status "заявка сохранена/менеджер получит".
- Добавить микро-доверие рядом с CTA: договор, гарантия, сроки, оплата частями, реальные фото.

## Этап 15. Target Architecture

Оценка целевой архитектуры: достижима без переписывания проекта.

### Что уже правильное

- Next.js App Router.
- Vercel hosting.
- `www` canonical/runtime host.
- Static generation для city/service/blog pages.
- `content/` как стартовая модель данных.
- `CityPage`/`ServicePage` templates.
- Telegram как оперативный канал лидов.
- GA/Yandex reporting.
- `SiteContainer` как начало дизайн-системы.

### Что мешает росту

- Нет единого canonical URL helper.
- Нет сущности `Project`/`PortfolioItem` с реальными фото.
- Нет масштабируемой модели blog content.
- Lead storage/delivery не production-grade.
- Conversion analytics не покрывает главные действия.
- Header/navigation не полностью отражает коммерческие маршруты.

### Целевая URL-структура

Canonical style: no trailing slash.

- `/`
- `/zabory-iz-profnastila`
- `/zabory-iz-evroshtaketnika`
- `/zabory-iz-setki-rabitsy`
- `/vorota-raspashnye`
- `/vorota-otkatnye`
- `/kalitki`
- `/tseny`
- `/nashi-raboty`
- `/otzyvy`
- `/kontakty`
- `/gomel`, `/minsk`, ...
- `/blog`
- `/blog/{article-slug}`
- Optional future: `/blog/{category}/{article-slug}` only if taxonomy is stable.

Do not mass-generate `/city/service` pages for every combination. Create service-city pages only where:

- есть спрос;
- есть реальные объекты;
- есть уникальный текст;
- есть фото/отзывы/цены именно для этой связки.

### Целевая структура контента

Short term:

- `content/services.ts`
- `content/cities.ts`
- `content/blog-posts.ts`
- `content/projects.ts`

Medium term:

- `content/articles/*.mdx`
- `content/projects/*.json` or CMS-backed records
- typed schema validation

Project entity:

- `id`
- `citySlug`
- `serviceSlug`
- `title`
- `material`
- `length`
- `height`
- `priceRange`
- `completedAt`
- `photos`
- `review`
- `isFeatured`

### Целевая структура изображений

- `/public/images/projects/{project-id}/main.webp`
- `/public/images/projects/{project-id}/before.webp`
- `/public/images/projects/{project-id}/after.webp`
- `/public/images/projects/{project-id}/gallery-01.webp`
- `/public/images/services/{service-slug}/hero.webp`
- `/public/images/blog/{slug}/cover.webp`
- `/public/images/og/{route-or-template}.jpg`

Каждое изображение должно иметь:

- alt;
- width/height или responsive `sizes`;
- связь с city/service/project;
- реальные фото вместо generated SVG.

### Целевая структура компонентов

- `Container` / `SiteContainer`
- `Section`
- `SectionHeader`
- `Button` / `CTAButton`
- `PhoneLink`
- `MessengerLinks`
- `Breadcrumbs`
- `JsonLdScript`
- `ProjectCard`
- `ProjectGallery`
- `PriceTable` / `PriceCardsMobile`
- `LeadForm`
- `QuizForm`
- `SEOText`
- `FAQ`
- `RelatedLinks`

### SEO-кластеры

Service cluster:

- Заборы из профнастила.
- Евроштакетник.
- Сетка-рабица.
- Ворота.
- Калитки.

City cluster:

- 40-50 городов.
- На каждом городе: местные объекты, соседние города, услуги, CTA.

Price cluster:

- `/tseny`
- статьи про стоимость;
- калькулятор/квиз;
- project examples with price ranges.

Trust cluster:

- `/nashi-raboty`
- `/otzyvy`
- case studies.

Information cluster:

- выбор материала;
- уход;
- нормы/разрешения;
- подготовка участка;
- ворота/автоматика.

### Internal Linking

- Service -> related services -> priority cities -> projects -> CTA.
- City -> services -> local projects -> related cities -> CTA.
- Project -> city -> service -> price -> CTA.
- Blog -> service/city/price pages -> related articles -> CTA.
- Prices -> services -> project examples -> lead form.

### Mobile-first architecture

- Compact sticky header.
- Bottom CTA with call + messenger + calculate.
- Price/cards readable without horizontal friction.
- Quiz with optional unknown fields.
- Forms short by default.
- Real project photos before long SEO text.

### Infrastructure target

Lead pipeline:

1. Validate.
2. Assign `leadId`.
3. Atomically persist.
4. Send Telegram.
5. If Telegram fails, keep lead status `pending_delivery`.
6. Retry/report failed deliveries.
7. Return success if lead is safely stored.

Storage:

- Current small scale: Vercel KV list/hash with atomic push.
- Future if CRM grows: lightweight DB/table with status/history.

Security:

- `CRON_SECRET` mandatory in production.
- `TELEGRAM_WEBHOOK_SECRET` mandatory in production.
- `TELEGRAM_CHAT_ID` allowlist mandatory in production.
- Durable rate limiting.

Analytics:

- `click_call`
- `click_telegram`
- `click_whatsapp`
- `click_viber`
- `form_start`
- `form_submit`
- `form_success`
- `form_error`
- `quiz_start`
- `quiz_step`
- `quiz_success`
- `price_view`
- `portfolio_filter`
- `project_view`

## Этап 16. Roadmap

Оценка roadmap: реалистичный, без лишнего enterprise.

### КРИТИЧНО - исправить сейчас

| Пункт | SEO эффект | Заявки | Поддержка | Сложность | Риск |
|---|---|---|---|---|---|
| Нормализовать sitemap/canonical/OG/JSON-LD/internal links на no-slash | Очень высокий | Средний | Высокий | Средняя | Средний |
| Закрыть `masterzabor-site.vercel.app` от индексации/дубля | Высокий | Низкий | Средний | Низкая/средняя | Средний |
| Сделать lead storage атомарным | Низкий | Очень высокий | Высокий | Средняя | Средний |
| Сделать `CRON_SECRET` fail-closed | Низкий | Средний | Высокий | Низкая | Низкий |
| Сделать Telegram webhook secret/chat allowlist mandatory in production | Низкий | Средний | Высокий | Низкая | Низкий |
| Убрать или реализовать `SearchAction` | Средний | Низкий | Средний | Низкая/средняя | Низкий |
| Добавить `sizes` для `Image fill` | Средний | Средний | Средний | Низкая | Низкий |
| Диагностировать зависший `next build` | Средний | Средний | Очень высокий | Средняя | Средний |

### ВАЖНО - ближайшие месяцы

| Пункт | SEO эффект | Заявки | Поддержка | Сложность | Риск |
|---|---|---|---|---|---|
| Реальные project/portfolio photos | Очень высокий | Очень высокий | Средний | Средняя | Низкий |
| Добавить `Project` content model | Высокий | Высокий | Высокий | Средняя | Средний |
| Добавить conversion events | Средний | Очень высокий | Высокий | Средняя | Низкий |
| Добавить `Цены` в header | Средний | Высокий | Низкий | Низкая | Низкий |
| Mobile quiz: "Не знаю длину" | Низкий | Высокий | Низкий | Низкая | Низкий |
| Product JSON-LD offer URL на service URL | Средний | Низкий | Средний | Низкая | Низкий |
| Перейти от repeated placeholder helpers к image/project components | Средний | Высокий | Высокий | Средняя | Средний |
| Pin dependencies, убрать `latest` | Низкий | Низкий | Высокий | Низкая | Низкий |
| Заменить `next lint` на ESLint CLI | Низкий | Низкий | Высокий | Низкая | Низкий |
| Добавить tests для sitemap/canonical/API/phone utils | Высокий | Средний | Очень высокий | Средняя | Средний |

### ЖЕЛАТЕЛЬНО - улучшения

| Пункт | SEO эффект | Заявки | Поддержка | Сложность | Риск |
|---|---|---|---|---|---|
| MDX/CMS для blog на 500+ статей | Высокий | Средний | Высокий | Средняя/высокая | Средний |
| Категории блога и контентные кластеры | Высокий | Средний | Средний | Средняя | Средний |
| Image sitemap | Средний | Средний | Средний | Средняя | Низкий |
| Отдельные case study pages | Высокий | Высокий | Средний | Средняя | Низкий |
| Mobile price cards вместо широких таблиц | Низкий | Средний | Средний | Средняя | Низкий |
| Автоматический OG image generation | Средний | Низкий | Средний | Средняя | Низкий |
| CRM/inbox для лидов | Низкий | Высокий | Высокий | Средняя/высокая | Средний |

## Итоговые оценки разделов

| Раздел | Оценка |
|---|---|
| Production host/domain | Хорошо |
| URL/canonical/sitemap | Критическая проблема |
| Robots | Хорошо |
| Favicon/search appearance | Хорошо |
| JSON-LD | Требует доработки |
| Search Console/indexing | Критическая проблема |
| Architecture | Удовлетворительно/хорошо |
| Frontend | Удовлетворительно |
| Mobile-first | Требует доработки |
| Performance | Удовлетворительно статически, требует измерений |
| Telegram/leads | Требует доработки |
| Analytics | Хорошо как база, требует conversion events/env verification |
| City pages | Требует доработки |
| Blog | Требует доработки |
| CRO | Требует доработки |

## Самое дорогое через год

- Исправлять индексирование после массового размножения slash/canonical конфликтов.
- Переделывать 500 статей из TS HTML strings.
- Восстанавливать потерянные лиды без нормального storage/status.
- Чистить doorway city/service pages после ухудшения индексации.
- Переносить фото без единой project/image model.

## Этап A. Production Audit

Оценка: критическая проблема в URL/canonical-сигналах, остальное удовлетворительно/хорошо.

### robots.txt

Production URL: https://www.masterzabor.by/robots.txt

Факт:

```txt
User-Agent: *
Allow: /
Disallow: /api/

Host: www.masterzabor.by
Sitemap: https://www.masterzabor.by/sitemap.xml
```

Вывод:

- Правильно: сайт открыт для индексации.
- Правильно: API закрыт от обхода.
- Правильно для Yandex: указан `Host: www.masterzabor.by`.
- Правильно: sitemap указан на canonical host.

Решение: оставить, после исправления sitemap проверить ещё раз.

### sitemap.xml

Production URL: https://www.masterzabor.by/sitemap.xml

Факты:

- sitemap отдаёт `200`.
- В sitemap около 59 URL.
- Большинство внутренних URL указаны со trailing slash: `/gomel/`, `/zabory-iz-profnastila/`, `/blog/.../`.
- Эти URL в production редиректят `308` на версии без slash.

Реальные примеры:

- `https://www.masterzabor.by/zabory-iz-profnastila/` -> `308` -> `https://www.masterzabor.by/zabory-iz-profnastila`
- `https://www.masterzabor.by/gomel/` -> `308` -> `https://www.masterzabor.by/gomel`
- `https://www.masterzabor.by/blog/kakoy-zabor-vybrat-dlya-chastnogo-doma-v-belarusi/` -> `308` -> URL без slash

Вывод:

- Sitemap сейчас подаёт поисковикам redirecting URLs.
- Для Google sitemap inclusion является слабым canonical-сигналом, но он должен совпадать с canonical и рабочими URL.
- Для Yandex sitemap URL с редиректом может попадать в статус `Redirect`; документация Yandex рекомендует убрать redirect и сообщить роботу об обновлении.

Решение:

- Выбрать один URL-стиль.
- Рекомендуемый стиль: без trailing slash, потому что это текущий Next.js default и production уже отдаёт 200 именно так.
- Исправить `app/sitemap.ts`, metadata path, internal links, OpenGraph URL, JSON-LD URL.

### Canonical URL

Факты:

- Homepage canonical: `https://www.masterzabor.by` - корректно.
- Внутренние страницы часто имеют canonical со slash.
- Canonical URL со slash сам редиректит на no-slash.

Примеры:

- Рабочая страница `https://www.masterzabor.by/zabory-iz-profnastila` имеет canonical `https://www.masterzabor.by/zabory-iz-profnastila/`.
- Рабочая страница `https://www.masterzabor.by/gomel` имеет canonical `https://www.masterzabor.by/gomel/`.

Вывод:

- Canonical указывает не на фактическую 200-страницу, а на URL, который делает redirect.
- Yandex может игнорировать canonical, если canonical URL недоступен как конечная страница или редиректит.
- Google получает конфликт: redirect говорит одно, canonical/sitemap говорят другое.

Решение:

- Canonical должен указывать на final 200 URL.
- Для текущего проекта это no-slash URL.

### Redirects

Факты:

- `https://www.masterzabor.by/` -> `200`.
- `https://masterzabor.by/` -> `307` -> `https://www.masterzabor.by/`.
- `http://masterzabor.by/` -> `308` -> `https://masterzabor.by/` -> `307` -> `https://www.masterzabor.by/`.
- `http://www.masterzabor.by/` -> `308` -> `https://www.masterzabor.by/`.
- Внутренние URL со slash -> `308` -> no-slash.
- `https://masterzabor-site.vercel.app/` -> `200`.

Вывод:

- Canonical host выбран правильно: `www.masterzabor.by`.
- Apex -> www работает, но через временный `307`, что слабее для SEO, чем постоянный redirect.
- Vercel deployment URL является публичным дублем production.
- Нельзя добавлять redirect `www -> apex`: в истории проекта уже был риск redirect loop.

Решение:

- Оставить canonical host `www`.
- Добиться постоянного apex -> www без loop.
- Закрыть `masterzabor-site.vercel.app` от индексации или редиректить на `www`.

### Favicon, OpenGraph, JSON-LD

Факты:

- `/favicon.ico` отдаёт 200.
- `/apple-touch-icon.png` отдаёт 200.
- `/icon.svg` отдаёт 200.
- `/favicon.svg` отдаёт 404, но в head используется `/icon.svg`.
- `/manifest.webmanifest` отдаёт 200.
- `/images/og-masterzabor.jpg` отдаёт 200, размер заявлен как 1200x630.
- OpenGraph и Twitter Card присутствуют.
- LocalBusiness, Organization, WebSite JSON-LD присутствуют.
- WebSite JSON-LD содержит `SearchAction` на `/blog/?q=...`, но реального поиска в блоге не найдено.

Вывод:

- Базовый search appearance настроен хорошо.
- Conventional `/favicon.svg` отсутствует, но это не критично, если head указывает на рабочий `/icon.svg`.
- Главный риск favicon в поиске не техническая доступность, а время переобхода и выбор поисковиком.
- `SearchAction` лучше удалить или реализовать поиск.

Решение:

- Оставить рабочие favicon assets.
- Добавить `/favicon.svg` как alias/копию при желании.
- Убрать фальшивый `SearchAction` или сделать поиск.
- Проверить snippet titles/descriptions после исправления canonical.

## Этап B / 7. Search Console & Indexing Audit

Оценка: критическая проблема.

### Ошибка переадресации

Вероятные причины:

- цепочки `http -> https -> www`;
- временный `307` на apex -> www;
- sitemap/canonical указывают URL, который затем делает redirect;
- исторические изменения доменной схемы.

Примеры для проверки в GSC:

- `https://masterzabor.by/`
- `http://masterzabor.by/`
- `https://www.masterzabor.by/gomel/`
- `https://www.masterzabor.by/zabory-iz-profnastila/`

Серьёзность: высокая.

Решение:

- Сократить redirect architecture.
- Сделать все sitemap/canonical URL конечными 200 URL.
- Проверить, что Vercel не создаёт конфликт primary domain.

### Страница с переадресацией

Причина:

- sitemap содержит URL со trailing slash, а production редиректит их на no-slash.

Реальные URL:

- `https://www.masterzabor.by/gomel/`
- `https://www.masterzabor.by/minsk/`
- `https://www.masterzabor.by/zabory-iz-profnastila/`
- `https://www.masterzabor.by/blog/kakoy-zabor-vybrat-dlya-chastnogo-doma-v-belarusi/`

Серьёзность: высокая.

Решение:

- Перегенерировать sitemap без trailing slash.
- Переслать sitemap в GSC/Yandex Webmaster.

### Вариант страницы с canonical

Причина:

- рабочая no-slash страница указывает canonical на slash URL;
- slash URL редиректит обратно на no-slash.

Серьёзность: высокая.

Решение:

- canonical должен совпадать с final URL.
- OpenGraph URL и JSON-LD URL должны совпадать с canonical.

### Обнаружена, не проиндексирована

Вероятные причины:

- conflicting canonical/redirect signals;
- много похожих городских страниц;
- placeholder-изображения вместо уникальных работ;
- слабые локальные доказательства по городам;
- молодой/узкий контентный граф.

Серьёзность: средняя/высокая.

Решение:

- Сначала техническая каноникализация.
- Затем усиление уникальности city pages: реальные объекты, цены, сроки, отзывы, районы, фото.

### Просканирована, но не проиндексирована

Вероятные причины:

- Google смог открыть страницу, но посчитал её недостаточно полезной/уникальной;
- templated city pages;
- недостаток реальных фото и доказательств;
- слабая внутренняя перелинковка;
- мало контентных кластеров.

Серьёзность: средняя/высокая.

Решение:

- Усилить контент и доверие.
- Не плодить service-city комбинации без уникального спроса и фактического контента.

## Этап C / 11. Favicon & Search Appearance Audit

Оценка: хорошо, с доработками.

Файлы:

- `favicon.ico`: есть, 200.
- `favicon-16x16.png`: есть.
- `favicon-32x32.png`: есть.
- `favicon-48x48.png`: есть.
- `apple-touch-icon.png`: есть, 200.
- `icon.svg`: есть, 200.
- `favicon.svg`: 404.
- `manifest.webmanifest`: есть, 200.
- `site.webmanifest`: 404.
- `manifest.json`: 404.
- `og-masterzabor.jpg`: есть, 200.

Вывод по Google:

- Google не гарантирует показ favicon даже при выполнении требований.
- Googlebot-Image должен иметь доступ к favicon, home page не должна быть закрыта.
- Обновление может занять от нескольких дней до нескольких недель после recrawl.

Вывод по Yandex:

- Yandex ориентируется на доступность favicon и переобход главной.
- После исправлений главную нужно отправить на переобход в Yandex Webmaster.

CTR/snippet:

- Брендовый favicon и OG уже есть.
- CTR будет ограничен, если сниппеты выглядят generic и без сильного коммерческого обещания.
- Нужно усилить title/description для услуг и городов: материал, цена/срок, регион, доверие.

## Этап D / 8 / 9 / 10. Infrastructure, Domains, Telegram, Analytics

Оценка: требует доработки.

### Домены

Правильно:

- canonical brand URL выбран как `https://www.masterzabor.by`.
- `robots.txt`, sitemap, metadataBase используют `www`.
- Telegram webhook в constants указывает на `www`, что важно, потому что Telegram POST не должен попадать в redirect.

Проблемы:

- apex -> www сейчас `307`, временный redirect.
- `masterzabor-site.vercel.app` отдаёт production 200 и может стать дублем.
- URL style внутри сайта конфликтует со slash/no-slash.

### Vercel Cron

Факт:

- `vercel.json` содержит два cron:
  - `/api/cron/daily-report`
  - `/api/cron/analytics-report`

Проблема:

- Если `CRON_SECRET` не задан, code path фактически fail-open.

Решение:

- В production cron endpoints должны fail-closed.
- Vercel Cron header/secret нужно проверять строго.

### Telegram

Правильно:

- Есть lead endpoint.
- Есть Telegram webhook.
- Есть bot commands/reporting.
- Есть daily/analytics reports.

Проблемы:

- lead storage через KV read-modify-write не атомарен;
- rate limit хранится в памяти serverless;
- если Telegram send падает после KV save, пользователь получает ошибку, хотя заявка сохранена;
- если KV save падает, Telegram не отправляется;
- webhook secret и chat allowlist опциональны.

Ответ на вопрос "выдержит ли 100 заявок в день":

- По объёму 100 заявок в день система, скорее всего, выдержит.
- По надёжности есть риск потери/перезаписи заявок при конкурентных запросах и риск операционной путаницы при сбоях Telegram/KV.

### Analytics

Правильно:

- Google Analytics client script подключается при `NEXT_PUBLIC_GA_ID`.
- Yandex Metrika script подключается при `NEXT_PUBLIC_YANDEX_METRIKA_ID`.
- Есть server-side reporting для GA/Yandex.

Нельзя подтвердить без env/account access:

- корректность ID;
- фактическую передачу событий;
- наличие GSC/Yandex Webmaster ownership;
- импорт целей в бизнес-отчёты.

Что не отслеживается явно:

- click-to-call;
- click Telegram/WhatsApp/Viber;
- form start;
- form success/error;
- quiz step;
- quiz completion;
- source/route attribution;
- price table engagement;
- portfolio engagement;
- failed lead delivery.

Бизнес теряет:

- понимание, какие страницы дают лиды;
- понимание, где люди бросают квиз;
- сравнение звонков, Telegram и форм;
- связку SEO landing -> conversion.
