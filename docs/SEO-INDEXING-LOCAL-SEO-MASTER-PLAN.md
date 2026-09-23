# SEO / Indexing / Local SEO: master plan

Дата сверки: 2026-09-23

Статус: **ACTIVE SOURCE OF TRUTH FOR NEXT LOCAL SEO STAGES**

Production baseline: `2805ebcfdca171186cde4c1acd91872083c9f24c`

Canonical host: `https://www.masterzabor.by`

## 1. Назначение и границы

Этот документ сводит актуальные выводы по indexing, metadata и Local SEO после
`SEO-01` — `SEO-04` и `SEO-META-01` — `SEO-META-04`. Он не заменяет фактический
repository и не превращает старые snapshots в вечную истину.

Порядок доверия:

1. фактический repository и Production;
2. [`PROJECT-ROADMAP-TRACKER.md`](./PROJECT-ROADMAP-TRACKER.md);
3. этот master plan;
4. актуальные first-party данные GSC / Yandex Webmaster;
5. task-specific audits и исторические документы.

Связанные технические источники:

- [`SEO-03-GOOGLE-DISCOVERY-AUDIT.md`](./SEO-03-GOOGLE-DISCOVERY-AUDIT.md);
- [`SEO-02-SITEMAP-LASTMOD-DISCOVERY.md`](./SEO-02-SITEMAP-LASTMOD-DISCOVERY.md);
- [`SEO-METADATA-APPROVED-PLAN.md`](./SEO-METADATA-APPROVED-PLAN.md);
- [`../PROJECT-KNOWLEDGE-BASE.md`](../PROJECT-KNOWLEDGE-BASE.md).

## 2. Маркировка доказательств

| Метка | Значение |
| --- | --- |
| **VERIFIED FACT** | Проверено в repository, Production HTML/HTTP или детерминированным QA. |
| **FIRST-PARTY DATA** | Данные GSC, Yandex Webmaster или другой системы владельца; период и ограничения должны быть указаны. |
| **DIRECT SERP OBSERVATION** | Ручной snapshot выдачи с датой, устройством и контекстом; не стабильная позиция. |
| **OWNER OBSERVATION** | Наблюдение владельца, полезное как сигнал, но не независимое измерение. |
| **HYPOTHESIS** | Объяснение или возможность, которую ещё надо проверить. |
| **OPEN QUESTION** | Для решения не хватает данных или утверждённой бизнес-информации. |

## 3. Текущий Production baseline

- **VERIFIED FACT:** Production содержит 40 data-driven city routes через
  `app/[city]/page.tsx -> components/templates/CityPage.tsx -> content/cities.ts`.
- **VERIFIED FACT:** sitemap содержит 56 canonical URL; policy остаётся `www` и
  no trailing slash.
- **VERIFIED FACT:** `SEO-01` Product JSON-LD, `SEO-02` semantic sitemap freshness,
  `SEO-03` discovery audit и `SEO-04` balanced city internal linking завершены.
- **VERIFIED FACT:** `SEO-META-01` — `SEO-META-04` завершены. Утверждённые metadata
  внедрены, прошли local/Preview/Production QA. `SEO-META-05` — наблюдение после
  переобхода, а не новый implementation stage.
- **VERIFIED FACT:** nationwide/root metadata больше не наследует Gomel-only title,
  description, default keyword `Гомель`, `geo.position` или `ICBM`. Root сохраняет
  `geo.region: BY` и `geo.placename: Беларусь`; city pages сохраняют собственные
  city coordinates.
- **VERIFIED FACT:** реальный адрес компании в Гомеле, route `/gomel` и фактические
  сведения об организации не являются ошибками и не подлежат глобальному удалению.
- **VERIFIED FACT:** `SEO-03` не обнаружил общего technical indexability blocker:
  проверенные canonical routes отдавали `200`, self-canonical и не были закрыты
  robots/noindex. Это не доказывает, что Google обязан индексировать каждую страницу.

## 4. Что показывают поисковые данные

### 4.1 Page-level GSC baseline

Последний доступный evidence package содержит следующие page-level значения. Точная
дата выгрузки в этом документе не зафиксирована, поэтому это baseline, а не текущий
live report.

| URL | Impressions | Clicks | CTR | Average position | Классификация |
| --- | ---: | ---: | ---: | ---: | --- |
| `/grodno` | 46 | 2 | ~4.35% | ~39.07 | **FIRST-PARTY DATA** |
| `/lida` | 2 | 0 | 0% | ~6 | **FIRST-PARTY DATA**, очень малая выборка |
| `/glubokoe` | 30 | 1 | ~3.33% | ~10.07 | **FIRST-PARTY DATA** |
| permission article, 180 days | 109 | 5 | ~4.59% | ~5.83 | **FIRST-PARTY DATA** |

Вывод: Google знает отдельные city pages, а commercial visibility неоднородна. Эти
данные не поддерживают формулировку «Google не может индексировать сайт». Permission
article служит положительным control example, но не доказывает причину результатов
commercial pages.

GSC query rows могут быть thresholded. Отсутствие строки не означает нулевой спрос.
В доступных строках были exact commercial city queries, `металлопрофиль` для Гродно
и Гомеля и запросы с `евроштакетник`. Явных строк с `металлоштакетник` на момент
выгрузки не было. Длинные synonym-heavy titles для профнастила и евроштакетника
остаются owner-approved; оценивать их следует по `SEO-META-05`, а не сокращать
теоретически.

### 4.2 SERP observations

- **DIRECT SERP OBSERVATION:** `заборы гродно` — около позиции 5 в одной сессии.
- **DIRECT SERP OBSERVATION:** Лида и Витебск не попали в top 10 в одном check.
- **OWNER OBSERVATION:** `заборы из профнастила лида` — позиция 1.
- **DIRECT SERP OBSERVATION:** тот же запрос — примерно top 6 в независимой проверке.
- **VERIFIED FACT:** автоматизированные Google checks встретили CAPTCHA; точную
  позицию после этого нельзя честно заявлять.

Любой будущий rank snapshot должен фиксировать дату, поисковик, устройство, регион и
персонализацию. Разовое место не является стабильным rank.

## 5. Рабочая интерпретация indexing и Local SEO

1. **STILL VALID:** не переоткрывать canonical, robots, sitemap membership или domain
   architecture без новых технических доказательств.
2. **HYPOTHESIS:** различия в commercial visibility могут зависеть от спроса,
   конкуренции, качества и локальности proof, полезности страницы и внешних сигналов.
   Ни один фактор пока не доказан как единственная причина.
3. **VERIFIED FACT:** прежний data-order-biased related-city graph исправлен в
   `SEO-04`; считать его текущей причиной нельзя.
4. **STILL VALID:** высокая шаблонность и недостаток exact-local proof остаются риском,
   но не являются доказанным глобальным indexing blocker.
5. **STILL VALID:** sitemap и internal links помогают discovery, но не гарантируют
   crawl, indexing или ranking.

## 6. Конкуренты: наблюдаемые элементы, не причинные доказательства

В discovery уже рассматривались `masterskaya.by/lida/zabory.html`,
`kaksvoim.by/lida-zabory/`, `grodno.prozabory.by`,
`stroykontinent.by/uslugi/ustanovka-zabora` и `zabor-vitebsk.by`.

Повторяющиеся элементы: exact-city title/H1, цены, материалы, calculator/CTA,
фото/проекты, service areas, гарантия, договор, доставка, рассрочка/оплата, regional
links, иногда reviews, map и адрес. Это **DIRECT SERP OBSERVATION** о составе страниц,
а не доказательство, что один конкретный блок вызвал их позиции.

Цель MasterZabor — минимально достаточная, правдивая и масштабируемая архитектура,
а не механическое копирование всех конкурентных блоков.

## 7. CityPage: что уже есть и что не следует дублировать

**VERIFIED FACT:** shared `CityPage` уже содержит hero/H1, материалы, price orientation,
рассрочку, CTA, trust-блок, commercial copy, service cards, ворота/калитки, project
proof, quiz, related cities, breadcrumbs и schema.

Поэтому нельзя автоматически добавлять:

- обязательные 300–500 слов ради уникальности;
- второй общий price block без новой пользовательской функции;
- огромный generic FAQ;
- hardcoded template на город;
- keyword stuffing;
- city × material URL explosion.

Возможные shared refinements после отдельного design approval:

- естественный заголовок `Типы заборов в <городе>`;
- при достаточном содержании `Ворота и калитки в <городе>`;
- честная service-area data/text model;
- более сильный exact-city или regional proof.

Эти элементы должны улучшать навигацию и понимание услуги, а не просто повторять
ключевые слова.

## 8. Regional hub model и пилот

### 8.1 Принцип

- City/district-center pages работают как regional hubs.
- Соседние населённые пункты можно естественно упоминать внутри hub page.
- Не создавать страницу на каждую деревню, случайные улицы или fake addresses.
- Dedicated URL допустим при сочетании спроса, SERP opportunity, private-sector
  relevance, логистики, реального proof и возможности дать полезную local information.
- Shared data-driven architecture сохраняется; отдельных page templates по городам нет.
- Каждый следующий регион должен улучшать модель предыдущего, а не копировать её
  механически.

### 8.2 Очерёдность

1. Гродненская + Витебская области — pilot.
2. Минская область.
3. Гомельская область.
4. Брестская область.
5. Могилёвская область.

Порядок можно менять по новым GSC/Yandex/SERP и business/logistics данным.

### 8.3 Existing routes и proof

Existing Grodno-region routes: Гродно, Лида, Волковыск, Слоним, Сморгонь,
Новогрудок. Existing Vitebsk-region routes: Витебск, Орша, Новополоцк, Полоцк,
Глубокое, Лепель.

Подтверждённый exact-city real proof известен для Слонима, Новогрудка, Щучина,
Островца, Ошмян, Сморгони, Постав, Глубокого и Лепеля. Старые starter/demo portfolio
records без подтверждённого provenance не считаются exact-local proof.

Рабочая, не вечная приоритизация:

1. Глубокое, Лида, Гродно;
2. Слоним, Новогрудок, Сморгонь, Лепель;
3. Поставы, Щучин, Островец, Ошмяны;
4. Витебск, Орша, Полоцк, Новополоцк, Волковыск.

Strong new-route candidates: Поставы, Щучин, Островец и Ошмяны. Это shortlist для
pilot approval, а не разрешение создавать routes.

Discovery-only candidates:

- Гродненская область: Мосты, Скидель, Берёзовка, Дятлово, Ивье, Зельва, Свислочь,
  Большая Берестовица, Вороново, Кореличи;
- Витебская область: Новолукомль, Городок, Барань, Толочин, Браслав, Миоры,
  Чашники, Сенно, Дубровно, Верхнедвинск, Докшицы, Бешенковичи, Шумилино, Лиозно,
  Шарковщина, Ушачи.

Эти списки — **HYPOTHESIS**, не automatic rollout и не правило «все города больше
5000 жителей».

## 9. Entity/schema: отдельный design-first этап

Текущую structured-data модель нужно отдельно проверить на смешение:

- одной реальной организации и адреса в Гомеле;
- nationwide service area;
- target locality и coordinates конкретной city page.

Целевая гипотеза: одна реальная organization/service-area business entity, честные
service areas и city pages как страницы зоны обслуживания, а не 40 физических филиалов.
Нельзя создавать fake offices, addresses или map pins.

Это не разрешение менять schema. `LOCAL-SEO-01B` сначала выполняет read-only audit и
design; implementation возможен только после отдельного owner approval. SearchAction
без реального поиска остаётся отдельным tracked issue.

## 10. Search-engine strategy and measurement

### 10.1 Постоянный принцип

- Google — текущий приоритет №1 для диагностики слабой видимости, индексации и
  дальнейшего роста.
- Yandex — обязательный параллельный SEO-контур, а не второстепенная задача. По уже
  собранным наблюдениям MasterZabor по некоторым локальным запросам показывает себя в
  Yandex лучше, поэтому улучшение Google не должно происходить ценой необоснованной
  потери Yandex visibility.
- Изменения metadata, schema, city architecture, internal linking и regional SEO
  оцениваются с точки зрения обоих поисковиков.
- Google measurement опирается прежде всего на GSC; Yandex measurement — прежде всего
  на Yandex Webmaster и документированные SERP observations.
- Google-specific structured-data feature не считается автоматически полезной для
  Yandex, и наоборот. Различия требований или наблюдаемого поведения поисковиков
  фиксируются отдельно.
- Measurement после Grodno/Vitebsk pilot обязательно включает Google и Yandex.

Это не создаёт новый Yandex implementation stage. Отдельный аудит настроек
региональности и данных Yandex Webmaster остаётся последующей задачей.

### 10.2 Measurement model

- Google: GSC impressions/clicks и page/query data — основной first-party signal.
- Yandex: Yandex Webmaster query/impression data предпочтительнее общих Metrika
  averages для оценки поисковой видимости.
- В Metrika присутствует owner/developer/automation noise; при низком реальном
  organic volume средние метрики сессий слабы как SEO-доказательство.
- Сравнивать pilot pages до/после только с достаточным временем переобхода и
  impressions; фиксировать изменения content, links, proof и metadata.
- `SEO-META-05` проверяет title/snippet rewrites, truncation и query alignment после
  переобхода. Search engines могут переписывать title и description.
- Отсутствие query row или малая выборка не превращается в вывод «спроса нет».

## 11. Reconciliation старых рекомендаций

| Рекомендация / состояние | Статус | Решение |
| --- | --- | --- |
| Canonical `www`, no-slash, current robots/sitemap topology | **STILL VALID** | Не менять без нового технического evidence. |
| Product JSON-LD image и canonical Offer URL | **DONE** | Закрыто `SEO-01`. |
| Semantic sitemap freshness | **DONE** | Закрыто `SEO-02`; даты только по реальным semantic changes. |
| Google discovery/indexability audit | **DONE** | Закрыто `SEO-03`; общего blocker не найдено. |
| Balanced city internal linking | **DONE** | Закрыто `SEO-04`; старый array-order defect устранён. |
| Approved metadata rollout | **DONE** | `SEO-META-01` — `04` закрыты; `05` — monitoring. |
| Старый `LOCAL-SEO-01 = FUTURE / NOT STARTED` | **SUPERSEDED** | Discovery/reconciliation substantially complete; работа разделена на `01A` — `01E`. |
| Physical `LocalBusiness` для каждого города | **RETIRED / NOT APPLICABLE FOR CURRENT BUSINESS FACTS** | У MasterZabor нет 40 подтверждённых физических офисов. Не возвращать эту модель без новых реальных филиалов. |
| Обязательные 300–500 уникальных слов на city page | **SUPERSEDED / UNSUPPORTED AS A REQUIREMENT** | Подтверждённого обязательного порога нет; сначала usefulness и proof. |
| Массовый rollout десятков geo pages | **RETIRED FOR CURRENT STRATEGY** | Текущая стратегия допускает только небольшой измеряемый pilot после design approval. |
| Обязательный отдельный price/FAQ block только ради SEO | **SUPERSEDED / NOT REQUIRED** | Текущие страницы уже покрывают intent; новый блок требует самостоятельной пользовательской функции. |
| Shared CityPage/content model refinements | **FUTURE** | После entity/schema design и отдельного approval. |
| SearchAction без поиска | **FUTURE** | Отдельная schema issue, не объяснение текущей indexation. |
| Provenance starter/demo portfolio records | **FUTURE** | Отдельная content/proof задача. |
| Google Business Profile/entity strategy | **FUTURE** | Нужны доступ и business decision. |
| Отдельный телефон MasterZabor | **OPEN QUESTION** | Нужна бизнес-информация; не придумывать. |
| Yandex Webmaster API/data workflow | **FUTURE** | Подключать только для измеримой задачи. |
| QZ-09 public advertising prices | **FUTURE / DEFERRED** | Не смешивать с Local SEO. |

## 12. Этапы и зависимости

### `LOCAL-SEO-01A` — discovery reconciliation

Статус: **DONE / SUBSTANTIALLY COMPLETE**.

Включает GSC evidence, Yandex/SERP observations, competitor review, приоритизацию
городов, proof inventory, CityPage gap analysis и rollout principles. Новые данные могут
уточнять shortlist, но не требуют повторять весь discovery с нуля.

### `LOCAL-SEO-01B` — entity/schema design

Статус: **NEXT / DESIGN FIRST**.

Read-only audit фактического JSON-LD и design целевой entity/service-area модели.
Результат: точная карта текущих конфликтов, approved target model, affected surfaces,
migration/QA plan и список данных, которых не хватает. Никакого implementation до
отдельного approval.

### `LOCAL-SEO-01C` — shared CityPage/content-model refinement

Статус: **AFTER 01B**.

Спроектировать минимальные shared fields/sections для useful local differentiation,
service areas и proof. Сохранить один `CityPage`; не писать 40 отдельных текстов и не
добавлять блоки без функции.

### `LOCAL-SEO-01D` — regional pilot

Статус: **AFTER DESIGN APPROVAL**.

Ориентир: 3–5 existing routes и 3–5 новых exact-proof opportunities в Гродненской и
Витебской областях. Финальный набор утверждается по свежим данным и доступному proof.
Pilot не означает автоматическое создание всех discovery candidates.

### `LOCAL-SEO-01E` — measurement and rollout decision

Статус: **AFTER PILOT / RECRAWL**.

Сопоставить GSC, Yandex Webmaster и документированные SERP observations. Решить, что
сработало, что надо изменить и разрешён ли следующий регион. Minsk -> Gomel -> Brest ->
Mogilev остаётся рабочим порядком, а не жёстким календарём.

## 13. Non-negotiables

- никаких fake offices, addresses, map pins, reviews или local projects;
- никакого массового AI rewrite всех 40 city pages;
- никаких batch на 30–50 geo pages до pilot evidence;
- никаких bulk spam links;
- никаких случайных domain/canonical changes;
- никакого city × material URL explosion;
- никакой «идеальной» сложной архитектуры без доказанной пользы;
- schema, CityPage, content, routes и sitemap меняются только в отдельно утверждённых
  implementation stages.

Купленные/арендованные ссылки, PBN и expired-domain links, behavioral/click
manipulation, fake reviews/locations и parasite/site-reputation tactics не входят в
текущий approved implementation. Их возможный анализ требует отдельного evidence/risk
stage: наблюдаемую корреляцию нельзя выдавать за доказанную ranking cause, необходимо
оценивать риск санкций и нестабильности, а high-risk tactics нельзя применять к
основному бренду без отдельного owner decision. Fake offices, map pins, reviews,
locations и projects остаются текущим no-go.

## 14. Что требует дополнительных данных

- **OPEN QUESTION:** свежая дата и полный период page/query exports GSC.
- **OPEN QUESTION:** доступный Yandex Webmaster export/API baseline по тем же routes.
- **OPEN QUESTION:** подтверждённая service/logistics feasibility для каждого нового
  кандидата.
- **OPEN QUESTION:** полный provenance старых starter/demo portfolio records.
- **OPEN QUESTION:** фактическая Google Business Profile/entity configuration и права
  доступа.
- **OPEN QUESTION:** нужен ли отдельный business phone для MasterZabor.

Минимальный следующий источник для `LOCAL-SEO-01B` — repository/Production JSON-LD и
подтверждённые business facts. Массовый внешний research для этого не нужен. Свежие
GSC/Yandex exports становятся обязательными перед финальным pilot selection и при
`LOCAL-SEO-01E`, но не блокируют design-first schema audit.
