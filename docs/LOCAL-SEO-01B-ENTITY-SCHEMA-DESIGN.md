# LOCAL-SEO-01B — Entity / schema architecture

Дата аудита: 2026-09-23

Статус: **APPROVED DESIGN / IMPLEMENTATION NOT STARTED**

Repository baseline: `3f763cb893bd32b38efb29eec1d5636e3503dbd2`

Production: `https://www.masterzabor.by`

## 1. Scope и система доказательств

Цель этапа — проверить фактический JSON-LD и выбрать одну правдивую модель для
MasterZabor: одна компания, реальный административный/внутренний адрес в Гомеле,
работа по Беларуси, city pages как страницы зон обслуживания, а не филиалы.

Метки в документе:

| Метка | Значение |
| --- | --- |
| **VERIFIED FACT** | Подтверждено repository code и/или rendered Production HTML. |
| **OFFICIAL GUIDANCE** | Прямое указание Google Search Central или определение Schema.org. |
| **DESIGN RECOMMENDATION** | Выбранное архитектурное решение MasterZabor; не требование Google. |
| **OPEN QUESTION** | Нужен подтверждённый business fact до implementation. |

Проверено:

- source: `app/layout.tsx`, `lib/seo.ts`, `components/templates/CityPage.tsx`,
  `components/templates/ServicePage.tsx`, `/`, `/kontakty`, `/tseny`, `/blog` и
  `/blog/[slug]`;
- rendered Production JSON-LD: `/`, `/kontakty`, `/lida`, `/grodno`, `/vitebsk`,
  `/zabory-iz-profnastila`, `/tseny` и permission article;
- SearchAction target: `/blog?q=prof`;
- официальные источники:
  - [Google: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization);
  - [Google: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business);
  - [Google: general structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies);
  - [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article);
  - [Google: Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet);
  - [Google: sitelinks search box retirement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box);
  - [Schema.org: LocalBusiness](https://schema.org/LocalBusiness),
    [Service](https://schema.org/Service),
    [areaServed](https://schema.org/areaServed),
    [provider](https://schema.org/provider) и
    [brand](https://schema.org/brand).

Никаких application/schema изменений, validator submissions, GSC changes или deploy
в этом этапе нет.

## 2. Current-state map

### 2.1 Глобальные nodes из root layout

**VERIFIED FACT:** `app/layout.tsx` вставляет три отдельных JSON-LD script на каждом
маршруте. Production подтверждает одинаковые nodes на всех восьми проверенных URL.

| Node | `@id` | Основные поля | Связи |
| --- | --- | --- | --- |
| `LocalBusiness` | `https://www.masterzabor.by/#localbusiness` | `name: МастерЗабор`; root URL; телефон; УНП; Гомельский address; Gomel geo; opening hours; `areaServed: Country/Беларусь` | Нет связи с `#organization`. |
| `Organization` | `https://www.masterzabor.by/#organization` | то же имя/root URL/телефон; тот же Гомельский address; logo/image; `areaServed: "BY"` | На него ссылается `WebSite.publisher`. |
| `WebSite` | `https://www.masterzabor.by/#website` | root URL; `name: МастерЗабор`; `inLanguage: ru-BY` | `publisher -> #organization`; `SearchAction -> /blog?q={search_term_string}`. |

Глобальный `LocalBusiness` содержит согласованный физический набор:

- `streetAddress: пр. Речицкий, 7А, оф. 5.11`;
- `addressLocality: Гомель`;
- `postalCode: 246027`;
- `geo: 52.4345, 30.9754`;
- `areaServed: Беларусь`.

### 2.2 Route families в Production

| Route / family | JSON-LD objects, включая root | Page-specific objects |
| --- | --- | --- |
| `/` | 4 | `FAQPage` с 6 `mainEntity` Question nodes. |
| `/kontakty` | 4 | `BreadcrumbList` с 2 items. |
| `/lida`, `/grodno`, `/vitebsk` | 5 | city-specific `LocalBusiness` + `BreadcrumbList`. |
| Service page `/zabory-iz-profnastila` | 6 | `Product` + `BreadcrumbList` + `FAQPage`. |
| `/tseny` | 10 | `BreadcrumbList` + 6 отдельных `Product`. |
| Permission article | 5 | `Article` + `BreadcrumbList`. |
| `/blog` | 3 | Только три root nodes; page-specific JSON-LD отсутствует. |
| `/nashi-raboty`, `/otzyvy` | 4 по repository callsites | `BreadcrumbList`. |

JSON-LD отдаётся отдельными script blocks, а не одним `@graph`. Это синтаксически
допустимо; само по себе объединение в `@graph` не является целью миграции.

### 2.3 City-specific `LocalBusiness`

**VERIFIED FACT:** `generateCityLocalBusinessJsonLd()` определён внутри
`components/templates/CityPage.tsx`. Он создаёт новую business identity на каждом city
URL:

| Route | `@id` / `url` / `name` | `address` | `geo` | `areaServed` |
| --- | --- | --- | --- | --- |
| `/lida` | `/lida#localbusiness`; `/lida`; `МастерЗабор — заборы в Лиде` | `streetAddress` содержит полный адрес `Беларусь, г. Гомель, ... 246027`, но `addressLocality: Лида`, `addressRegion: Гродненская область` | `53.8916, 25.3027` | `City/Лида` |
| `/grodno` | `/grodno#localbusiness`; `/grodno`; `МастерЗабор — заборы в Гродно` | тот же полный Гомельский `streetAddress`, но `addressLocality: Гродно`, `addressRegion: Гродненская область` | `53.6694, 23.8131` | `City/Гродно` |
| `/vitebsk` | `/vitebsk#localbusiness`; `/vitebsk`; `МастерЗабор — заборы в Витебске` | тот же полный Гомельский `streetAddress`, но `addressLocality: Витебск`, `addressRegion: Витебская область` | `55.1848, 30.2016` | `City/Витебск` |

Другие поля city node: formatted display phone, `priceRange`, УНП, opening hours и
описание услуги. Node не ссылается на global `#organization` или `#localbusiness`.

### 2.4 Product, Article и вспомогательные nodes

**Product**

- **VERIFIED FACT:** service page Product не имеет `@id` или top-level `url`, но Offer
  содержит canonical service URL.
- **VERIFIED FACT:** `brand` — вложенный anonymous `Brand { name: "МастерЗабор" }`,
  не ссылка на одну из global business entities.
- **VERIFIED FACT:** `/tseny` повторяет этот pattern для шести Product nodes.
- **VERIFIED FACT:** SEO-01 уже исправил `image` и Offer URL, а representative service
  Product прошёл GSC Live Test. Эти поля не следует переделывать в entity migration.

**Article**

- **VERIFIED FACT:** Article имеет `headline`, description, dates, image и canonical
  `mainEntityOfPage`, но не имеет собственного `@id`.
- **VERIFIED FACT:** `author` и `publisher` — два anonymous embedded
  `Organization { name: "МастерЗабор" }`; они не ссылаются на `#organization`.
- **VERIFIED FACT:** visible article header показывает дату, title и excerpt, но не
  выводит явную author byline.

**FAQPage / BreadcrumbList**

- **VERIFIED FACT:** page-specific, отражают видимые FAQ/breadcrumbs и не содержат
  business identity.
- Отсутствие `@id` у этих nodes не создаёт текущего location conflict.

## 3. Confirmed problems

### P1 — city nodes создают ложный composite physical location

**VERIFIED FACT:** city `LocalBusiness.address` одновременно содержит полный текст
Гомельского адреса в `streetAddress` и другой город/область в `addressLocality` /
`addressRegion`. `geo` при этом относится к целевому городу, а не к реальному адресу.

**OFFICIAL GUIDANCE:** Google определяет `LocalBusiness.address` как физическое
местоположение бизнеса, а `geo` — как координаты business location. Schema.org
определяет `LocalBusiness` как конкретный физический бизнес или филиал.

**Вывод:** `/lida`, `/grodno`, `/vitebsk` и общий template для остальных city pages
утверждают физические locations, которых business facts не подтверждают. Это главный
подтверждённый schema-конфликт.

### P2 — одна компания представлена двумя несвязанными global identities

**VERIFIED FACT:** `#localbusiness` и `#organization` имеют одинаковые name, root URL,
telephone и Gomel address, но разные `@id` и не связаны между собой.

Это не доказывает ложные business facts: Schema.org `LocalBusiness` уже является
подтипом `Organization` и `Place`. Проблема — identity ambiguity и ненужное
дублирование: crawler видит два node identifiers там, где подтверждён один бизнес.

При текущем подтверждённом статусе Gomel address как прежде всего
administrative/internal office консолидация должна вести к `Organization`. Тип
`LocalBusiness` допустим позднее только после подтверждения реальной публичной
customer-facing location.

### P3 — Article publisher/author фрагментируют identity

**VERIFIED FACT:** Article создаёт ещё два anonymous Organization objects с тем же
именем вместо ссылки на canonical business `@id`.

Publisher как MasterZabor выглядит логично, но связь технически потеряна. Author
нельзя окончательно нормализовать без решения о реальном и видимом byline.

### P4 — SearchAction описывает несуществующий search experience

**VERIFIED FACT:** `app/blog/page.tsx` не читает `searchParams` и всегда выводит все
четыре статьи. Production `/blog` и `/blog?q=prof` имеют один canonical, один H1 и один
список из тех же четырёх статей. Следовательно, заявленный SearchAction ничего не ищет.

**OFFICIAL GUIDANCE:** Google прекратил sitelinks search box globally 21 ноября 2024;
markup больше не поддерживается как Google Search feature и не влияет на ranking.
Google также говорит, что unsupported markup сам по себе не создаёт Search Console
ошибку. Здесь причина удаления не penalty, а фактическая неточность action.

### P5 — отдельная Product eligibility note, не entity blocker

**VERIFIED FACT:** `/tseny` — pricing/category page с шестью разными Product nodes.

**OFFICIAL GUIDANCE:** Google Product rich results рассчитаны на страницы, сфокусированные
на одном product или variants одного product, и рекомендуют Product markup на product
pages, а не category/list pages.

Это не делает JSON-LD синтаксически невалидным и не объясняет city indexing. Семантику
шести Product на `/tseny` следует при необходимости рассматривать отдельным Product
schema stage; она не должна расширять LOCAL-SEO-01B implementation.

## 4. Контекст и элементы без автоматического redesign

Не исправлять автоматически:

1. **VERIFIED FACT:** глобальные гомельские address и geo технически согласованы между
   собой и с `/kontakty`. Реальность адреса подтверждена, но это само по себе не
   подтверждает публичную customer-facing location и не обосновывает `LocalBusiness.geo`.
2. **OFFICIAL GUIDANCE:** `areaServed` означает географию, где предоставляется услуга.
   Поэтому реальный organization/legal/postal address в Гомеле и
   `areaServed: Беларусь` не противоречат друг другу. Это не требует объявлять адрес
   публичной точкой посещения.
3. `Organization.areaServed: "BY"` допустим как Schema.org `Text`, хотя Country object
   читается яснее. После консолидации останется один canonical representation.
4. Organization markup повторяется на всех страницах. Google рекомендует homepage или
   одну organization page и прямо говорит, что повторять на каждой странице не нужно,
   но не называет повторение ошибкой. Для маленькой безопасной миграции root placement
   можно пока сохранить.
5. Несколько JSON-LD script вместо `@graph` допустимы. Единый `@graph` — возможный
   formatting choice, не SEO requirement.
6. `BreadcrumbList` и видимые `FAQPage` не участвуют в location conflict.
7. Product `Brand { name: "МастерЗабор" }` допустим: Schema.org разрешает `brand` как
   `Brand` или `Organization`. Не нужно менять работающий Product только ради общей
   формы IDs.
8. City coordinates в HTML geo meta tags не являются JSON-LD. Их изменение прямо вне
   scope; вывод P1 относится только к coordinates, объявленным как `LocalBusiness.geo`.

## 5. Target entity model

### 5.1 Один canonical business node: Organization-first

**DESIGN RECOMMENDATION на текущих business facts:** использовать один global node с
текущим стабильным `@id: https://www.masterzabor.by/#organization` и
`@type: Organization`.

Node описывает одну nationwide service-area organization:

- `name`, root `url`, logo/image, telephone и taxID — только подтверждённые данные;
- реальный Gomel address можно сохранять как factual organization/legal/postal
  address, если такое представление корректно;
- `areaServed: { "@type": "Country", "name": "Беларусь" }`;
- не использовать `geo` как декларацию публичной клиентской точки;
- не использовать location `openingHours`, если `Пн-Вс 10:00-19:00` — часы обработки
  звонков или выездной работы, а не работы физической точки.

Выбор старого `#organization` как canonical ID минимизирует churn: на него уже
ссылается `WebSite.publisher`. Старый `#localbusiness` после migration не должен
остаться отдельной entity.

Условный будущий вариант: если новыми evidence будет подтверждено, что Gomel address —
реальная публичная customer-facing business location, допустим один canonical
`LocalBusiness` с тем же `/#organization`, реальным адресом, реальными coordinates,
реальными часами именно этой location и nationwide `areaServed`. До такого
подтверждения этот вариант не является target design.

### 5.2 WebSite

**DESIGN RECOMMENDATION:** оставить `WebSite` с `@id: /#website`, root URL,
site name, language и `publisher -> /#organization`. Удалить только
`potentialAction: SearchAction`; WebSite нужен независимо от retired search box.

### 5.3 City pages

**DESIGN RECOMMENDATION:** удалить city-specific `LocalBusiness`. На каждой city page
создавать page-specific `Service`, например `/lida#service`:

- `@type: Service`;
- canonical city-page `@id` и `url`;
- `name` / `serviceType`: установка заборов в соответствующем городе;
- `provider: { "@id": "https://www.masterzabor.by/#organization" }`;
- `areaServed: { "@type": "City", "name": "Лида" }`;
- при необходимости description, только из видимого содержания.

Не добавлять city address, `geo`, opening hours, taxID или новый business phone.
Schema.org поддерживает `Service.provider` и `Service.areaServed`; Google не обещает
для generic Service отдельный rich result или ranking benefit. Цель node — правдивая
семантика и связь страницы зоны обслуживания с реальным provider.

### 5.4 Product

**DESIGN RECOMMENDATION:** не менять Product/Offer в entity migration. Сохранить
service image, Offer URL, price/currency/availability и текущий Brand object. Product
brand — бренд услуги, а не доказательство отдельного офиса; принудительно превращать
его в Organization reference не требуется.

Отдельно решить Product semantics для `/tseny`, если владелец откроет такой stage.

### 5.5 Article

**DESIGN RECOMMENDATION:** `publisher` должен ссылаться на canonical
`/#organization`. `author` должен ссылаться на ту же entity только если владелец
подтверждает, что MasterZabor является редакционным автором и это отражено видимым
byline. Иначе нужен правдивый visible Person/Organization author; выдумывать его нельзя.

Сохранить работающие headline, description, dates, image и `mainEntityOfPage`.

### 5.6 Итоговый graph на representative routes

| Route family | Рекомендуемые nodes |
| --- | --- |
| `/` | canonical `Organization` (`#organization`) + `WebSite` + `FAQPage`. |
| `/kontakty` | те же global nodes + `BreadcrumbList`; factual address остаётся Gomel. |
| city | global business + `WebSite` + city `Service` + `BreadcrumbList`. |
| service | global business + `WebSite` + существующие `Product`, `FAQPage`, `BreadcrumbList`. |
| `/tseny` | global business + `WebSite` + `BreadcrumbList`; Product-list вопрос отдельно. |
| article | global business + `WebSite` + `Article` + `BreadcrumbList`. |

Root repetition можно оставить на первом migration step: это не обязательно по Google,
но даёт каждому page-specific node доступную в том же HTML canonical provider/publisher
entity и уменьшает implementation surface.

## 6. SearchAction decision

**DESIGN RECOMMENDATION:** удалить только `potentialAction` из WebSite JSON-LD.

Не реализовывать blog search ради schema: функция не входит в продуктовый scope, а
Google больше не показывает sitelinks search box. `WebSite` и его publisher сохранить.
Удаление не заявляется как ranking improvement; это correction недостоверного action.

## 7. Future implementation surface

Обязательный минимальный scope после отдельного approval:

| File / function | Будущее изменение |
| --- | --- |
| `lib/seo.ts` — `generateLocalBusinessJsonLd()` / `generateOrganizationJsonLd()` | Консолидировать в один canonical `Organization` generator с `@id /#organization`; убрать второй business identity, `LocalBusiness.geo` и неподтверждённые location hours. |
| `lib/seo.ts` — `generateWebsiteJsonLd()` | Сохранить WebSite/publisher, удалить SearchAction. |
| `lib/seo.ts` — новый shared city-service generator | Централизовать truthful `Service -> provider -> areaServed` model. |
| `app/layout.tsx` | Вставлять один business node и WebSite вместо двух business nodes + WebSite. |
| `components/templates/CityPage.tsx` — `generateCityLocalBusinessJsonLd()` | Удалить local generator и использовать shared city Service; Breadcrumb не менять. |

Условный scope, только после ответа владельца:

| File / function | Условие |
| --- | --- |
| `lib/seo.ts` — `generateArticleJsonLd()` | Связать publisher с `#organization`; author — только после решения о visible byline. |
| `app/blog/[slug]/page.tsx` | Добавить/передать правдивый author data и показать byline, если утверждено. |

Не требуется для минимальной migration:

- `components/templates/ServicePage.tsx`;
- `app/tseny/page.tsx`;
- `app/kontakty/page.tsx`;
- Product/Offer, FAQPage, BreadcrumbList generators;
- `content/cities.ts` и city coordinates;
- metadata и geo meta tags.

## 8. Migration plan

1. Зафиксировать before-snapshots rendered JSON-LD representative routes.
2. Консолидировать global `#localbusiness` + `#organization` в один
   `Organization #organization`: сохранить только подтверждённые organization facts,
   nationwide `areaServed` и при корректности factual address; не переносить
   неподтверждённые public-location geo/opening hours.
3. Удалить WebSite SearchAction, сохранить WebSite и publisher reference.
4. Заменить shared city `LocalBusiness` на shared city `Service` без
   address/geo/openingHours.
5. При подтверждённом author decision связать Article publisher/author; иначе не
   смешивать это с обязательным city fix.
6. Не менять Product/Offer, FAQ, Breadcrumb, metadata, geo meta tags или UI.
7. Preview QA -> owner approval -> отдельный merge/deploy -> Production schema smoke.

Удаление ложных city locations и переход на city `Service` не зависят от окончательного
решения о статусе Gomel office. Открытые вопросы о публичном посещении, location hours,
legal name, author и `sameAs` не должны блокировать эту correction.

## 9. QA plan для будущего implementation

### Automated rendered checks

- parse every `script[type="application/ld+json"]` on representative routes;
- assert один global `Organization` с `@id /#organization` и отсутствие
  `/#localbusiness`;
- assert city routes не содержат city-specific `LocalBusiness`, address или geo;
- assert city `Service.provider.@id = /#organization` и правильный `areaServed`;
- assert factual Gomel address сохраняется только в согласованной роли, global node не
  содержит неподтверждённые public-location geo/opening hours, а `areaServed` остаётся
  Беларусь;
- assert WebSite не содержит SearchAction;
- assert Product/Offer image, price, currency, availability и canonical URL не изменились;
- assert Article dates/image/mainEntityOfPage и Breadcrumb/FAQ counts не регрессировали.

Representative routes: `/`, `/kontakty`, `/lida`, `/grodno`, `/vitebsk`,
`/zabory-iz-profnastila`, `/tseny`, permission article. Для shared city template также
разумно проверить `/gomel`, чтобы реальная city page не создавала второй business node.

### Validators

- Google Rich Results Test: homepage/contact Organization, service Product,
  permission Article и Breadcrumb routes;
- Schema.org Validator: полный graph и generic city `Service`, поскольку Service не
  является самостоятельным Google rich-result promise;
- GSC Live Test после Production только для representative URLs;
- интерпретировать `/tseny` отдельно: отсутствие Product eligibility на multi-product
  page не равно syntax failure или ranking penalty.

### Acceptance

- zero fake city offices, addresses, coordinates или phone entities;
- одна стабильная business identity;
- provider/publisher references разрешаются в том же rendered HTML;
- Product/Article/Breadcrumb rich-result markup не потерян;
- canonical/domain/metadata/geo meta tags и visible UI не изменились;
- schema changes не объявляются ranking improvement без first-party evidence.

## 10. Open business questions

1. **OPEN QUESTION / BLOCKING ТОЛЬКО ДЛЯ БУДУЩЕГО `LocalBusiness`:** является ли
   реальный Гомельский адрес обычной публичной customer-facing точкой посещения
   клиентов? По текущим facts это прежде всего administrative/internal office, поэтому
   target остаётся `Organization` без location geo. Ответ не блокирует удаление fake
   city `LocalBusiness` nodes.
2. **OPEN QUESTION / BLOCKING ТОЛЬКО ДЛЯ LOCATION HOURS:** `Пн-Вс 10:00-19:00` —
   часы работы физической Gomel location или contact/service hours обработки звонков и
   выездной работы? До подтверждения не использовать их как location `openingHours`.
3. **OPEN QUESTION:** `МастерЗабор` — legal entity name или consumer brand? Если это
   бренд, какое подтверждённое legal name соответствует УНП `491386585`? Не добавлять
   `legalName` без ответа.
4. **OPEN QUESTION:** текущий телефон является устойчивым primary business phone
   MasterZabor? Этот вопрос не блокирует удаление fake city locations, но блокирует
   расширение Organization contact data.
5. **OPEN QUESTION:** кто является видимым и фактическим автором blog articles:
   MasterZabor как редакция, конкретный специалист или другое лицо? До решения не
   придумывать Person и не усиливать anonymous author markup.
6. **OPEN QUESTION / NON-BLOCKING:** есть ли подтверждённые official profile URLs для
   `sameAs`? Не создавать и не угадывать их в этом stage.

## 11. Два допустимых сценария

### A. Подтверждённая публичная Gomel location

Если будет подтверждено, что Gomel address — реальная публичная customer-facing
business location, допустим canonical `LocalBusiness #organization` с реальными
address, coordinates и часами работы именно этой location, а также nationwide
`areaServed`.

### B. Текущие facts: administrative/internal office

Пока обычное customer-facing посещение не подтверждено, preferred target — один
canonical `Organization #organization`. Реальный address можно сохранять как factual
organization/legal/postal address, но `LocalBusiness.geo` и location `openingHours`
не используются. География обслуживания описывается через truthful `areaServed`, а
city pages — через `Service.provider -> /#organization` и соответствующий City в
`Service.areaServed`, без city address, geo или openingHours.

Если позднее юридическая organization и подтверждённая customer-facing Gomel branch
окажутся разными сущностями, можно отдельно оценить `Organization #organization` плюс
`LocalBusiness #gomel-location` с явной связью. Сейчас такая сложность не подтверждена.

## 12. Финальный рекомендуемый target design

1. Один canonical `Organization` с `@id /#organization` как nationwide service-area
   business entity.
2. В нём только подтверждённые organization facts, factual Gomel address при
   корректном представлении и nationwide `areaServed: Беларусь`; без public-location
   geo/openingHours на текущих facts.
3. Отдельный `/#localbusiness` удалить; fake city business entities не создавать.
4. `WebSite.publisher` и page-level provider/publisher ссылаются на `/#organization`.
5. City pages описываются как `Service` с `provider` и city `areaServed`, без city
   address/geo/opening hours.
6. SearchAction удалить; реальный search ради markup не строить.
7. Product/Offer, FAQ и Breadcrumb оставить без redesign; `/tseny` Product eligibility
   рассматривать только отдельным stage.
8. Article publisher связать с canonical entity; author — только после truthful visible
   byline decision.
9. Root repetition на первом migration step оставить как harmless implementation
   trade-off, чтобы references разрешались в каждом rendered HTML.
10. Возможный будущий canonical `LocalBusiness` для Gomel допустим только после
    подтверждения реальной публичной customer-facing location и её реальных часов.
11. Никакого ranking promise для Google или Yandex: цель — точность, стабильная
    identity, правдивая service geography и отсутствие fake locations.
