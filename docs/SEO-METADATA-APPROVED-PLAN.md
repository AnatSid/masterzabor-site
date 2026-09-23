# MasterZabor — SEO metadata: approved decisions and rollout plan

Status: **DECISION LOG / NOT YET IMPLEMENTED**  
Date: 2026-09-22

## A. Approved metadata

### 1. Homepage `/`

**Title**  
`Установка заборов в Беларуси под ключ — профнастил, штакетник, сетка-рабица`

**Meta description**  
`Устанавливаем заборы по всей Беларуси: профнастил, евроштакетник и сетка-рабица. Бесплатный расчёт, доставка и монтаж под ключ. Гарантия, рассрочка и оплата частями.`

Notes:
- no `| МастерЗабор` suffix;
- current H1 can remain `Установка заборов в Беларуси под ключ`.

---

### 2. City pages `/[city]`

Working example: `/lida`

**Title formula**  
`Установка заборов в <городе> под ключ - профнастил, штакетник, рабица`

**Lida example**  
`Установка заборов в Лиде под ключ - профнастил, штакетник, рабица`

**Meta description formula**  
`Устанавливаем заборы в <городе> и <районе>: профнастил, евроштакетник и сетка-рабица. Бесплатный расчёт стоимости, доставка и монтаж под ключ. Гарантия, рассрочка и удобная оплата частями.`

**Lida example**  
`Устанавливаем заборы в Лиде и Лидском районе: профнастил, евроштакетник и сетка-рабица. Бесплатный расчёт стоимости, доставка и монтаж под ключ. Гарантия, рассрочка и удобная оплата частями.`

Notes:
- no `| МастерЗабор`;
- current city H1 pattern remains `Установка заборов в <городе> под ключ`;
- use one unified search/service-area description pattern with `в <городе> и <... районе>`;
- do not introduce a mandatory `districtPrepositional` field or fallback only for administrative precision;
- OWNER DECISION: one consistent search/service-area wording is more important at this stage than administrative exceptions;
- do not separately "fix" Новополоцк and similar cases in SEO-META-02.

---

### 3. `/zabory-iz-profnastila`

**Title**  
`Заборы из профнастила и металлопрофиля с установкой под ключ - цены по Беларуси`

**Meta description**  
`Заборы из профнастила и металлопрофиля по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Цвета по RAL, гарантия и рассрочка.`

---

### 4. `/zabory-iz-evroshtaketnika`

**Title**  
`Заборы из евроштакетника и металлоштакетника с установкой под ключ - цены по Беларуси`

**Meta description**  
`Заборы из евроштакетника по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Односторонняя и шахматная зашивка, выбор цветов, гарантия и рассрочка.`

---

### 5. `/zabory-iz-setki-rabitsy`

**Title**  
`Заборы из сетки-рабицы с установкой под ключ - цены по Беларуси`

**Meta description**  
`Заборы из сетки-рабицы по всей Беларуси. Бесплатный расчёт, доставка и установка под ключ. Практичное решение для дачи, участка и большого периметра. Гарантия и рассрочка.`

---

### 6. `/vorota-raspashnye`

**Title**  
`Распашные ворота с установкой под ключ - цены по Беларуси`

**Meta description**  
`Распашные ворота по всей Беларуси. Бесплатный расчёт, изготовление, доставка и установка под ключ. Подбор размеров и заполнения под забор. Гарантия и рассрочка.`

---

### 7. `/vorota-otkatnye`

**Title**  
`Откатные ворота с установкой под ключ - цены по Беларуси`

**Meta description**  
`Откатные ворота по всей Беларуси. Бесплатный расчёт, изготовление, доставка и установка под ключ. Надёжная фурнитура, подготовка под автоматику, гарантия и рассрочка.`

---

### 8. `/kalitki`

**Title**  
`Калитки для забора с установкой под ключ - цены по Беларуси`

**Meta description**  
`Калитки для забора по всей Беларуси. Бесплатный расчёт, изготовление под размер, доставка и установка под ключ. Подбор заполнения, замка и фурнитуры. Гарантия и рассрочка.`

---

### 9. `/tseny`

**Title**  
`Цены на заборы в Беларуси - стоимость установки под ключ`

**Meta description**  
`Цены на заборы, ворота и калитки по Беларуси. Профнастил, евроштакетник и сетка-рабица. Бесплатный расчёт стоимости с учётом длины, высоты, участка и комплектации.`

---

### 10. `/kontakty`

**Title**  
`Контакты МастерЗабор - телефон, мессенджеры и реквизиты`

**Meta description**  
`Контакты МастерЗабор: телефон, Telegram, WhatsApp и Viber, режим работы и реквизиты. Свяжитесь с нами для бесплатного расчёта стоимости забора по Беларуси.`

**H1**  
`Контакты МастерЗабор`

Notes:
- remove `— Гомель` from H1/title;
- real Gomel office/address may remain in the actual contact details.

---

### 11. `/nashi-raboty`

**Title**  
`Наши работы - фото установленных заборов по Беларуси`

**Meta description**  
`Фото установленных заборов, ворот и калиток по Беларуси. Профнастил, евроштакетник, сетка-рабица и готовые решения для частных участков.`

Notes:
- avoid the categorical word `реальные` until old starter/demo record provenance is checked;
- provenance review is a later portfolio/content task, not part of SEO-META-02.

---

### 12. `/blog`

**Title**  
`Блог о заборах в Беларуси - цены, выбор, нормы и правила установки`

**Meta description**  
`Практические статьи о заборах в Беларуси: цены, выбор материалов, установка, разрешения и нормы. Советы по профнастилу, евроштакетнику и сетке-рабице.`

---

## B. Permission article — approved / final

Route: `/blog/nuzhno-li-razreshenie-na-ustanovku-zabora-v-rb`

This article already has meaningful first-party search visibility, so changes should be conservative.

### Final title
`Нужно ли разрешение на забор в Беларуси: что проверить по нормам и документам`

Why:
- preserves the primary permission intent;
- keeps the already visible `Нужно ли разрешение на забор в Беларуси` query shape;
- adds `нормам` and `документам` without making the title broader than the article;
- avoids stuffing `Беларусь` and `РБ` together in one title.

### Recommended meta description
`Нужно ли разрешение на установку забора в Беларуси, требуется ли регистрация или проект. Какие документы проверить, куда обращаться и что учесть перед монтажом.`

Keep this description if it remains supported by the visible article content during implementation review.

### Query variant «в РБ»
Do not add `Беларуси / РБ` to the title.

Use the exact wording naturally in visible content, preferably near the top or in an FAQ/H2/H3:
`Нужно ли разрешение на установку забора в РБ?`

The existing URL slug already contains `v-rb`.

### Supporting visible subtopics
Keep/strengthen concise sections for:
- разрешение;
- проект;
- регистрация / узаконивание;
- документы;
- куда обращаться;
- исполком / архитектура;
- замена старого забора;
- pre-installation checklist.

Status: APPROVED / NOT YET IMPLEMENTED.

## C. Metadata implementation stages

### SEO-META-01 — final decision pass
Before coding:
- permission article metadata is approved/final and is no longer an open task;
- review remaining individual blog-article metadata only if needed;
- confirm that approved wording is still exactly what the owner wants.

### SEO-META-02 — implementation
Codex changes metadata only:
- homepage;
- city metadata formula;
- 6 service pages;
- prices;
- contacts;
- portfolio;
- blog index;
- approved article metadata.

Mandatory global Gomel cleanup in this stage:
- `app/layout.tsx` old Gomel fallback title/description;
- root `geo.placename: Гомель, Беларусь`;
- `lib/seo.ts` default keywords containing `Гомель`.

Do not touch schema/LocalBusiness in this metadata stage. Schema remains a separate future stage.

Avoid unrelated visual/schema/content refactors in the same change.

### SEO-META-03 — pre-production QA
For every changed route:
- build/lint;
- inspect rendered `<title>` and `meta name="description"`;
- confirm canonical remains correct;
- check no stale Gomel-only wording remains on nationwide routes;
- check `app/layout.tsx` and `lib/seo.ts` no longer leak Gomel wording into nationwide metadata;
- check city grammar;
- verify H1 changes only where explicitly approved;
- preview title/description on desktop and mobile widths;
- do not optimize against a rigid character limit alone.

### SEO-META-04 — production QA
After deployment:
- smoke changed URLs;
- verify live HTML metadata;
- verify no visual regressions;
- verify browser-tab titles;
- verify canonical URLs;
- check for stale Gomel wording;
- check city grammar in generated descriptions;
- confirm analytics/canonical/schema were not accidentally changed.

Post-deploy QA checklist:
- rendered `<title>` and meta description;
- browser-tab title;
- canonical;
- stale Gomel wording;
- city grammar;
- desktop/mobile Google snippets;
- desktop/mobile Yandex snippets;
- title rewrites;
- truncation.

### SEO-META-05 — SERP follow-up
After search engines recrawl and enough impressions accumulate:
- compare Google Search Console;
- compare Yandex Webmaster;
- inspect real Google/Yandex snippets;
- note truncation and search-engine rewrites;
- specifically check desktop/mobile Google and Yandex snippets for the two synonym-heavy service titles;
- refine only where real SERP output or query data justifies it.

Search engines may rewrite both titles and snippets. Real rendered SERP output is the final QA target, not only source-code character counts.

---

## D. Related CityPage items — separate from metadata implementation

These are **not part of SEO-META-02 unless separately approved**:

- possible localized H2: `Типы заборов в <городе>`;
- possible localized H2: `Ворота и калитки в <городе>`;
- optional service-area text such as `Работаем в Лиде и Лидском районе...`;
- hub-city + nearby-settlement strategy;
- city structured-data/schema correction;
- removal of contradictory per-city physical `LocalBusiness` modeling.

Keep these in separate scoped stages so metadata work stays safe and easy to review.

## Mandatory post-deploy SERP QA note for synonym-heavy service titles

For these two service pages, keep both synonym pairs in the initial implementation:

- `/zabory-iz-profnastila`:
  `Заборы из профнастила и металлопрофиля с установкой под ключ - цены по Беларуси`
- `/zabory-iz-evroshtaketnika`:
  `Заборы из евроштакетника и металлоштакетника с установкой под ключ - цены по Беларуси`

Decision:
- do not shorten them preemptively;
- after deployment, check actual Google/Yandex desktop and mobile snippets plus browser-tab rendering;
- verify whether the commercial tail (`с установкой под ключ - цены по Беларуси`) is visibly truncated or rewritten;
- if truncation harms clarity, shorten later based on real SERP output rather than theory;
- keep the secondary synonyms in visible page copy regardless.

Status: OWNER DECISION / initial implementation should keep the longer titles.
