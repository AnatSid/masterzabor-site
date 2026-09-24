# LOCAL-SEO-01C — shared CityPage / content-model refinement

Дата аудита: 2026-09-24

Статус: **DESIGN ONLY / APPLICATION NOT IMPLEMENTED**

Repository baseline: `27732f9343d41387b107cd53ebb1bc34ecfcff62`

Production: `https://www.masterzabor.by`

## 0. Scope и система доказательств

Цель этапа — выбрать одно минимальное улучшение общей `CityPage`, которое можно
подключить data-driven для пилотных существующих страниц Гродненской и Витебской
областей, не создавая отдельные templates и не переписывая сразу все 40 городов.

В этом этапе не меняются application code, routes, metadata, schema, sitemap или
Production. Документ опирается на фактический repository, roadmap, Local SEO master
plan, закрытый `LOCAL-SEO-01B` и официальные рекомендации поисковиков.

| Метка | Значение |
| --- | --- |
| **VERIFIED FACT** | Подтверждено фактическим repository или уже зафиксированным deterministic QA. |
| **USER/BUSINESS FACT** | Утверждено владельцем или уже используется как бизнес-условие; перед публикацией новых географических деталей требуется подтверждение владельца. |
| **SEARCH EVIDENCE** | First-party search data из project docs либо официальная документация Google/Яндекса. Это не ranking promise. |
| **DESIGN RECOMMENDATION** | Выбранное решение для будущего implementation после отдельного approval. |
| **OPEN QUESTION** | Для публикации или измерения не хватает подтверждённого business/search evidence. |

Проверенные implementation surfaces:

- `app/[city]/page.tsx`;
- `components/templates/CityPage.tsx`;
- `content/cities.ts`;
- `content/projects.ts`;
- `content/services.ts`;
- `lib/city-project-proof.ts`;
- `lib/city-groups.ts`;
- `components/cards/ProductCard.tsx`;
- `components/portfolio/ProjectCard.tsx`;
- `app/tseny/page.tsx`.

Официальные search boundaries:

- **SEARCH EVIDENCE:** Google рекомендует people-first content, first-hand evidence и
  прямо отрицает наличие предпочитаемого word count:
  [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- **SEARCH EVIDENCE:** Google относит к doorway abuse существенно похожие city/region
  pages, созданные как промежуточные страницы для похожих запросов:
  [Spam policies — doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse).
- **SEARCH EVIDENCE:** Яндекс пишет, что региональность — только один из факторов,
  проверяет соответствие региональных сведений содержимому сайта и рекомендует
  полезную именно для региона информацию, а не вымышленные представительства:
  [Региональность](https://yandex.ru/support/webmaster/ru/site-geography/site-region).
- **SEARCH EVIDENCE:** Яндекс описывает качество через вероятность решения задачи,
  полезность, оригинальность, релевантность и удобство потребления:
  [Как измеряется и улучшается качество Поиска](https://yandex.ru/support/webmaster/ru/search-quality).

Следствие для этого design: уникальность создаётся не объёмом текста и не повторением
названия города, а проверяемой географией обслуживания, реальными проектами и более
ясным путём пользователя к выбору услуги и расчёту.

## 1. Current-state audit

### 1.1 Architecture и порядок блоков

**VERIFIED FACT:** все 40 city routes используют один pipeline:
`app/[city]/page.tsx -> CityPage -> cities.ts`. Отдельных city templates нет.

Текущий порядок видимых блоков:

1. hero/H1, три commercial bullets, CTA расчёта и телефон;
2. общий `BenefitTrustSection`;
3. `Заборы в <городе>: расчёт, доставка и монтаж` + четыре абзаца
   `citySeoText()`;
4. три карточки `Типы заборов`;
5. три карточки `Ворота и калитки`;
6. условный блок `districts`;
7. три real-project cards по exact -> oblast -> nationwide fallback;
8. compact QuizForm;
9. `Другие города` того же normalized region.

### 1.2 Аудит обязательных элементов

| Элемент | Current-state evidence | Решение |
| --- | --- | --- |
| Hero/H1 | **VERIFIED FACT:** H1 естественно содержит город, hero даёт материал, минимальную цену, рассрочку, расчёт и звонок. Изображение общее и не притворяется конкретным городским объектом. | **ОСТАВИТЬ.** Немного уточнить price microcopy: это стартовый ориентир, а не отдельный городской прайс. Не делать city hero photos обязательными. |
| `Заборы в <городе>: расчёт, доставка и монтаж` | **VERIFIED FACT:** заголовок отвечает commercial intent, но под ним идёт длинный универсальный текст, который частично повторяет hero, service cards, gates и quiz. | **ПЕРЕРАБОТАТЬ** в компактный блок service area + порядок расчёта/выезда/доставки. |
| `citySeoText()` | **VERIFIED FACT:** четыре абзаца меняют в основном формы города/области. В них есть `за 5 минут`, утверждение о наиболее частом выборе материалов в области и `постоянных бригадах`; подтверждающие данные в city model отсутствуют. | **ЗАМЕНИТЬ**, не на другой SEO-текст, а на короткую shared commercial model. Неподтверждённые утверждения не переносить автоматически. |
| `Типы заборов` | **VERIFIED FACT:** три реальные service cards уже дают фото, описание, общие стартовые цены и ссылки на material pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Типы заборов в <городе>`. Карточки, цены и URL не дублировать и не делать city-specific. |
| `Ворота и калитки` | **VERIFIED FACT:** три service cards уже покрывают выбор въездной группы и ведут на service pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Ворота и калитки в <городе>`. Содержимое карточек не менять. |
| `districts` | **VERIFIED FACT:** поле заполнено только у Гомеля и Минска; в pilot routes отдельный блок не появляется. Та же информация у этих двух городов повторяется в `citySeoText()`. | **ПЕРЕРАБОТАТЬ:** заменить неоднозначное `districts` на структурированный `serviceArea`, а вывод объединить с основным local-commercial блоком. |
| Реальные проекты / fallback | **VERIFIED FACT:** выбираются только records с `id` prefix `real-`; порядок exact city -> same oblast -> nationwide, limit 3. City проекта всегда показан в карточке. | **СОХРАНИТЬ ЛОГИКУ И УСИЛИТЬ ПРЕДСТАВЛЕНИЕ:** явный proof status вместо семантики в ID, более прямые scope labels и exact project первым. Не превращать regional fallback в local claim. |
| Quiz/CTA | **VERIFIED FACT:** compact QuizForm получает `cityName` и уникальный `source=city-<slug>`; hero CTA ведёт к нему. | **НЕ ТРОГАТЬ** behavior, fields, analytics и validation. |
| `Другие города` | **VERIFIED FACT:** `getRelatedCities()` даёт deterministic same-region ring, без self/duplicates, максимум 8; старый array-order defect уже закрыт. | **НЕ ТРОГАТЬ** алгоритм. Не смешивать route links с nearby settlements без routes. |

## 2. Что уже достаточно хорошо

1. **VERIFIED FACT:** H1, hero CTA, телефон и quiz уже закрывают основной
   transactional путь: понять услугу -> запросить расчёт -> оставить параметры.
2. **VERIFIED FACT:** CityPage уже ссылается на все шесть service pages через карточки
   с реальными service images и shared price data. Отдельный новый material link block
   не нужен.
3. **VERIFIED FACT:** общий trust block уже присутствует. Повторять гарантию,
   рассрочку и общие преимущества в новом local text не нужно.
4. **VERIFIED FACT:** project fallback честно сохраняет фактический город каждой
   карточки и не использует starter/demo records как local proof.
5. **VERIFIED FACT:** related-city architecture уже balanced и регионально
   ограничена. Она решает navigation/discovery задачу и не должна одновременно
   изображать фактическую зону выезда.
6. **VERIFIED FACT:** `Service -> provider + areaServed` schema уже внедрена и
   Production verified. Visible content refinement не требует нового entity design.
7. **SEARCH EVIDENCE:** доступный GSC baseline подтверждает, что Google знает
   `/grodno`, `/lida` и `/glubokoe`; проблема не сводится к отсутствию URL discovery.

## 3. Реальные gaps

### Gap 1 — local-commercial информация спрятана в generic prose

**VERIFIED FACT:** `citySeoText()` занимает четыре абзаца, но не отвечает ясно и
быстро на практические вопросы: куда именно возможен выезд рядом с городом, какие
данные нужны до выезда, на каком этапе уточняются доставка и итоговая цена.

**DESIGN RECOMMENDATION:** заменить его компактной секцией, которую можно просмотреть
по подзаголовкам/строкам, а не добавлять ещё текст.

### Gap 2 — service area не имеет правдивой pilot data model

**VERIFIED FACT:** для Лиды, Гродно, Слонима, Новогрудка, Сморгони, Глубокого и Лепеля
нет `districts`; пользователь видит только общую фразу `и рядом с городом`.

**OPEN QUESTION:** какие конкретные nearby settlements действительно обслуживаются
из каждого pilot hub и есть ли различия в условиях выезда/доставки между областями.

**DESIGN RECOMMENDATION:** публиковать только короткий owner-confirmed список, без
улиц, без fake addresses и без автоматического создания routes.

### Gap 3 — proof достоверный, но provenance encoded в строке ID

**VERIFIED FACT:** `getCityProjectProof()` считает проект подтверждённым по
`project.id.startsWith("real-")`. Это работает, но важный truth status не выражен
явным полем данных.

**DESIGN RECOMMENDATION:** добавить `proofStatus: "confirmed" | "starter"` в
`Project`; selection должен опираться на него. City-specific project lists в
`cities.ts` не создавать.

### Gap 4 — exact и supporting proof визуально недостаточно разделены

**VERIFIED FACT:** если найден один exact project, heading становится exact-city, а
ещё две карточки могут быть областными или nationwide. Текст объясняет fallback, но
все карточки выглядят равноправно.

**DESIGN RECOMMENDATION:** exact card всегда первая и получает scope label
`Объект в <городе>`; остальные — `Ещё работы в <области>` или `Другой регион` по
фактическим данным. Не добавлять fake reviews и не переименовывать regional project в
local project.

### Gap 5 — стартовая цена выглядит локальной, хотя данные общие

**VERIFIED FACT:** hero говорит `Цены от 30 BYN/м.п.`, а service cards берут общие
`services.priceFrom`; отдельного city pricing source нет. `/tseny` уже объясняет, что
это ориентиры и что итог зависит от объекта.

**DESIGN RECOMMENDATION:** не добавлять новый standalone price block. Существующие
hero и service cards должны продолжать брать значения из одного shared source, но
hero value следует назвать `Стартовый ориентир` и рядом дать ссылку на `/tseny`. В
local-commercial секции одним предложением сообщить, что точная стоимость и условия
доставки определяются после параметров объекта. Не создавать `cityPrice`.

## 4. Proposed CityPage v2 — один рекомендуемый design

Это не новый длинный landing. Это тот же shared component с одним компактным local
layer и более ясной proof hierarchy.

### Рекомендуемый порядок

1. **Hero/H1 — сохранить.** Одна microcopy correction:
   `Стартовый ориентир от 30 BYN/м.п.` + ссылка `Все цены и факторы` на `/tseny`.
2. **BenefitTrustSection — сохранить без изменений.**
3. **Новый компактный H2:**
   `Работаем в <городе> и рядом: расчёт, доставка и монтаж`.
   Внутри не более четырёх коротких смысловых строк:
   - `Зона выезда` — город, city districts при наличии и owner-confirmed nearby
     settlements;
   - `До выезда` — примерная длина, высота, материал, ворота/калитка и особенности
     подъезда/участка;
   - `Выезд и доставка` — только подтверждённая shared business wording: детали и
     условия фиксируются после предварительного расчёта и согласования;
   - `Цена` — стартовые ориентиры общие, точный расчёт относится к объекту, ссылка
     на `/tseny`.
4. **Project proof поднять сразу после local-commercial блока.** Это первый
   differentiating evidence, а не ещё один marketing paragraph. Exact project —
   первым; supporting scope виден на каждой карточке/подгруппе.
5. **`Типы заборов в <городе>`** — существующие три cards без изменения data.
6. **`Ворота и калитки в <городе>`** — существующие три cards без изменения data.
7. **Quiz/CTA — сохранить без изменений.**
8. **`Другие города` — сохранить без изменения алгоритма.** Nearby settlements без
   route не становятся ссылками; related cities остаются только canonical routes.

Отдельный `districts` section и четыре абзаца `citySeoText()` в v2 больше не нужны:
их полезная функция переезжает в один service-area/commercial block.

### Почему это минимально

- один template и один порядок блоков;
- один новый компактный section вместо существующего long-text section и отдельного
  `districts` section;
- существующие service cards, price source, quiz, trust, related-city algorithm,
  project assets и schema переиспользуются;
- локализация появляется только там, где есть факт: service area и project city;
- pilot подключается через data, без `if (slug === ...)` и без fork templates.

## 5. Exact shared fields / data model

### 5.1 Durable city model

```ts
type CityServiceArea = {
  cityDistricts?: string[];
  nearbySettlements: string[];
};

type CityLocalContentV2 = {
  version: 2;
  serviceArea: CityServiceArea;
};

type City = {
  // Existing identity/grammar/metadata fields stay unchanged.
  slug: string;
  name: string;
  namePrepositional: string;
  nameGenitive: string;
  oblast: string;
  oblastGenitive: string;
  coords: { lat: number; lng: number };
  population?: number;
  updatedAt?: IsoDate;

  // New data-driven pilot opt-in.
  localContent?: CityLocalContentV2;
};
```

**DESIGN RECOMMENDATION:** наличие `localContent.version = 2` — временно управляемый
pilot opt-in внутри одного template. Оно позволяет не менять visible content остальных
городов до approval. После успешного rollout version field можно удалить отдельным
cleanup, когда все поддерживаемые city records будут на одной модели.

**DESIGN RECOMMENDATION:** существующее `districts` механически мигрирует в
`serviceArea.cityDistricts`; одно и то же значение больше не выводится дважды.

**USER/BUSINESS FACT:** `nearbySettlements` заполняется только после подтверждения
владельца, что выезд туда фактически выполняется. Это labels, не links и не обещание
фиксированной цены/срока.

### 5.2 Explicit project proof status

```ts
type Project = {
  // Existing fields stay unchanged.
  id: string;
  city: ProjectCity;
  serviceSlug?: ProjectServiceSlug;
  // ...photos, material, description, optional facts

  proofStatus: "confirmed" | "starter";
};
```

`getCityProjectProof()` сохраняет exact -> oblast -> nationwide и limit 3, но фильтрует
`proofStatus === "confirmed"`. Project city/material/photo/description остаются в
`content/projects.ts`; в `cities.ts` не добавляются duplicate project IDs или тексты.

### 5.3 Shared, а не city-specific

Следующие значения остаются shared component/config copy и не размножаются в 40
records:

- required inputs for preliminary estimate;
- default sequence `предварительный расчёт -> согласование -> выезд/доставка/монтаж`;
- pricing disclaimer и link на `/tseny`;
- services, images, `priceFrom`, service URLs;
- trust benefits, installment copy и CTA behavior;
- proof heading/labels, вычисляемые из selection mode;
- related-city selection.

Если реальные visit/delivery rules отличаются по региону, следующий data change должен
быть отдельным shared operational profile referenced by ID, а не свободным абзацем на
каждом городе. Сейчас такого подтверждённого различия нет.

## 6. Что действительно должно быть city-specific

1. **VERIFIED FACT / existing:** slug, формы названия, область, coordinates и
   semantic `updatedAt`.
2. **USER/BUSINESS FACT / new:** подтверждённые `nearbySettlements` и, где применимо,
   реальные `cityDistricts`.
3. **VERIFIED FACT / derived:** exact/regional/nationwide project proof из
   `content/projects.ts`; не отдельный city copy field.
4. **USER/BUSINESS FACT / conditional:** только реальное исключение в логистике.
   До появления таких отличий оно не становится полем City.

Не нужны `cityIntro`, `citySeoText`, `cityPrice`, `cityFaq`, `cityReview`,
`recommendedMaterialsForCity` или свободный `localFacts`. Они быстро превратятся в
непроверяемые вариации одного текста.

`population` не следует выводить как local fact: оно не помогает выбрать забор или
организовать заказ и потребует отдельного источника/актуализации.

## 7. Что намеренно не нужно менять

- routes, slug policy, canonical, metadata, geo meta и sitemap membership;
- внедрённый `Service -> provider + areaServed` JSON-LD;
- общий hero photo и обязательность city-specific hero images;
- six service records, service prices и service pages;
- отдельный `/tseny` как единственный подробный pricing landing;
- `BenefitTrustSection`;
- QuizForm fields, validation, source, analytics и submission behavior;
- balanced related-city ring;
- project images/descriptions и exact -> oblast -> nationwide fallback principle;
- Product/Offer, FAQ, reviews, contacts, domain architecture и Telegram;
- общий page word count как acceptance criterion.

Также намеренно не предлагаются generic FAQ, второй price block, fake local reviews,
offices/addresses, случайные streets, city × material routes, project claims без
provenance или отдельные templates.

## 8. Пример структуры для `/lida`

### Data state

- **VERIFIED FACT:** `/lida` — existing route, Гродненская область.
- **VERIFIED FACT:** среди девяти текущих `real-` records нет exact-city Lida project;
  старый starter record с `city.slug = lida` правильно исключён из local proof.
- **VERIFIED FACT:** текущий mode — `oblast`; первые supporting records приходят из
  подтверждённых проектов Гродненской области.
- **OPEN QUESTION:** финальный owner-confirmed список nearby settlements для Лидского
  hub. Названия не следует угадывать в design doc или генерировать по карте.

### Visible v2 structure

1. Hero: `Установка заборов в Лиде под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Работаем в Лиде и рядом: расчёт, доставка и монтаж`:
   - Лида;
   - подтверждённые nearby settlements после business approval;
   - shared estimate/visit/delivery/pricing facts.
4. `Наши работы в Гродненской области`:
   - каждая card показывает фактический город;
   - scope не называется `работами в Лиде`;
   - link ведёт к релевантной service page, как сейчас.
5. `Типы заборов в Лиде` — существующие три cards.
6. `Ворота и калитки в Лиде` — существующие три cards.
7. `Рассчитайте стоимость забора в Лиде` — текущий QuizForm без изменений.
8. `Другие города` — current same-region links без nearby non-route settlements.

Лида проверяет главный fallback scenario: может ли page быть полезной и локально
честной без exact project и без выдуманного уникального текста.

## 9. Пример структуры для `/glubokoe`

### Data state

- **VERIFIED FACT:** `/glubokoe` — existing route, Витебская область.
- **VERIFIED FACT:** есть confirmed exact project
  `real-green-profnastil-glubokoe`; current mode — `exact`.
- **VERIFIED FACT:** после exact project current selection может дополняться
  confirmed records из Постав и Лепеля в рамках limit 3.
- **OPEN QUESTION:** финальный owner-confirmed список nearby settlements для
  Глубокского hub.

### Visible v2 structure

1. Hero: `Установка заборов в Глубоком под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Работаем в Глубоком и рядом: расчёт, доставка и монтаж`:
   - Глубокое;
   - подтверждённые nearby settlements после business approval;
   - те же shared estimate/visit/delivery/pricing facts, без искусственной rewrite.
4. `Наши работы в Глубоком`:
   - first card: exact confirmed project, label `Объект в Глубоком`;
   - supporting cards: отдельный regional scope, без выдачи их за Глубокое.
5. `Типы заборов в Глубоком` — существующие три cards.
6. `Ворота и калитки в Глубоком` — существующие три cards.
7. `Рассчитайте стоимость забора в Глубоком` — текущий QuizForm.
8. `Другие города` — current same-region links.

Глубокое проверяет exact-proof scenario и позволяет сравнить его с Лидой без создания
двух templates или разного объёма SEO-текста.

## 10. Pilot implementation scope после отдельного approval

Первая implementation итерация должна затронуть только один shared template и данные
пяти existing routes:

| Route | Зачем в pilot |
| --- | --- |
| `/lida` | Priority route, Гродненская область, oblast fallback. |
| `/grodno` | Крупный областной центр, oblast fallback среди current confirmed records. |
| `/slonim` | Exact confirmed proof в Гродненской области. |
| `/glubokoe` | Priority route, exact confirmed proof и имеющийся GSC baseline. |
| `/lepel` | Второй exact confirmed scenario в Витебской области. |

Implementation boundaries:

1. добавить `localContent` только этим records после owner confirmation service areas;
2. добавить explicit `proofStatus` всем существующим project records без изменения
   их текста/assets;
3. в одном `CityPage` render v2 по `localContent.version`, без slug conditions;
4. сохранить legacy output для остальных 35 routes на время pilot;
5. не создавать Поставы, Щучин, Островец, Ошмяны или другие routes;
6. не менять metadata/schema/prices/QuizForm/related-city algorithm;
7. semantic `updatedAt` менять только у реально изменённых pilot routes и только в
   implementation stage.

**OPEN QUESTION / BLOCKING FOR IMPLEMENTATION:** owner-confirmed nearby settlements и
точная shared wording условий выезда/доставки. Без них можно реализовать proof status,
но нельзя честно заявить, что service-area gap закрыт.

## 11. QA и measurement plan

### 11.1 Pre-implementation baseline

- сохранить rendered text/order/screenshots pilot routes desktop + mobile;
- зафиксировать proof mode и выбранные project IDs для всех pilot routes;
- выгрузить GSC и Yandex Webmaster page/query data для одинаковых доступных периодов;
- отдельно отметить низкую выборку `/lida`, чтобы один impression или одна позиция не
  интерпретировались как эффект;
- сохранить current quiz/contact/lead baseline по city source, если данных достаточно.

### 11.2 Technical/content QA

- все 40 city routes остаются `200`; pilot uses v2, остальные legacy shared output;
- один H1; логичная H2 hierarchy; city grammar проверена вручную;
- zero fake office/address/review/project/street claims;
- every nearby settlement совпадает с owner-approved source list;
- exact/regional/nationwide labels совпадают с фактическим `project.city`;
- starter projects ни при каких IDs не попадают в proof;
- service cards сохраняют shared price/link/image data;
- нет нового standalone price block; hero/cards используют один shared price source,
  `/tseny` link работает, ложного city price нет;
- QuizForm city/source/submission behavior и analytics не изменены;
- related-city graph не изменён; nearby settlements без routes не становятся links;
- JSON-LD/canonical/metadata snapshots не изменены;
- desktop и mobile visual QA: section order, wrapping service-area chips, project scope
  labels, CTA reachability и отсутствие horizontal overflow.

Docs-only design не требует `npm run lint` или build. Будущий TypeScript/UI stage
требует lint, relevant runtime checks, browser desktop/mobile checks и build, если
изменится routing/framework behavior.

### 11.3 Search и business measurement после recrawl

Google и Яндекс измеряются параллельно, но раздельно:

- Google: GSC impressions, clicks, CTR, average position по pilot page/query;
- Yandex: Webmaster query/page impressions/clicks/positions;
- documented SERP snapshots: дата, поисковик, устройство, регион, персонализация;
- business: contact clicks, quiz starts/contact-step/lead submissions по city source,
  только при достаточном объёме.

Сравнение:

- до/после только после подтверждённого recrawl и на одинаковых периодах;
- exact-proof routes (`/slonim`, `/glubokoe`, `/lepel`) отдельно от fallback routes
  (`/lida`, `/grodno`);
- непилотные routes тех же областей используются как directional control, но не как
  строгий experiment из-за различий спроса и конкуренции;
- оценивать не один rank snapshot, а совокупность visibility, query relevance и
  useful actions;
- отсутствие роста не компенсировать добавлением word count, FAQ или новых routes без
  нового evidence.

Ни Google-specific feature, ни Yandex regionality setting не объявляются универсальным
ranking factor. Решение о rollout принимается только после сопоставления обоих search
contours и business usefulness.

## 12. Финальный рекомендуемый design

1. Сохранить один data-driven `CityPage`.
2. Для pilot подключать v2 через `city.localContent`, не через hardcoded slugs.
3. Заменить generic `citySeoText()` и отдельный `districts` block одним компактным
   service-area/commercial section.
4. Добавить только owner-confirmed nearby settlements; не добавлять улицы, адреса или
   автоматические routes.
5. Сохранить shared services/prices и лишь уточнить, что цена — стартовый ориентир,
   а не city tariff.
6. Локализовать только H2 `Типы заборов` и `Ворота и калитки`; cards не дублировать.
7. Поднять real-project proof выше, явно разделить exact и supporting geography и
   заменить `real-` ID convention на `proofStatus`.
8. Не менять QuizForm, trust, related-city graph, schema, metadata, canonical или
   service pages.
9. Проверить два обязательных proof scenarios: `/lida` как honest regional fallback и
   `/glubokoe` как exact-city proof.
10. Не расширять rollout и не создавать новые routes до owner approval, recrawl и
    Google + Yandex measurement.
