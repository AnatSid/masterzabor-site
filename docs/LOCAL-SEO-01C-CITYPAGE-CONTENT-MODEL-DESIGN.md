# LOCAL-SEO-01C — shared CityPage / content-model refinement

Дата аудита: 2026-09-24

Статус: **DESIGN ONLY / APPLICATION NOT IMPLEMENTED**

Original audit baseline: `27732f9343d41387b107cd53ebb1bc34ecfcff62`

Refinement baseline: `7df715cbb5a1544ba2910d8f1bc0108a6c084dd0` (approved design in `main`).

Final-architecture refinement base: `84f9e738fa90fc85cf673946ad2ae8f086962b50`.

Owner/editorial final correction base: `d4b7e81f29dd4fc8f08127acb9331abc950345c5`.

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

Следствие для этого design: сохраняем работающий commercial text и его естественную
поисковую семантику. Улучшаем доказательность формулировок, ссылки и представление
проектов, не меняя архитектуру страницы ради «новизны».

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
| `Заборы в <городе>: расчёт, доставка и монтаж` | **VERIFIED FACT:** заголовок отвечает commercial intent и уже стоит сразу после hero/trust. | **ОСТАВИТЬ** заголовок и позицию примерно без изменений. Под ним один цельный refined текст, не новый compact block. |
| `citySeoText()` | **VERIFIED FACT:** четыре связных абзаца уже охватывают установку, географию, материалы, комплектацию, расчёт, выезд, смету, доставку и монтаж. `За 5 минут` и региональная «популярность» материалов не подтверждены. Собственные постоянные монтажники отражены в опубликованном shared trust-блоке. | **ТОЧЕЧНО ОТРЕДАКТИРОВАТЬ** исходные четыре абзаца: сохранить примерно объём и смысл, убрать слабые claims, добавить естественные contextual links. Не разделять на верхний и нижний текст. |
| `Типы заборов` | **VERIFIED FACT:** три реальные service cards уже дают фото, описание, общие стартовые цены и ссылки на material pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Типы заборов в <городе>`. Карточки, цены и URL не дублировать и не делать city-specific. |
| `Ворота и калитки` | **VERIFIED FACT:** три service cards уже покрывают выбор въездной группы и ведут на service pages. | **НЕМНОГО ЛОКАЛИЗОВАТЬ:** H2 `Ворота и калитки в <городе>`. Содержимое карточек не менять. |
| `districts` | **VERIFIED FACT:** поле заполнено только у Гомеля и Минска; в pilot routes отдельный блок не появляется. Та же информация у этих двух городов повторяется в `citySeoText()`. | **НЕ ДЕЛАТЬ НОВЫЙ БЛОК:** при последующем rollout уточнённые `cityDistricts` можно включать одной естественной фразой в существующий текст. В pilot достаточно города + области. |
| Реальные проекты / fallback | **VERIFIED FACT:** выбираются только records с `id` prefix `real-`; порядок exact city -> same oblast -> nationwide, limit 3. City проекта уже показан в карточке. | **УСИЛИТЬ:** явные `proofStatus` и optional `proofPriority` в `content/projects.ts`, deterministic выбор около трёх карточек, exact project первым, компактная метка `Объект: <фактический город>`. Отдельный ручной список project IDs по областям не нужен. |
| Quiz/CTA | **VERIFIED FACT:** compact QuizForm получает `cityName` и уникальный `source=city-<slug>`; hero CTA ведёт к нему. | **НЕ ТРОГАТЬ** behavior, fields, analytics и validation. |
| `Другие города` | **VERIFIED FACT:** `getRelatedCities()` даёт deterministic same-region ring, без self/duplicates, максимум 8; старый array-order defect уже закрыт. | **НЕ ТРОГАТЬ** алгоритм. Не смешивать route links с nearby settlements без routes. |

## 2. Что уже достаточно хорошо

1. **VERIFIED FACT:** H1, hero CTA, телефон и quiz уже закрывают основной
   transactional путь: понять услугу -> запросить расчёт -> оставить параметры.
2. **VERIFIED FACT:** CityPage уже ссылается на все шесть service pages через карточки
   с реальными service images и shared price data. Отдельный новый material link block
   не нужен.
3. **VERIFIED FACT:** общий trust block уже присутствует. Он прямо говорит `Свои
   бригады: работаем постоянными монтажниками, без случайных подрядчиков`; Knowledge
   Base фиксирует owner approval этой системы преимуществ. Это shared claim о том,
   кто устанавливает забор, но не доказательство постоянных баз в каждой области.
   В refined тексте достаточно один раз упомянуть гарантийные условия как часть
   согласования; рассрочку повторять не нужно.
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

**VERIFIED FACT:** текущий `citySeoText()` уже отвечает на большую часть
коммерческих вопросов, а его четыре абзаца читаются как связный текст. Недостатки
находятся внутри формулировок: `за 5 минут`, не подтверждённая данными
«популярность» материалов в области, повтор города и отдельные перегруженные
обещания результата. Ссылок на соответствующие услуги и цены в нём нет.

**DESIGN RECOMMENDATION:** оставить один текст примерно того же объёма и в той же
позиции. Сохранить сильные business facts, исправить слабые фразы и дать 2–4
контекстные ссылки. Не создавать два новых content layers и не ставить word count
как критерий качества.

### Gap 2 — service area не имеет явной fallback-модели

**VERIFIED FACT:** для Лиды, Гродно, Слонима, Новогрудка, Сморгони, Глубокого и Лепеля
нет `districts`; пользователь видит только общую фразу `и рядом с городом`.

**USER/BUSINESS FACT:** MasterZabor работает по Беларуси. Поэтому правдивая базовая
география для CityPage — целевой город и его область; отдельный список соседних
населённых пунктов не нужен для подтверждения этой зоны обслуживания.

**DESIGN RECOMMENDATION:** базовая фраза внутри первого абзаца:
`устанавливаем заборы в <городе> и по <области>`. Если позднее есть короткий
owner-confirmed список meaningful nearby settlements, его можно добавить в ту же
связную прозу, а не отдельным административным блоком. Не генерировать названия
автоматически, не брать их случайно с карты и не создавать для них routes.

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

**DESIGN RECOMMENDATION:** отбирать около трёх работ стабильно из
`content/projects.ts`: confirmed exact-city первым, затем same-oblast работы.
`proofPriority` задаёт редакционный приоритет качества фото/карточки. Разнообразие
материалов желательно среди сопоставимо сильных работ, но слабую фотографию не
поднимают ради третьего типа. Если нужного типа нет, не создавать фиктивную карточку.
Заголовок может говорить об услуге в городе, а подпись прямо называет географию примеров.
Каждая карточка показывает `Объект: <фактический город>`. Не переименовывать проект
из Слонима или Новогрудка в «объект в Лиде».

### Gap 5 — стартовая цена выглядит локальной, хотя данные общие

**VERIFIED FACT:** hero говорит `Цены от 30 BYN/м.п.`, а service cards берут общие
`services.priceFrom`; отдельного city pricing source нет. `/tseny` уже объясняет, что
это ориентиры и что итог зависит от объекта.

**DESIGN RECOMMENDATION:** не добавлять новый standalone price block. Существующие
hero и service cards должны продолжать брать значения из одного shared source, но
hero value следует назвать `Стартовый ориентир` и рядом дать ссылку на `/tseny`.
В финальном абзаце существующего текста дать контекстную ссылку на `/tseny` и
объяснить, что итоговая стоимость зависит от параметров объекта. Не создавать
`cityPrice`.

### Claim matrix для refined `citySeoText()`

| Тезис старого copy | Статус | Решение для v2 |
| --- | --- | --- |
| Работа по Беларуси, в том числе в малых городах | **USER/BUSINESS FACT:** approved homepage FAQ и ServicePage. | Сохранить как `город + область`, без выдуманного местного офиса. |
| Предварительный расчёт по телефону, затем выезд специалиста после согласования | **VERIFIED FACT:** shared trust и approved FAQ/ServicePage copy. | Сохранить; не обещать `за 5 минут` или обязательный бесплатный замер. |
| Свои постоянные монтажники/бригады, работающие по Беларуси | **USER/BUSINESS FACT:** owner-approved trust cards подтверждают постоянные бригады; nationwide wording теперь прямо дан владельцем в целевом примере. | Сохранить в четвёртом абзаце. Не делать вывод об их постоянной базе в каждом городе или области. |
| Постоянные *региональные* или *местные* бригады в каждой области | **OPEN QUESTION / OWNER CONFIRMATION NEEDED:** repository этого не доказывает. | Не публиковать до подтверждения операционной модели и применимости к регионам pilot. Не blocker для нейтральной v2 wording. |
| Смета, комплектация, сроки, гарантийные условия | **VERIFIED FACT:** shared trust card `Договор и смета`, ServicePage и текущий CityPage. | Сохранить в связном финальном абзаце без отдельного повторяющего блока. Не обещать одинаковые сроки в каждом городе. |
| Доставка и выезд | **VERIFIED FACT:** nationwide FAQ и ServicePage описывают согласование и организацию выезда; trust говорит о доставке и монтаже. | Объяснить, что условия обсуждаются до договора. Не обещать отсутствие доплаты за расстояние, особый тариф или конкретную базу выезда. |
| Подбор ворот/калитки и особенности участка | **VERIFIED FACT:** service cards, trust и shared ServicePage уже раскрывают эти темы. | Упомянуть в расчёте и полезном сравнении, не пересказывать карточки. |
| `За 5 минут`, региональная популярность материалов и гарантированный результат в виде перечисленных качеств монтажа | **OPEN QUESTION:** нет подтверждённых данных для таких обещаний. | Не переносить в v2 copy. |

### Editorial/search delta для одного existing block

- **SEARCH EVIDENCE / DESIGN RECOMMENDATION:** H2 сохраняет `Заборы в <городе>`;
  Hero уже содержит `Установка заборов ... под ключ`. В тексте естественно остаются
  `предварительный расчёт стоимости`, `монтаж`, `доставка` и названия материалов.
  `Профнастил (металлопрофиль)` один раз даёт понятный читателю синоним без
  повторения city-keyword в каждом абзаце.
- **DESIGN RECOMMENDATION:** четыре contextual links встроены в предложение о
  выборе материала и в заключительную фразу о цене:
  `профнастил (металлопрофиль)` → `/zabory-iz-profnastila`, `евроштакетник` →
  `/zabory-iz-evroshtaketnika`, `сетка-рабица` → `/zabory-iz-setki-rabitsy`,
  `цен на заборы` → `/tseny`. Это путь к подробностям, а не link list ради SEO.
- **VERIFIED FACT / USER/BUSINESS FACT:** сохраняются выбор конструкции,
  предварительный расчёт по параметрам, выезд, доставка, монтаж собственными
  постоянными бригадами, комплектация, смета, договор, сроки и гарантийные
  условия. Формулировка `город + область` заменяет неясное `рядом с городом`.
- **DESIGN RECOMMENDATION:** убираются только недоказанные `за 5 минут`,
  «чаще всего выбирают» применительно к области и гарантированный набор
  результатов вроде идеально ровной линии/прочных столбов. Это не сокращение
  текста ради краткости и не новый SEO-текст под каждый город.
- **SEARCH EVIDENCE:** существующая видимость city pages в Яндексе — причина
  сохранять один блок, его позицию и смысл. Уточнения оцениваются после recrawl
  отдельно в Google и Яндексе; ожидаемый рост позиций не заявляется как факт.

## 4. Proposed CityPage v2 — один рекомендуемый design

### Консервативный порядок

1. **Hero/H1** и общий `BenefitTrustSection` остаются на месте. Hero price
   microcopy обозначает стартовый ориентир, не отдельный городской тариф.
2. **Один refined commercial text block** остаётся примерно там, где сейчас
   находится `citySeoText()`: H2 `Заборы в <городе>: расчёт, доставка и монтаж`
   и четыре связных абзаца. Исходный текст служит редакционной основой. В первом
   абзаце естественно раскрыта работа в городе и по области, во втором расчёт и
   выезд, в третьем выбор материалов и комплектации, в четвёртом бригады, смета,
   договор, сроки, гарантийные условия и цены. Никаких labels `Зона работ:` и
   отдельного нижнего explanatory block.
3. **`Типы заборов в <городе>`** и **`Ворота и калитки в <городе>`** сохраняют
   существующие service cards, изображения, общие стартовые цены и URL.
4. **Один project-proof block** остаётся после service cards, как сейчас. В нём
   около трёх confirmed работ: exact-city первой при наличии, затем своя область.
   Heading может описывать предлагаемую услугу в городе, subtitle уточняет
   географию выполненных работ, на каждой карточке `Объект: <фактический город>`.
   Отдельный showcase-photo block не нужен.
5. **QuizForm** и **`Другие города`** остаются на своих местах; related-city
   selection и CTA behavior не меняются.

Отдельный `districts` section в будущем v2 можно включить в первый абзац только
там, где есть подтверждённые данные. В пяти pilot routes их отсутствие не мешает
формуле `город + область`; nearby settlements остаются optional.

**DESIGN RECOMMENDATION:** project proof намеренно не поднимается выше текста или
услуг. Пользователь сначала видит предложение, порядок расчёта и варианты
конструкций, затем проверяет их на выполненных работах. Это почти текущий порядок;
перестановка контента сама по себе не имеет подтверждённого SEO-эффекта. Яндекс
уже даёт city pages видимость, поэтому крупное изменение DOM и текста сразу
усложнило бы оценку pilot в Google и Яндексе.

### Почему это минимально

- один template и одна функция refined commercial copy для всех v2 routes;
- примерно тот же объём и прежняя позиция четырёх абзацев;
- карточки услуг, project assets, цены, trust, quiz, related cities и schema
  переиспользуются;
- исправляются только неподтверждённые claims и добавляются полезные ссылки;
- pilot включается через data, без `if (slug === ...)`, отдельных templates и
  обязательных ручных текстов для остальных 35 городов.

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
  | "/tseny";

type CityCommercialPart = {
  text: string;
  href?: CityCommercialLinkTarget;
};

type CityLocalContentV2 = {
  version: 2;
  serviceArea?: CityServiceArea;
  // Exceptional, owner-approved fact; default is refined shared citySeoText().
  commercialOverride?: {
    paragraphs: CityCommercialPart[][];
    evidence: string; // internal provenance, never rendered
  };
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

**DESIGN RECOMMENDATION:** сохранить shared `citySeoText(city)` как основу. Для
pilot v2 отредактировать его существующие четыре абзаца и возвращать link-ready
text parts. Никакого `renderLocalBlock` и `renderExplanation` нет. Город появляется
естественно в первой фразе и H2; следующие абзацы не обязаны снова повторять
название ради exact-match запросов. Общие ссылки находятся в самом shared тексте.

```ts
renderCityCommercialText(city, city.localContent?.serviceArea);
// One H2 + roughly four connected paragraphs in the current position.
// Uses city.namePrepositional and city.oblastGenitive; no per-city copy required.
```

Форма `в ${city.namePrepositional} и по ${city.oblastGenitive}` использует уже
существующие поля: для названий областей дательный падеж после `по` внешне
совпадает с хранимым родительным (`по Гродненской области`). Новый grammar field
не требуется. `CityCommercialPart` нужен для общих contextual links и редкого
override, а не для 40 городских вариантов текста.

`commercialOverride` допустим только при действительно уникальном подтверждённом
business fact. Поле `evidence` фиксирует источник или owner approval внутри данных
и не отображается. Пять pilot routes используют общий refined текст без override;
после pilot ещё 35 «уникальных SEO-текстов» не понадобятся. Exact-city project
показывается в proof block, не вставляется автоматически в прозу.

**DESIGN RECOMMENDATION:** при будущем переводе Гомеля/Минска на v2 существующее
`districts` мигрирует в `serviceArea.cityDistricts`; если факт нужен читателю,
он включается естественной фразой в первый абзац. Отдельный список не создаётся,
одно значение не выводится дважды.

**DESIGN RECOMMENDATION:** rendering rule для `serviceArea`:

- если есть подтверждённые meaningful `nearbySettlements`, можно кратко упомянуть
  их в первом абзаце после базовой географии;
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
  proofPriority?: number; // smaller positive integer = stronger quality tier
};
```

`getCityProjectProof()` сохраняет exact -> oblast -> nationwide и limit 3, но фильтрует
`proofStatus === "confirmed"`. `proofPriority` задаёт редакционный tier качества
фото и пригодности карточки для регионального proof (например, 1 = сильнейшая,
2 = следующая). Меньшее положительное число выше; отсутствие значения означает
последний tier внутри bucket. `isFeatured` остаётся для
своего текущего назначения и не используется как оценка local proof. Project
city/material/photo/description остаются в `content/projects.ts`; в `cities.ts`
не добавляются duplicate project IDs или тексты.

**USER/BUSINESS FACT:** целевая единица для масштабирования — не набор exact-city
фотографий каждого route, а 3–6 сильных confirmed projects на область. Один project
может использоваться на нескольких city pages своей области. Наличие exact-city
работы — приоритет, не prerequisite. В перспективе около шести качественных
confirmed records на область достаточно как рабочий ориентир, не жёсткая квота.

**VERIFIED FACT:** для pilot уже есть шесть confirmed records Гродненской области
(Слоним, Новогрудок, Щучин, Островец, Ошмяны, Сморгонь) и три Витебской
(Глубокое, Лепель, Поставы). Новых assets или fake records не требуется.

**DESIGN RECOMMENDATION:** региональный pool вычисляется фильтрацией
`content/projects.ts` по normalized oblast и `proofStatus`. Отдельного
`regionalProofPool` со списками project IDs не будет: он дублировал бы город и
область, уже указанные в каждом проекте, и мог расходиться с ними.

Selection на каждом render детерминированный:

1. фильтровать `proofStatus === "confirmed"`; исключить starter вне зависимости от ID;
2. разделить кандидатов на exact city, same normalized oblast и other oblast;
3. exact-city confirmed ставить первыми; внутри exact bucket сортировать по
   `proofPriority` (меньше = сильнее), затем по стабильному `project.id`;
4. добирать до трёх из same-oblast. Для каждого места сначала брать лучший
   доступный quality tier; внутри него предпочитать ещё не показанную
   category/material, затем минимальный `project.id`. Так качество фото важнее
   искусственного разнообразия, а выбор не зависит от порядка массива;
5. nationwide confirmed использовать только если региональных карточек меньше
   трёх. В таком случае subtitle не должен называть весь набор «работами в области».

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
- четыре абзаца refined `citySeoText()` с contextual links на relevant services;
- services, images, `priceFrom`, service URLs;
- trust benefits, installment copy и CTA behavior;
- proof heading/labels, вычисляемые из selection mode;
- deterministic proof selection из `content/projects.ts`;
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
4. **DESIGN RECOMMENDATION / exceptional:** `commercialOverride` только при
   действительно уникальном подтверждённом факте с `evidence`. Pilot и обычный
   rollout обходятся без него: город и область подставляются в shared функцию,
   exact project остаётся в proof block.
5. **USER/BUSINESS FACT / conditional:** только реальное исключение в логистике.
   До появления таких отличий оно не становится полем City.

Не нужны свободные `cityIntro`/`citySeoText` без роли и источника,
`cityPrice`, `cityFaq`, `cityReview`, `recommendedMaterialsForCity` или свободный
`localFacts`. Они быстро превратятся в непроверяемые вариации одного текста.

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
- **DESIGN RECOMMENDATION:** selection берёт около трёх карточек прямо из этих
  project records с учётом `proofPriority` и категории. Например, Новогрудок
  (евроштакетник), Щучин (3D) и Слоним (евроштакетник) при соответствующих
  приоритетах. Это illustrative deterministic set, не отдельный список IDs;
  профнастила в подтверждённом Grodno pool сейчас нет.
- **DESIGN RECOMMENDATION:** nearby settlements для первой v2 не обязательны. Если
  позднее появится короткий owner-confirmed список, его можно добавить без изменения
  template; названия нельзя угадывать или генерировать по карте.

### Visible v2 structure

1. Hero: `Установка заборов в Лиде под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Заборы в Лиде: расчёт, доставка и монтаж` — один refined commercial text block
   в нынешней позиции; полный текст ниже.
4. `Типы заборов в Лиде` — существующие три cards.
5. `Ворота и калитки в Лиде` — существующие три cards.
6. `Заборы, которые устанавливаем в Лиде` — заголовок услуги, не утверждение о
   географии фотографий. Subtitle: `Примеры наших выполненных работ в Гродненской
   области`. Около трёх confirmed карточек из проектов своей области; на каждой виден
   фактический город, например `Объект: Новогрудок`, `Объект: Щучин`,
   `Объект: Слоним`. Link карточки ведёт к соответствующей service page, как сейчас.
7. `Рассчитайте стоимость забора в Лиде` — текущий QuizForm без изменений.
8. `Другие города` — current same-region links без nearby non-route settlements.

### `/lida`: один refined commercial text block

> **Заборы в Лиде: расчёт, доставка и монтаж**
>
> МастерЗабор устанавливает заборы в Лиде и по Гродненской области. Работаем с
> частными домами, дачами, новыми участками и коммерческими объектами. Помогаем
> подобрать материал, высоту, каркас, ворота и калитку с учётом участка и бюджета.
>
> Чтобы получить предварительный расчёт стоимости, не нужно сначала ждать замера.
> Достаточно назвать примерную длину и высоту забора, материал и сказать, нужны ли
> ворота или калитка. По этим данным специалист назовёт ориентир по телефону, а
> после согласования условий организуем выезд, доставку и монтаж.
>
> Если участок нужно закрыть от обзора, можно выбрать
> [профнастил (металлопрофиль)](/zabory-iz-profnastila).
> [Евроштакетник](/zabory-iz-evroshtaketnika) позволяет оставить просветы между
> планками, а [сетка-рабица](/zabory-iz-setki-rabitsy) подходит для открытого
> периметра. Ворота и калитку лучше учитывать сразу: ширина проёма, способ
> открывания, основание и особенности участка влияют на комплектацию и итоговую
> смету.
>
> Монтаж выполняют наши постоянные бригады, которые работают по Беларуси. До
> начала работ согласуем комплектацию, выезд, доставку, сроки и стоимость; эти
> условия фиксируем в смете и договоре. Гарантийные условия также прописываем
> в договоре. Ориентиры по стоимости можно посмотреть на странице
> [цен на заборы](/tseny).

**DESIGN RECOMMENDATION:** четыре contextual links встроены в существующие мысли
о материалах и стоимости, не образуют отдельного link list. Ссылка на
`/nashi-raboty` не повторяется: переход уже есть в proof section. Текст не
утверждает, что regional photos сделаны в Лиде. Optional подтверждённые nearby
settlements можно будет добавить в первый абзац, но их отсутствие не blocker.

Лида проверяет главный fallback scenario: может ли page быть полезной и локально
честной без exact project и без выдуманного уникального текста.

## 9. Пример структуры для `/glubokoe`

### Data state

- **VERIFIED FACT:** `/glubokoe` — existing route, Витебская область.
- **VERIFIED FACT:** есть confirmed exact project
  `real-green-profnastil-glubokoe`; current mode — `exact`.
- **VERIFIED FACT:** после exact project current selection может дополняться
  confirmed records из Постав и Лепеля в рамках limit 3.
- **DESIGN RECOMMENDATION:** selection использует эти три confirmed проекта
  без новых фото и отдельного списка IDs. На странице Глубокого exact-card
  первая, затем сетка-рабица из Постав и профнастил из Лепеля при соответствующем
  `proofPriority`. Повтор материала честнее, чем выдуманный третий тип.
- **DESIGN RECOMMENDATION:** nearby settlements для первой v2 не обязательны. Если
  позднее появится короткий owner-confirmed список, его можно добавить без изменения
  template; названия нельзя угадывать или генерировать по карте.

### Visible v2 structure

1. Hero: `Установка заборов в Глубоком под ключ`; `Стартовый ориентир от 30 BYN/м.п.`.
2. Shared trust section.
3. `Заборы в Глубоком: расчёт, доставка и монтаж` — один refined commercial text
   block в нынешней позиции; полный текст ниже.
4. `Типы заборов в Глубоком` — существующие три cards.
5. `Ворота и калитки в Глубоком` — существующие три cards.
6. `Заборы, которые устанавливаем в Глубоком` — service heading. Subtitle:
   `Среди примеров есть объект в Глубоком; остальные работы выполнены в Витебской
   области`. Первая card — exact `Объект: Глубокое`; далее `Объект: Поставы` и
   `Объект: Лепель` при выбранном стабильном порядке. Ни одна regional card не
   выдаётся за объект в Глубоком.
7. `Рассчитайте стоимость забора в Глубоком` — текущий QuizForm.
8. `Другие города` — current same-region links.

### `/glubokoe`: один refined commercial text block

> **Заборы в Глубоком: расчёт, доставка и монтаж**
>
> МастерЗабор устанавливает заборы в Глубоком и по Витебской области. Работаем с
> частными домами, дачами, новыми участками и коммерческими объектами. Помогаем
> подобрать материал, высоту, каркас, ворота и калитку с учётом участка и бюджета.
>
> Чтобы получить предварительный расчёт стоимости, не нужно сначала ждать замера.
> Достаточно назвать примерную длину и высоту забора, материал и сказать, нужны ли
> ворота или калитка. По этим данным специалист назовёт ориентир по телефону, а
> после согласования условий организуем выезд, доставку и монтаж.
>
> Если участок нужно закрыть от обзора, можно выбрать
> [профнастил (металлопрофиль)](/zabory-iz-profnastila).
> [Евроштакетник](/zabory-iz-evroshtaketnika) позволяет оставить просветы между
> планками, а [сетка-рабица](/zabory-iz-setki-rabitsy) подходит для открытого
> периметра. Ворота и калитку лучше учитывать сразу: ширина проёма, способ
> открывания, основание и особенности участка влияют на комплектацию и итоговую
> смету.
>
> Монтаж выполняют наши постоянные бригады, которые работают по Беларуси. До
> начала работ согласуем комплектацию, выезд, доставку, сроки и стоимость; эти
> условия фиксируем в смете и договоре. Гарантийные условия также прописываем
> в договоре. Ориентиры по стоимости можно посмотреть на странице
> [цен на заборы](/tseny).

**DESIGN RECOMMENDATION:** exact-city project остаётся в proof block и не требует
особого абзаца или более длинного городского текста. Четыре contextual links
общие для shared функции; `/nashi-raboty` здесь не дублируется. Optional
подтверждённые nearby settlements можно будет добавить в первый абзац.

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

1. добавить `localContent: { version: 2 }` только этим records; `serviceArea` и
   `nearbySettlements` optional, fallback использует город + область. Не писать
   `commercialParagraphs` для пяти pilot или остальных 35 routes: всем v2
   доступен один shared refined `citySeoText()` в нынешней позиции страницы;
2. добавить explicit `proofStatus` всем существующим project records без изменения
   их текста/assets; где нужно, поставить `proofPriority` для качества photo/card.
   Выбирать проекты из `content/projects.ts`, без отдельного регионального списка
   IDs и без новых фотографий;
3. в одном `CityPage` render v2 по `localContent.version`, без slug conditions;
4. сохранить legacy output для остальных 35 routes на время pilot;
5. не создавать Поставы, Щучин, Островец, Ошмяны или другие routes;
6. не менять metadata/schema/prices/QuizForm/related-city algorithm;
7. semantic `updatedAt` менять только у реально изменённых pilot routes и только в
   implementation stage.

**OPEN QUESTION / OWNER CONFIRMATION NEEDED только для усиленного claim:**
существуют ли действительно постоянные бригады, базирующиеся в Гродненской и
Витебской областях, и одинаково ли это верно для всех pilot routes? Без ответа
нельзя писать `местная бригада` или `бригады, работающие по региону` как
организационный факт. Это не blocker для v2: опубликованный shared claim о своих
постоянных монтажниках и утверждённый процесс выезда позволяют честную формулировку.

**OPEN QUESTION / NON-BLOCKING:** есть ли фактические региональные отличия в условиях
выезда/доставки, которые когда-либо потребуют shared operational profile.

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
- региональные кандидаты получаются из `content/projects.ts`, без отдельного
  списка IDs; exact-city card первая, а selection повторяется в одном и том же
  порядке при повторном render/build; label каждой card имеет вид
  `Объект: <фактический город>`;
- желательно разнообразие материалов/услуг, но отсутствие нужного типа не блокирует
  страницу и не ведёт к fake records; новые фото не являются условием pilot;
- starter projects ни при каких IDs не попадают в proof;
- refined `citySeoText()` остаётся одним связным блоком из примерно четырёх абзацев
  в нынешней позиции; нет обязательного второго local/explanatory block или
  per-city paragraphs; exact-city claim остаётся только в proof section;
- в copy нет `за 5 минут`, региональной «популярности», местной базы бригад без
  owner confirmation, city-specific сроков и повторения hero/trust/quiz;
- contextual commercial links ведут на существующие canonical service/pricing
  pages, помогают выбору, не превращаются в список анкоров или новую page сеть;
- service cards сохраняют shared price/link/image data;
- нет нового standalone price block; hero/cards используют один shared price source,
  `/tseny` link работает, ложного city price нет;
- QuizForm city/source/submission behavior и analytics не изменены;
- related-city graph не изменён; nearby settlements без routes не становятся links;
- JSON-LD/canonical/metadata snapshots не изменены;
- desktop и mobile visual QA: прежняя позиция и читабельность commercial text,
  порядок service cards -> proof -> Quiz, project scope labels, CTA reachability
  и отсутствие horizontal overflow.

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
3. Сохранить один цельный `citySeoText()` примерно текущего объёма в нынешней
   позиции после Hero/Trust. Редакционно уточнить слабые claims и встроить
   естественные contextual links, не переписывая commercial copy с нуля и не
   добавляя обязательный второй текстовый блок. Shared функция использует
   грамматические формы города/области; для pilot не нужны отдельные городские
   тексты. `districts` не превращать в новый обязательный блок.
4. Использовать город + область как честный fallback; owner-confirmed nearby
   settlements остаются optional enhancement. Не добавлять улицы, случайные названия
   с карты, адреса или автоматические routes.
5. Сохранить shared services/prices и лишь уточнить, что цена — стартовый ориентир,
   а не city tariff.
6. Локализовать H2 `Типы заборов` и `Ворота и калитки`; cards не дублировать.
   Contextual links в существующем тексте должны помогать сравнению, а не
   наращивать word count или повторять карточки.
7. Сохранить project proof после service cards и до QuizForm: выбирать из одного
   `content/projects.ts` примерно три карточки на city page. Для области целевой инвентарь примерно
   3–6 confirmed работ, exact-city первая при наличии, `proofPriority` задаёт
   качество/редакторский приоритет, diversity мягкая, tie-break стабильный.
   Nationwide fallback только при нехватке региональных. Heading описывает
   услугу, subtitle — географию примеров, каждая card — фактический город.
   `proofStatus` заменяет `real-` ID convention; ручной regional ID pool и
   2–3 exact projects на city route не нужны.
8. Не менять QuizForm, trust, related-city graph, schema, metadata, canonical или
   service pages.
9. Проверить два обязательных proof scenarios: `/lida` как honest regional fallback и
   `/glubokoe` как exact-city proof.
10. Не расширять rollout и не создавать новые routes до owner approval, recrawl и
    Google + Yandex measurement.
