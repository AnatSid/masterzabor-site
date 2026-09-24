# LOCAL-SEO-01C — shared CityPage / content-model refinement

Дата аудита: 2026-09-24

Статус: **DESIGN ONLY / APPLICATION NOT IMPLEMENTED**

Original audit baseline: `27732f9343d41387b107cd53ebb1bc34ecfcff62`

Refinement baseline: `7df715cbb5a1544ba2910d8f1bc0108a6c084dd0` (approved design in `main`).

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

**SEARCH EVIDENCE:** зафиксированные в project docs запросы вроде `заборы гродно`,
`забор под ключ гродно` и `забор цена в гродно` указывают на выбор конструкции,
комплектации и бюджета. Это сигнал о намерении, а не список фраз для повторения в
тексте. Для refinement использованы существующие project docs и редакционный стандарт
`docs/EDITORIAL-WRITING-GUIDE.md`; нового search research нет.

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
| `Заборы в <городе>: расчёт, доставка и монтаж` | **VERIFIED FACT:** заголовок отвечает commercial intent, но под ним идёт длинный универсальный текст, который частично повторяет hero, service cards, gates и quiz. | **ПЕРЕРАБОТАТЬ** в компактный верхний блок service area + порядок расчёта/выезда/доставки. Содержательную часть о выборе не удалять, а вынести ниже visual/commercial блоков. |
| `citySeoText()` | **VERIFIED FACT:** четыре абзаца меняют в основном формы города/области. При этом они уже содержат полезные темы: материалы, комплектация и факторы расчёта. Есть также `за 5 минут`, утверждение о наиболее частом выборе материалов в области и `постоянных бригадах`; подтверждающих данных в city model нет. | **РАЗДЕЛИТЬ И ПЕРЕПИСАТЬ:** практические факты наверх, 2–4 содержательных абзаца о выборе ниже карточек. Не удалять полезный commercial слой и не переносить неподтверждённые claims. |
| `Типы заборов` | **VERIFIED FACT:** три реальные service cards уже дают фото, описание, общие стартовые цены и ссылки на material pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Типы заборов в <городе>`. Карточки, цены и URL не дублировать и не делать city-specific. |
| `Ворота и калитки` | **VERIFIED FACT:** три service cards уже покрывают выбор въездной группы и ведут на service pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Ворота и калитки в <городе>`. Содержимое карточек не менять. |
| `districts` | **VERIFIED FACT:** поле заполнено только у Гомеля и Минска; в pilot routes отдельный блок не появляется. Та же информация у этих двух городов повторяется в `citySeoText()`. | **ПЕРЕРАБОТАТЬ:** заменить неоднозначное `districts` на структурированный `serviceArea`, а вывод объединить с основным local-commercial блоком. |
| Реальные проекты / fallback | **VERIFIED FACT:** выбираются только records с `id` prefix `real-`; порядок exact city -> same oblast -> nationwide, limit 3. City проекта уже показан в карточке. | **УСИЛИТЬ:** явный `proofStatus`, curated regional proof pool примерно из 3–6 confirmed работ на область, deterministic выбор около трёх карточек, exact project первым, компактная метка `Объект: <фактический город>`. Не требовать 2–3 exact работ на route. |
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

**DESIGN RECOMMENDATION:** разделить содержимое: быстро сканируемая compact секция
выше proof/cards отвечает на вопросы обслуживания и расчёта, а отдельные 2–4
редакторских абзаца после визуального выбора помогают сравнить конструкцию,
комплектацию и бюджет. Объём не является KPI; оба слоя должны выполнять разные задачи.

### Gap 2 — service area не имеет явной fallback-модели

**VERIFIED FACT:** для Лиды, Гродно, Слонима, Новогрудка, Сморгони, Глубокого и Лепеля
нет `districts`; пользователь видит только общую фразу `и рядом с городом`.

**USER/BUSINESS FACT:** MasterZabor работает по Беларуси. Поэтому правдивая базовая
география для CityPage — целевой город и его область; отдельный список соседних
населённых пунктов не нужен для подтверждения этой зоны обслуживания.

**DESIGN RECOMMENDATION:** по умолчанию выводить `город + область`. Если позднее есть
короткий owner-confirmed список meaningful nearby settlements, его можно показать как
enhancement. Не генерировать settlements автоматически, не брать случайные названия с
карты, не добавлять улицы/fake addresses и не создавать для settlements routes.

### Gap 3 — proof достоверный, но provenance encoded в строке ID

**VERIFIED FACT:** `getCityProjectProof()` считает проект подтверждённым по
`project.id.startsWith("real-")`. Это работает, но важный truth status не выражен
явным полем данных.

**DESIGN RECOMMENDATION:** добавить `proofStatus: "confirmed" | "starter"` в
`Project`; selection должен опираться на него. City-specific project lists в
`cities.ts` не создавать.

### Gap 4 — regional proof недостаточно масштабируем и ясно представлен

**VERIFIED FACT:** если найден один exact project, heading становится exact-city, а
ещё две карточки могут быть областными или nationwide. Текст объясняет fallback, но
все карточки выглядят равноправно.

**USER/BUSINESS FACT:** на каждый city route не нужны 2–3 exact-city проекта.
Достаточен curated pool примерно из 3–6 сильных подтверждённых проектов области;
один проект может подтверждать опыт на нескольких страницах этой области. Для
Grodno/Vitebsk pilot имеющийся confirmed pool достаточен, новые фотографии не blocker.

**DESIGN RECOMMENDATION:** отбирать около трёх работ стабильно: confirmed exact-city
первым, затем по возможности разнообразие материалов/услуг и качество фото из
regional pool. Если нужного типа нет, не создавать фиктивную карточку. Заголовок
может говорить об услуге в городе, а подпись прямо называет географию примеров.
Каждая карточка показывает `Объект: <фактический город>`. Не переименовывать проект
из Слонима или Новогрудка в «объект в Лиде».

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

Это не новый длинный landing. Это тот же shared component с двумя разными по задаче
content layers: compact service/estimate answer выше и редакционное объяснение выбора
ниже; между ними реальные проекты и существующие карточки услуг.

### Рекомендуемый порядок

1. **Hero/H1 — сохранить.** Одна microcopy correction:
   `Стартовый ориентир от 30 BYN/м.п.` + ссылка `Все цены и факторы` на `/tseny`.
2. **BenefitTrustSection — сохранить без изменений.**
3. **Компактный H2:**
   `Заборы в <городе>: расчёт, доставка и монтаж`.
   Внутри не более четырёх коротких смысловых строк:
   - `Зона выезда` — по умолчанию город + область; при наличии можно дополнить
     реальными city districts и owner-confirmed nearby settlements;
   - `До выезда` — примерная длина, высота, материал, ворота/калитка и особенности
     подъезда/участка;
   - `Выезд и доставка` — только подтверждённая shared business wording: детали и
     условия фиксируются после предварительного расчёта и согласования;
   - `Цена` — стартовые ориентиры общие, точный расчёт относится к объекту;
     `/tseny` доступна из hero и контекстно из нижнего текста, поэтому здесь не
     нужна третья одинаковая ссылка.
4. **Project proof поднять сразу после compact блока.** Heading относится к услуге,
   например `Заборы, которые устанавливаем в Лиде`; подпись говорит, что это
   выполненные работы в Гродненской области. Примерно три confirmed карточки из
   curated regional pool: exact-city первым, когда он есть; фактический город на
   каждой карточке. Selection deterministic, разнообразие желательно, но не ценой
   неподтверждённых проектов или слабых изображений.
5. **`Типы заборов в <городе>`** — существующие три cards без изменения data.
6. **`Ворота и калитки в <городе>`** — существующие три cards без изменения data.
7. **Поясняющий commercial текст** после visual/service выбора и перед QuizForm:
   2–4 естественных абзаца о выборе материала, комплектации и чтении стартовых цен.
   Текст должен давать ответ, которого нет на карточке: когда сравнивать варианты,
   какие параметры влияют на смету и куда перейти за деталями. Не пересказывать hero,
   trust, карточки или инструкцию QuizForm. Обычно 2–4 естественные contextual links
   к material/service pages и `/tseny` на весь нижний блок, только в полезном месте;
   не обязательный quota и не отдельный link list.
8. **Quiz/CTA — сохранить без изменений.** Текст стоит до формы, чтобы читатель мог
   выбрать направление расчёта; CTA остаётся доступным из hero и у формы.
9. **`Другие города` — сохранить без изменения алгоритма.** Nearby settlements без
   route не становятся ссылками; related cities остаются только canonical routes.

Отдельный `districts` section и исходная монолитная функция `citySeoText()` в v2
не нужны. Но её полезные темы сохраняются в двух разделённых по роли слоях.

### Почему это минимально

- один template и один порядок блоков;
- compact section заменяет верхний long-text/districts вывод; нижний редакционный
  блок использует только темы, которые помогают принять решение;
- существующие service cards, price source, quiz, trust, related-city algorithm,
  project assets и schema переиспользуются;
- локализация опирается на проверяемые city/oblast и project facts, а не на
  неподтверждённую «популярность» материалов;
- pilot подключается через data, без `if (slug === ...)` и без fork templates.

## 5. Exact shared fields / data model

### 5.1 Durable city model

```ts
type CityServiceArea = {
  cityDistricts?: string[];
  nearbySettlements?: string[];
};

type CityCommercialLinkTarget =
  | "/zabory-iz-profnastila"
  | "/zabory-iz-evroshtaketnika"
  | "/zabory-iz-setki-rabitsy"
  | "/tseny"
  | "/nashi-raboty";

type CityCommercialPart = {
  text: string;
  href?: CityCommercialLinkTarget;
};

type CityLocalContentV2 = {
  version: 2;
  serviceArea: CityServiceArea;
  commercialParagraphs: CityCommercialPart[][];
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

**DESIGN RECOMMENDATION:** `commercialParagraphs` — два–четыре коротких
редакторских абзаца для v2 pilot records, а не обязательный «уникальный SEO-текст»
для всех 40 routes. Массив `CityCommercialPart` разрешает обычный текст и точечные
внутренние ссылки без HTML и отдельного template. Copy может разделять общие
проверенные объяснения, но местный пример допустим только при наличии confirmed
project. Текст не должен включать неподтверждённые региональные предпочтения,
сроки, офисы или цены. По умолчанию достаточно 2–4 contextual links на весь блок,
если они помогают сравнить варианты; повтор service-card links сам по себе не цель.

**DESIGN RECOMMENDATION:** существующее `districts` механически мигрирует в
`serviceArea.cityDistricts`; одно и то же значение больше не выводится дважды.

**DESIGN RECOMMENDATION:** rendering rule для `serviceArea`:

- если есть подтверждённые meaningful `nearbySettlements`, вывести их после базовой
  географии;
- если списка нет, использовать честную shared формулировку `город + область`;
- не генерировать settlements автоматически и не брать случайные названия с карты;
- не создавать для settlements routes автоматически.

**USER/BUSINESS FACT:** `nearbySettlements` — optional enhancement. Если поле
заполняется, владелец подтверждает фактический выезд в перечисленные населённые пункты.
Значения остаются labels, а не links или обещанием фиксированной цены/срока.

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

**USER/BUSINESS FACT:** целевая единица для масштабирования — не набор exact-city
фотографий каждого route, а 3–6 сильных confirmed projects на область. Один project
может использоваться на нескольких city pages своей области. Наличие exact-city
работы — приоритет, не prerequisite. В перспективе около шести качественных
confirmed records на область достаточно как рабочий ориентир, не жёсткая квота.

**DESIGN RECOMMENDATION:** поддерживать один curated `regionalProofPool` по области
как упорядоченный список existing project IDs. Порядок в pool фиксируется
редактором по качеству фактического фото и пригодности карточки. Для pilot уже есть
шесть confirmed records Гродненской области (Слоним, Новогрудок, Щучин,
Островец, Ошмяны, Сморгонь) и три Витебской (Глубокое, Лепель, Поставы).
Новых assets или fake records не требуется. Это shared regional configuration,
не список IDs в каждой city record.

```ts
// Shared config, not a field on City; IDs must resolve to confirmed Project records.
type RegionalProofPool = Readonly<Record<string, readonly Project["id"][]>>;
```

Selection на каждом render детерминированный:

1. брать только `proofStatus === "confirmed"` и фактически подходящую область;
2. confirmed exact-city work ставить первой, когда есть;
3. добирать до примерно трёх карточек из curated regional pool, по возможности
   выбирая иной material/service; среди равных кандидатов следовать порядку pool
   (редакторская оценка качества фото), затем стабильному `project.id`;
4. если в области подтверждённых работ меньше трёх, только тогда использовать
   nationwide confirmed fallback с честной географической подписью, не называя
   весь набор «работами в области».

Никакого `random()`, непредсказуемой сортировки или смены набора при каждом render.
Разнообразие не является жёстким требованием: нельзя подменять отсутствующий тип
неподтверждённой работой. Для карточки любого scope метка имеет единый компактный
вид `Объект: <фактический город>`. Heading (`Заборы, которые устанавливаем в
<городе>`) описывает услугу, не выдаёт каждую фотографию за городской объект;
subtitle явно называет область фактических примеров.

### 5.3 Shared, а не city-specific

Следующие значения остаются shared component/config copy и не размножаются в 40
records:

- required inputs for preliminary estimate;
- default sequence `предварительный расчёт -> согласование -> выезд/доставка/монтаж`;
- pricing disclaimer и link на `/tseny`;
- services, images, `priceFrom`, service URLs;
- trust benefits, installment copy и CTA behavior;
- proof heading/labels, вычисляемые из selection mode;
- curated regional proof pool, его порядок и deterministic selection;
- related-city selection.

Если реальные visit/delivery rules отличаются по региону, следующий data change должен
быть отдельным shared operational profile referenced by ID, а не свободным абзацем на
каждом городе. Сейчас такого подтверждённого различия нет.

## 6. Что действительно должно быть city-specific

1. **VERIFIED FACT / existing:** slug, формы названия, область, coordinates и
   semantic `updatedAt`.
2. **USER/BUSINESS FACT / new:** где применимо, реальные `cityDistricts`; optional
   `nearbySettlements` добавляются только как подтверждённое enhancement. Без этого
   списка CityPage использует город + область.
3. **VERIFIED FACT / derived:** exact/regional/nationwide project proof из
   `content/projects.ts`; не отдельный city copy field.
4. **DESIGN RECOMMENDATION / pilot:** `commercialParagraphs` с полезным сравнением,
   city/oblast и только проверенным local project fact, если он есть. Это небольшой
   редакционный слой, а не требование уникального объёма для всех routes.
5. **USER/BUSINESS FACT / conditional:** только реальное исключение в логистике.
   До появления таких отличий оно не становится полем City.

Не нужны свободные `cityIntro`/`citySeoText` без роли и источника,
`cityPrice`, `cityFaq`, `cityReview`, `recommendedMaterialsForCity` или свободный
`localFacts`. Они быстро превратятся в непроверяемые вариации одного текста.
`commercialParagraphs` отличается ограниченной задачей, ссылочными targets и
редакторской проверкой фактов на пяти pilot routes.

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
- **VERIFIED FACT:** текущий mode — `oblast`; подтверждённые работы Гродненской
  области есть в Слониме, Новогрудке, Щучине, Островце, Ошмянах и Сморгони.
- **DESIGN RECOMMENDATION:** будущий curated selection берёт около трёх карточек из
  этого pool. Например, Новогрудок (евроштакетник), Щучин (3D) и Слоним
  (евроштакетник), если эти фото первыми в редакторском порядке. Это illustrative
  deterministic set, не требование именно этих IDs; профнастила в подтверждённом
  Grodno pool сейчас нет, поэтому ради diversity его не выдумывать.
- **DESIGN RECOMMENDATION:** nearby settlements для первой v2 не обязательны. Если
  позднее появится короткий owner-confirmed список, его можно добавить без изменения
  template; названия нельзя угадывать или генерировать по карте.

### Visible v2 structure

1. Hero: `Установка заборов в Лиде под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Заборы в Лиде: расчёт, доставка и монтаж` — точный compact copy ниже.
4. `Заборы, которые устанавливаем в Лиде` — заголовок услуги, не утверждение о
   географии фотографий. Subtitle: `Примеры наших выполненных работ в Гродненской
   области`. Около трёх confirmed карточек из regional pool; на каждой виден
   фактический город, например `Объект: Новогрудок`, `Объект: Щучин`,
   `Объект: Слоним`. Link карточки ведёт к соответствующей service page, как сейчас.
5. `Типы заборов в Лиде` — существующие три cards.
6. `Ворота и калитки в Лиде` — существующие три cards.
7. `Как выбрать забор и комплектацию` — точный explanatory copy ниже.
8. `Рассчитайте стоимость забора в Лиде` — текущий QuizForm без изменений.
9. `Другие города` — current same-region links без nearby non-route settlements.

### `/lida`: proposed compact copy

> **Заборы в Лиде: расчёт, доставка и монтаж**
>
> Зона работ: Лида и Гродненская область.
>
> Для предварительного расчёта сообщите примерную длину и высоту забора, желаемый
> материал и нужны ли ворота или калитка.
>
> После предварительного расчёта уточним особенности участка и согласуем условия
> выезда, доставки и монтажа.
>
> Цены на странице служат стартовым ориентиром. Итоговую стоимость рассчитываем
> под объект.

Optional короткий подтверждённый список nearby settlements можно добавить после
базовой географии позднее. Его отсутствие не меняет этот fallback.

### `/lida`: proposed lower explanatory copy

> **Как выбрать забор и комплектацию**
>
> Выбор забора для участка в Лиде начинается с того, нужно ли закрыть его от
> обзора. [Профнастил](/zabory-iz-profnastila) даёт сплошное заполнение.
> [Евроштакетник](/zabory-iz-evroshtaketnika) позволяет выбрать расстояние между
> планками, если нужны просветы. Сетка-рабица оставляет участок открытым для
> обзора.
>
> Ворота и калитку лучше включить в расчёт сразу. Размер проёма, способ
> открывания и заполнение влияют на комплектацию. На итоговую смету также влияют
> длина и высота ограждения, основание и особенности участка. Поэтому стартовая
> цена за метр не равна стоимости готового объекта.
>
> Выше показаны выполненные работы в Гродненской области. На каждой карточке
> указан фактический город объекта. Чтобы сопоставить варианты по бюджету,
> посмотрите [стартовые цены на заборы и ворота](/tseny); стоимость вашего
> ограждения уточним по параметрам участка.

**DESIGN RECOMMENDATION:** три contextual links в тексте дополняют, а не заменяют
service cards. `/nashi-raboty` не повторяется здесь, поскольку ссылка уже есть в
proof section. Ни одна фраза не утверждает, что regional photos сделаны в Лиде.

Лида проверяет главный fallback scenario: может ли page быть полезной и локально
честной без exact project и без выдуманного уникального текста.

## 9. Пример структуры для `/glubokoe`

### Data state

- **VERIFIED FACT:** `/glubokoe` — existing route, Витебская область.
- **VERIFIED FACT:** есть confirmed exact project
  `real-green-profnastil-glubokoe`; current mode — `exact`.
- **VERIFIED FACT:** после exact project current selection может дополняться
  confirmed records из Постав и Лепеля в рамках limit 3.
- **DESIGN RECOMMENDATION:** curated Vitebsk pool использует эти три confirmed
  проекта без новых фото. На странице Глубокого exact-card первая, затем по
  возможности сетка-рабица из Постав и профнастил из Лепеля. Повтор материала
  честнее, чем выдуманный третий тип.
- **DESIGN RECOMMENDATION:** nearby settlements для первой v2 не обязательны. Если
  позднее появится короткий owner-confirmed список, его можно добавить без изменения
  template; названия нельзя угадывать или генерировать по карте.

### Visible v2 structure

1. Hero: `Установка заборов в Глубоком под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Заборы в Глубоком: расчёт, доставка и монтаж` — точный compact copy ниже.
4. `Заборы, которые устанавливаем в Глубоком` — service heading. Subtitle:
   `Среди примеров есть объект в Глубоком; остальные работы выполнены в Витебской
   области`. Первая card — exact `Объект: Глубокое`; далее `Объект: Поставы` и
   `Объект: Лепель` при выбранном curated порядке. Ни одна regional card не
   выдаётся за объект в Глубоком.
5. `Типы заборов в Глубоком` — существующие три cards.
6. `Ворота и калитки в Глубоком` — существующие три cards.
7. `Как сравнить конструкции и рассчитать комплект` — точный explanatory copy ниже.
8. `Рассчитайте стоимость забора в Глубоком` — текущий QuizForm.
9. `Другие города` — current same-region links.

### `/glubokoe`: proposed compact copy

> **Заборы в Глубоком: расчёт, доставка и монтаж**
>
> Зона работ: Глубокое и Витебская область.
>
> Для предварительного расчёта сообщите примерную длину и высоту забора, желаемый
> материал и нужны ли ворота или калитка.
>
> После предварительного расчёта уточним особенности участка и согласуем условия
> выезда, доставки и монтажа.
>
> Цены на странице служат стартовым ориентиром. Итоговую стоимость рассчитываем
> под объект.

Optional короткий подтверждённый список nearby settlements можно добавить после
базовой географии позднее. Его отсутствие не меняет этот fallback.

### `/glubokoe`: proposed lower explanatory copy

> **Как сравнить конструкции и рассчитать комплект**
>
> Среди наших работ в Глубоком есть забор из профнастила с металлической
> окантовкой. Сплошное заполнение закрывает участок от обзора, а окантовка
> выделяет контур секций. Если рассматриваете похожую конструкцию, посмотрите
> [варианты из профнастила](/zabory-iz-profnastila).
>
> Для более открытого периметра можно сравнить её с
> [сеткой-рабицей](/zabory-iz-setki-rabitsy). Евроштакетник даёт другой вид
> фасада: степень открытости зависит от расстояния между планками. При выборе
> учитывайте высоту, основание, ворота и калитку, чтобы расчёт охватывал весь
> комплект.
>
> Рядом с объектом в Глубоком показаны работы из других городов Витебской
> области. Город каждой работы указан на карточке. [Стартовые цены по видам
> работ](/tseny) помогут сопоставить варианты; итоговую стоимость уточним по
> параметрам вашего участка.

**DESIGN RECOMMENDATION:** exact-city project поддерживает конкретный пример,
но пояснение под proof heading и карточки отделяют его от regional examples.
Три contextual links помогают сравнению; `/nashi-raboty` здесь не дублируется.

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

1. добавить `localContent` только этим records; отсутствие `nearbySettlements` не
   блокирует v2, базовый output использует город + область; нижний редакционный
   текст готовится только для пяти pilot records, без обязанности массово
   переписать остальные 35 routes;
2. добавить explicit `proofStatus` всем существующим project records без изменения
   их текста/assets; собрать общий curated regional pool из existing confirmed IDs
   и выбрать карточки deterministic, без новых фотографий;
3. в одном `CityPage` render v2 по `localContent.version`, без slug conditions;
4. сохранить legacy output для остальных 35 routes на время pilot;
5. не создавать Поставы, Щучин, Островец, Ошмяны или другие routes;
6. не менять metadata/schema/prices/QuizForm/related-city algorithm;
7. semantic `updatedAt` менять только у реально изменённых pilot routes и только в
   implementation stage.

**OPEN QUESTION / NON-BLOCKING:** есть ли фактические региональные отличия в условиях
выезда/доставки, которые когда-либо потребуется отразить отдельным shared operational
profile. Для первой v2 implementation неизвестных blocking business claims не
остаётся, если wording ограничена утверждённым nationwide service fact и существующим
правилом уточнять условия после предварительного расчёта и согласования.

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
- если `nearbySettlements` заполнены, every value совпадает с owner-approved source
  list; отсутствие списка корректно выводит город + область;
- exact/regional/nationwide labels совпадают с фактическим `project.city`;
- региональный pool содержит только confirmed IDs соответствующей области;
  exact-city card первая, а selection повторяется в одном и том же порядке при
  повторном render/build; label каждой card имеет вид `Объект: <фактический город>`;
- желательно разнообразие материалов/услуг, но отсутствие нужного типа не блокирует
  страницу и не ведёт к fake records; новые фото не являются условием pilot;
- starter projects ни при каких IDs не попадают в proof;
- compact section и lower explanatory text выполняют разные задачи; 2–4 абзаца
  содержат проверяемые сравнения, без `за 5 минут`, региональной «популярности»,
  неподтверждённых бригад, сроков и повторения hero/trust/quiz;
- contextual commercial links ведут на существующие canonical service/pricing
  pages, помогают выбору, не превращаются в список анкоров или новую page сеть;
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
3. Разделить полезную функцию `citySeoText()`: compact service-area/estimate answer
   выше, а содержательное сравнение материалов, комплектации и стоимости в 2–4
   естественных абзацах после proof/service cards и перед QuizForm. Отдельный
   `districts` block объединить с service-area output, не удаляя commercial смысл.
4. Использовать город + область как честный fallback; owner-confirmed nearby
   settlements остаются optional enhancement. Не добавлять улицы, случайные названия
   с карты, адреса или автоматические routes.
5. Сохранить shared services/prices и лишь уточнить, что цена — стартовый ориентир,
   а не city tariff.
6. Локализовать H2 `Типы заборов` и `Ворота и калитки`; cards не дублировать.
   Нижний текст с несколькими естественными contextual links должен помогать
   сравнению, а не наращивать word count или повторять карточки.
7. Поднять real-project proof выше; использовать curated confirmed regional pool
   примерно из 3–6 работ на область, deterministic около трёх карточек на city
   page, exact-city первой при наличии. Heading описывает услугу, subtitle —
   географию примеров, каждая card — фактический город. `proofStatus` заменяет
   `real-` ID convention; 2–3 exact projects на city route не требуются.
8. Не менять QuizForm, trust, related-city graph, schema, metadata, canonical или
   service pages.
9. Проверить два обязательных proof scenarios: `/lida` как honest regional fallback и
   `/glubokoe` как exact-city proof.
10. Не расширять rollout и не создавать новые routes до owner approval, recrawl и
    Google + Yandex measurement.
