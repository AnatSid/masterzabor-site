# Blog editorial and asset workflow

Этот документ описывает текущий процесс создания, редактирования, визуального оформления и публикации статей MasterZabor. Он служит подробным source of truth для нового Codex-чата. Фактический код и данные repository всегда имеют приоритет, если архитектура позже изменится.

## Обязательные документы

Перед работой со статьёй прочитайте:

- `AGENTS.md`: scope, Git, verification и deployment rules
- `docs/EDITORIAL-WRITING-GUIDE.md`: обязательный writing standard
- этот документ: blog architecture, lifecycle и asset workflow
- `docs/SEO-02-SITEMAP-LASTMOD-DISCOVERY.md`: полная модель semantic freshness
- task-specific research/content design document, если он существует

Исторические design-документы фиксируют решения своих этапов. Они не заменяют проверку текущего repository state.

## Текущая архитектура блога

Статья сейчас не хранится в отдельном Markdown, MDX или HTML-файле. Каждая статья является объектом `BlogPost` в `content/blog-posts.ts`. Поле `content` содержит HTML-строку, которую общий route выводит через `dangerouslySetInnerHTML`.

| Задача | Текущий source of truth |
| --- | --- |
| Модель и записи статей | `content/blog-posts.ts` |
| Blog index | `app/blog/page.tsx` |
| Dynamic article route | `app/blog/[slug]/page.tsx` |
| Scoped article typography | `app/blog/[slug]/page.module.css` |
| Общие metadata и JSON-LD helpers | `lib/seo.ts` |
| Sitemap route | `app/sitemap.ts` |
| Semantic freshness registry/helper | `lib/sitemap-freshness.ts` |
| Production blog images | `public/images/blog/` |

`app/blog/[slug]/page.tsx` использует `generateStaticParams()` и `dynamicParams = false`. Список статических article routes формируется из `blogPosts`; новый slug не существует как публичный route, пока его нет в этом массиве и новая сборка не завершена.

### Поля BlogPost

| Поле | Статус | Назначение |
| --- | --- | --- |
| `slug` | обязательное | Сегмент URL после `/blog/`; lower-case Latin, без trailing slash |
| `title` | обязательное | Видимый H1 и headline Article JSON-LD |
| `metaTitle` | обязательное | HTML title, Open Graph title и Twitter title |
| `metaDescription` | обязательное | Meta description, Open Graph/Twitter description и Article JSON-LD description |
| `excerpt` | обязательное | Вводный текст статьи и описание в карточке `/blog` |
| `content` | обязательное | HTML body статьи |
| `publishedAt` | обязательное | Дата фактической первой публикации в формате `YYYY-MM-DD` |
| `updatedAt` | опциональное | Дата существенного crawler-visible обновления |
| `image` | обязательное | Public path или legacy data URI для hero и карточки |
| `imageAlt` | опциональное | Описательный alt; при отсутствии article hero и `/blog` card используют `title` |
| `tags` | обязательное | Внутренние тематические данные; сейчас не выводятся в UI |

`publishedAt` не меняется при последующих правках. `updatedAt` добавляется или обновляется только после существенного изменения видимого содержания, schema, media или контекстных ссылок статьи.

### Metadata, canonical и schema

`generateMetadata()` в `app/blog/[slug]/page.tsx` передаёт запись статьи в `generatePageMetadata()` из `lib/seo.ts`:

- canonical строится для `/blog/${post.slug}` через общий no-slash `www` URL helper
- Open Graph получает `post.image` и `post.imageAlt`
- Twitter использует то же изображение
- metadata title и description приходят из `metaTitle` и `metaDescription`

Article JSON-LD формирует `generateArticleJsonLd()`. В нём `datePublished = publishedAt`, а `dateModified = updatedAt ?? publishedAt`. Public-path image включается как абсолютный canonical URL. Legacy `data:image/svg+xml` не включается в Article JSON-LD, потому что текущий route передаёт туда только `image`, начинающийся с `/`.

Breadcrumb JSON-LD формирует `generateBreadcrumbJsonLd()` для цепочки `Главная` → `Блог` → текущая статья. Видимые breadcrumbs находятся в том же article route.

### Presentation, hero, CTA и related articles

Общий article route отвечает за один H1, excerpt, hero, основной текст, sidebar и нижний lead block. Отдельную page-компоненту для каждой статьи создавать не нужно.

Hero выводится через `next/image` с intrinsic-размером `1200×630`, `priority`, адаптивной шириной и высотой по пропорции исходника. Это же поле `image` использует карточка `/blog`. Blog index сортирует записи по `publishedAt` от новых к старым и показывает дату публикации, title, excerpt, image и secondary CTA `Читать статью →`.

Текущий article CTA состоит из двух частей:

- sidebar card со ссылкой `Получить расчёт` на `#blog-lead-form`
- нижний `QuizForm` с `source={\`blog-post-${post.slug}\`}`

CTA предлагает расчёт ограждения. Он не должен обещать юридическую консультацию, разрешение, узаконивание или решение спора.

Блок `Другие статьи` не использует tags или semantic matching. Он исключает текущий slug из исходного массива `blogPosts` и берёт первые три записи через `.slice(0, 3)`. Контекстные ссылки в тексте остаются основным способом связать материалы по intent.

`tags` сохранены в data model, но hashtag pills не показываются ни в article page, ни в карточках `/blog`. Tag archive pages отсутствуют. Не создавайте taxonomy routes без отдельного решения по спросу и content architecture.

## Lifecycle новой статьи

Каждая новая SEO/editorial статья проходит последовательные этапы:

1. Исследуйте search demand, intent и overlap с существующими URL.
2. Для юридической или иной чувствительной темы проверьте первичные источники и область применимости.
3. Создайте semantic/content design document: URL, primary intent, границы темы, claim matrix, outline, sources и internal links.
4. Напишите draft статьи в рамках утверждённого design.
5. Проведите factual и editorial review по `docs/EDITORIAL-WRITING-GUIDE.md`.
6. Покажите текст и текущую presentation на localhost, desktop и mobile.
7. Проведите отдельный visual workflow для hero после одобрения текста и intent.
8. Подготовьте утверждённый master как production asset и подключите его к `BlogPost`.
9. Финализируйте metadata, Article/Breadcrumb JSON-LD и contextual internal links.
10. Обновите semantic sitemap freshness только у реально изменённых crawler-visible surfaces.
11. Запустите пропорциональные проверки и получите одобрение localhost.
12. Создайте stage commit, push и проверьте Vercel Preview.
13. После явного разрешения выполните merge в `main`, дождитесь Production Ready и проведите production smoke.

Текст статьи и hero image не создаются автоматически одним шагом. Сначала утверждаются intent, правовые границы и содержание. Изображение получает отдельное творческое решение и отдельное approval.

## Editorial standard

`docs/EDITORIAL-WRITING-GUIDE.md` обязателен для draft, редактирования и финального прохода. Новый workflow не дублирует guide: он определяет последовательность работы и техническое подключение, а guide определяет язык, структуру, factual discipline и финальный self-check.

Для юридической статьи дополнительно:

- используйте актуальные первичные и официальные источники
- отделяйте прямую норму от ограниченного правового вывода
- отделяйте правовой вывод от практической рекомендации
- повторно проверяйте действующую редакцию непосредственно перед публикацией
- не выдумывайте нормы, цифры, штрафы, судебную практику, сроки или универсальные обязанности сторон
- не повышайте разъяснение или research gap до статуса прямой нормы

Внутренние редакционные метки `DIRECT RULE`, `LEGAL CONCLUSION` и `PRACTICAL RECOMMENDATION` помогают контролировать claim matrix. Их не нужно автоматически выводить в опубликованный русский текст.

## Visual workflow

Hero создаётся как отдельный editorial asset:

1. Утвердите search intent и content design статьи.
2. Завершите и согласуйте текст до генерации финального hero.
3. Откройте отдельный ChatGPT visual chat.
4. Передайте в него self-contained контекст статьи, аудитории, бренда, запрещённых образов и production ratio.
5. Сначала запросите 2–3 композиционных направления без генерации финального изображения.
6. Выберите одно направление и явно утвердите его.
7. Только после approval запускайте image generation.
8. Не просите AI-generator перерисовывать логотип MasterZabor.
9. Если логотип нужен в композиции, используйте настоящий existing brand asset отдельным техническим слоем после отдельного одобрения.
10. Верните финальный master в Codex workflow для проверки, оптимизации и подключения.

Сюжет определяется intent конкретной статьи. Не копируйте hero предыдущей статьи как шаблон и не используйте случайное service image без смысловой связи.

## External master и production asset

### External master/source image

External master может находиться вне Git repository. Это утверждённый исходник, а не файл, который сайт обязан загружать напрямую. Зафиксируйте известный абсолютный source path, фактический формат, dimensions и размер. Если provenance неизвестна, напишите `not recorded / unknown` и не восстанавливайте путь по догадке.

### Production asset

Production asset находится внутри repository в `public/images/blog/`. Сайт использует именно этот файл. Он может быть технически подготовлен из external master.

Без отдельного approval Codex не должен:

- перегенерировать утверждённый master
- менять сюжет или композиционный смысл
- заменять изображение другим
- дорисовывать или удалять объекты
- изменять branding или добавлять выдуманный логотип

После утверждения master Codex может:

- определить реальный file format, dimensions, aspect ratio и размер файла
- конвертировать PNG/JPEG в WebP
- resize или crop до утверждённого production target без искажения композиции
- оптимизировать file size
- сохранить sRGB
- положить production copy в repository
- подключить public path и отдельный alt к `BlogPost`

Если resize/crop отрезает значимый объект или меняет смысл кадра, остановитесь и получите approval. Техническая оптимизация не разрешает творческую переработку master.

## Текущая convention для blog images

Page A и Page B подтверждают текущую editorial convention:

- production target: `1200×630`
- aspect ratio: примерно `1.91:1`
- production format: WebP
- композиция должна работать как article hero, blog card и social preview
- не встраивайте текст в hero без отдельного решения
- используйте lower-case Latin slug-oriented filename
- храните alt отдельно от filename в `imageAlt`
- описывайте изображение в alt без keyword stuffing
- сохраняйте sRGB и проверяйте отсутствие distortion

Это текущая утверждённая практика, а не вечная framework-константа. При будущей смене presentation сначала проверьте реальный route и размеры social metadata.

## Asset registry

Registry описывает все четыре текущие статьи. Размер `1200×630` у первых двух записей задан внутри SVG generator; отдельного production-файла для них нет.

| Article | Slug | `publishedAt` | `updatedAt` |
| --- | --- | --- | --- |
| Какой забор лучше: профнастил или евроштакетник? | `kakoy-zabor-luchshe-profnastil-ili-evroshtaketnik` | `2026-05-18` | отсутствует |
| Сколько стоит поставить забор в Беларуси в 2026 году? | `skolko-stoit-postavit-zabor-v-belarusi-2026` | `2026-05-18` | отсутствует |
| Нужно ли разрешение на установку забора в Беларуси | `nuzhno-li-razreshenie-na-ustanovku-zabora-v-rb` | `2026-05-18` | `2026-09-12` |
| Высота забора между соседями в Беларуси: действует ли предел 2 м | `vysota-zabora-mezhdu-sosedyami-v-belarusi` | `2026-09-12` | отсутствует |

| Slug | External master/source | Production representation | Dimensions / format / size | Alt | Current usage |
| --- | --- | --- | --- | --- | --- |
| `kakoy-zabor-luchshe-profnastil-ili-evroshtaketnik` | `not recorded / unknown` | Inline `data:image/svg+xml` из `blogImage()` в `content/blog-posts.ts`; repository asset отсутствует | `1200×630`, SVG data URI, отдельный file size отсутствует | `imageAlt` не задан: hero/card используют title; Open Graph получает общий default alt из `generatePageMetadata()` | article hero, `/blog` card, Open Graph, Twitter; не включается в Article JSON-LD |
| `skolko-stoit-postavit-zabor-v-belarusi-2026` | `not recorded / unknown` | Inline `data:image/svg+xml` из `blogImage()` в `content/blog-posts.ts`; repository asset отсутствует | `1200×630`, SVG data URI, отдельный file size отсутствует | `imageAlt` не задан: hero/card используют title; Open Graph получает общий default alt из `generatePageMetadata()` | article hero, `/blog` card, Open Graph, Twitter; не включается в Article JSON-LD |
| `nuzhno-li-razreshenie-na-ustanovku-zabora-v-rb` | `not recorded / unknown` | `public/images/blog/razreshenie-na-zabor-v-belarusi.webp` | `1200×630`, WebP, 190,410 bytes, sRGB | `Забор на частном участке и схема границ перед установкой в Беларуси` | article hero, `/blog` card, Open Graph, Twitter, Article JSON-LD |
| `vysota-zabora-mezhdu-sosedyami-v-belarusi` | Verified current file: `C:\DiscD\проекты сайта\Фото типов забора\Картинки для статей\vysota-zabora-mezhdu-sosedyami-v-belarusi.webp.png` | `public/images/blog/vysota-zabora-mezhdu-sosedyami-v-belarusi.webp` | source: PNG, `1731×909`, 2,741,113 bytes, sRGB; production: `1200×630`, WebP, 194,300 bytes, sRGB | `Забор на границе двух соседних частных участков в Беларуси` | article hero, `/blog` card, Open Graph, Twitter, Article JSON-LD |

Page B production image был технически преобразован из утверждённого PNG master. Он не был перегенерирован. Repository подтверждает production path, `1200×630`, WebP, 194,300 bytes и sRGB. Текущий внешний файл подтверждает PNG, `1731×909`, 2,741,113 bytes и sRGB.

BLOG-DOCS-01 handoff также назвал source path `C:\DiscD\проекты сайта\Фото типов забора\Картинки для статей\vysota-zabora-mezhdu-sosedyami-v-belarusi.webp-Alt Забор на границе двух соседних частных участков в Беларуси.png`. Файл с таким именем не найден при проверке 14 сентября 2026 года. Не используйте этот вариант пути без новой проверки; совпадающий по свойствам master сейчас находится по verified path из таблицы.

## Semantic freshness

Текущая SEO-02 policy:

- `publishedAt` равен фактической первой публикации
- `updatedAt` меняется только при существенном crawler-visible обновлении
- article sitemap lastmod равен `updatedAt ?? publishedAt`
- `/blog` получает максимальную фактическую дату среди видимых статей и своей template freshness
- CSS/layout-only правки не меняют freshness
- build, deploy, commit и текущая дата не являются content date
- blanket current date запрещён

Полная dependency model находится в `docs/SEO-02-SITEMAP-LASTMOD-DISCOVERY.md`. Перед обновлением даты перечислите фактически изменённые rendered surfaces.

## Internal linking и taxonomy

Внутренние ссылки должны объяснять читателю страницу назначения и находиться в естественном контексте. Автоматический related block не заменяет ссылки между материалами одного intent cluster.

Не создавайте отдельные URL под supporting intent, tags или category только потому, что данные уже существуют. Новый taxonomy/search URL требует отдельного исследования спроса, SERP overlap и границ контента.

## Verification checklist

Для новой или существенно обновлённой статьи проверьте:

- `npm run lint`
- `npm run build`, когда этого требует `AGENTS.md`, включая изменение набора static routes
- localhost desktop и mobile
- один H1
- title и description
- canonical `https://www.masterzabor.by/...` без trailing slash
- Article JSON-LD
- Breadcrumb JSON-LD
- hero dimensions, crop, quality и alt
- абсолютные Open Graph и Twitter image URLs для repository asset
- contextual internal links и destination URLs
- публичные source links и соответствие утверждениям
- sitemap membership и semantic lastmod
- отсутствие trailing-slash regression
- Next DevTools errors
- browser console
- Vercel Preview после stage push
- Production smoke после разрешённого merge

Не добавляйте отдельную test framework только для blog workflow.

## Branch, Preview и Production

Стандартный delivery flow:

1. Создайте `codex/<stage-id>-<meaning>` от актуального `main`.
2. Выполните local checks по риску изменения.
3. Покажите localhost и получите user approval.
4. Создайте commit и push stage branch.
5. Дождитесь Vercel Preview Ready и проверьте целевые страницы.
6. Получите явное разрешение на Production.
7. Merge stage branch в `main` и push `main`. Этот push запускает Vercel Production.
8. Дождитесь Production Ready и проведите smoke на canonical `www` URLs.
9. Подтвердите синхронизацию `main` с `origin/main` и clean worktree.

Никогда не пропускайте Preview и явное разрешение пользователя для merge/push `main`.
