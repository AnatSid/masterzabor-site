# QuizForm Visual Assets

## Purpose

This document is the source of truth for approved visual assets used by the
shared `QuizForm`. It records the production files, their visual and semantic
invariants, and their integration rules. Artistic changes, regeneration, or a
change of visual direction require separate owner approval.

## Visual system categories

### Object / option illustrations

Used for the three fence types, swing gates, sliding gates, and wicket. These
assets use a predominantly square composition and must remain readable near
`120×120 px`.

### Measurement diagrams

Used for fence length and height. Their visual language is shared with the
object illustrations, but their aspect ratios follow the measurement being
explained and do not need to be square.

### Payment support assets

Used inside the three payment option cards: own funds, installment/credit, and
undecided. They are decorative support for the option label, not independent
controls, and must have equal visual weight near `64–90 px`.

## Global visual invariants

- Graphite object/construction language.
- Very light rounded plate with a subtle cool-green tint.
- Moderate 2.5D volume and a soft shadow.
- No text, numeric figures, currency symbols, or brand marks inside assets.
- No irrelevant environment, people, houses, grass, or decorative scenery.
- Comparable visual mass within each option group.
- Visual language is unified; aspect ratio does not have to be identical.
- Measurement lines use a calm amber-orange accent.

## Registry

| Asset | Status | Source/master | Production path | Usage |
| --- | --- | --- | --- | --- |
| Профнастил | Approved / implemented | not recorded | `/public/icons/quiz/quiz-fence-profnastil.webp` | Step 1 |
| Евроштакетник | Approved / implemented | not recorded | `/public/icons/quiz/quiz-fence-evroshtaketnik.webp` | Step 1 |
| Сетка-рабица | Approved / implemented | not recorded | `/public/icons/quiz/quiz-fence-rabitsa.webp` | Step 1 |
| Распашные ворота | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\ворота-калитки\1.-Ворота распашные.png` | `/public/icons/quiz/quiz-gate-swing.webp` | Step 4 |
| Откатные ворота | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\ворота-калитки\2.-Ворота откатные.png` | `/public/icons/quiz/quiz-gate-sliding.webp` | Step 4 |
| Нейтральный вариант «не нужен» | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\ворота-калитки\3. Кнопка минус - для Не нужны.png` | `/public/icons/quiz/quiz-option-none.webp` | Step 4 `Не нужны`; Step 5 `Нет, не нужна` |
| Калитка | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\калитка\1.калитка.png` | `/public/icons/quiz/quiz-gate-wicket.webp` | Step 5 |
| Длина | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\длина забора\1.длина забора для квиза-графит-штакетник.png` | `/public/icons/quiz/quiz-measure-length.webp` | Step 2 |
| Высота | Approved v2 / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\высота забора\v2 - аысота забора для квиза длинная.png` | `/public/icons/quiz/quiz-measure-height.webp` | Step 3 |
| Собственные средства | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\способы оплаты\1.Собственные средства- иконка кошелька.png` | `/public/icons/quiz/quiz-payment-own-funds.webp` | Step 6 |
| Рассрочка или кредит | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\способы оплаты\2.Рассрочка или кредит - карта и календарь.png` | `/public/icons/quiz/quiz-payment-installment-credit.webp` | Step 6 |
| Пока не решил | Approved / implemented | `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\способы оплаты\3. Не решил - вопросик.png` | `/public/icons/quiz/quiz-payment-undecided.webp` | Step 6 |

## File facts

| Production file | Format | Dimensions | Size |
| --- | --- | ---: | ---: |
| `quiz-fence-profnastil.webp` | WebP with alpha | 512×512 | 5,502 B |
| `quiz-fence-evroshtaketnik.webp` | WebP with alpha | 512×512 | 7,682 B |
| `quiz-fence-rabitsa.webp` | WebP with alpha | 512×512 | 19,724 B |
| `quiz-gate-swing.webp` | WebP with alpha | 512×512 | 17,788 B |
| `quiz-gate-sliding.webp` | WebP with alpha | 512×512 | 17,288 B |
| `quiz-option-none.webp` | WebP with alpha | 512×512 | 8,498 B |
| `quiz-gate-wicket.webp` | WebP with alpha | 512×512 | 17,218 B |
| `quiz-measure-length.webp` | WebP | 1200×400 | 13,182 B |
| `quiz-measure-height.webp` | WebP | 1200×400 | 13,026 B |
| `quiz-payment-own-funds.webp` | WebP | 512×512 | 4,836 B |
| `quiz-payment-installment-credit.webp` | WebP | 512×512 | 5,758 B |
| `quiz-payment-undecided.webp` | WebP | 512×512 | 4,856 B |

## Per-asset specification

### Fence types

- Meaning: the three material choices in Step 1.
- Approved features: graphite fence object, square light plate, readable material
  differences.
- Do not change: material identity, approved composition, or visual language.
- Source/master: not recorded for the implemented QZ-04A production copies.

### Swing gates

- Meaning: two-leaf swing gate choice.
- Approved features: two clearly open leaves, simple capped posts, graphite metal.
- Do not change: opening must remain obvious without UI arrows; do not turn it
  into a closed or sliding construction.

### Sliding gates

- Meaning: side-moving gate choice.
- Approved features: one graphite panel, visible lower rail and rollers.
- Do not change: retain the rail/roller construction; do not turn it into a
  two-leaf gate.

### Neutral none option

- Meaning: a calm absence-of-an-additional-element choice shared by Step 4
  `Не нужны` and Step 5 `Нет, не нужна`.
- Approved features: one graphite 2.5D neutral badge with a short horizontal
  minus on the approved light green rounded plate.
- Source/master: the approved Step 4 source and
  `C:\DiscD\проекты сайта\Фото типов забора\Референсы для квиза-иконка\калитка\3. Кнопка минус - для Нет, не нужна.png`
  are byte-identical copies of the same master.
- Production rule: keep exactly one shared runtime file,
  `quiz-option-none.webp`; do not create gate- or wicket-specific duplicates.
- Do not change: keep the neutral graphite treatment, short minus, rounded
  plate, shadows, proportions, and composition. Do not introduce red,
  warning, stop, product, or third-gate semantics.

### Wicket

- Meaning: a separate pedestrian wicket.
- Approved features: one slightly open leaf, visible frame, handle and lock.
- Do not change: keep one leaf and the recognizable pedestrian-scale hardware.
- Production preparation removes only the edge-connected outer white field;
  preserve the complete rounded plate, artwork, hardware, shadows, proportions,
  and composition.

### Length diagram

- Meaning: approximate full fence length.
- Approved features: wide horizontal composition; amber dimension line spans
  the complete external width from the left post edge to the right post edge.
- Do not change: do not make it square, shorten the dimension to the inner post
  spacing, or add labels/digits inside the image.

### Height diagram

- Meaning: approximate fence height.
- Approved features: graphite fence in light perspective, neutral human scale
  reference, amber vertical line measuring the fence from ground to its top.
- Do not change: the person is not the measured object and is not a precise
  engineering scale. The static asset does not change with the selected height.
  The approximate `около 175 см` context stays in UI text outside the image.
- The approved wide v2 master supersedes the previous Step 3 asset. The stable
  production filename remains `quiz-measure-height.webp`; do not retain the old
  version as a separate runtime asset.
- Production preparation is a proportional `2172×724` to `1200×400` WebP resize
  without composition crop. Preserve the complete rounded plate, person,
  measurement arrow, fence, shadows, composition, and aspect ratio.

### Own funds

- Meaning: payment from the customer's own funds.
- Approved features: graphite wallet with moderate volume and soft shadow.
- Do not change: no card, banknotes, cash bundles, or currency symbols.

### Installment or credit

- Meaning: payment distributed over time.
- Approved features: graphite calendar and bank card as one balanced visual.
- Do not change: the calendar is mandatory; no bank names, logos, currencies, or
  promotional colors.

### Undecided

- Meaning: the customer has not selected a payment approach yet.
- Approved features: neutral graphite cards/documents and a calm question mark.
- Do not change: the question mark must not look like an error, warning, refusal,
  or negative red state.

## Integration rules

- Runtime uses repository assets only; local master files are never referenced by
  the website.
- Preserve aspect ratio. Do not crop, stretch, or use `object-cover` where it can
  remove semantic parts of an illustration.
- Object/payment assets may use a transparent outer canvas so the approved light
  rounded plate sits naturally on the card state. Do not remove or recolor the
  plate itself, artwork, or shadows.
- Visual sizing uses reusable roles rather than per-card dimensions. Standard
  object illustrations use the shared object slot; compositions with more
  internal whitespace may use the shared expanded-object scale without changing
  that slot or the card geometry. Neutral `none/no-extra` support art uses the
  same object slot with a smaller inner visual, while payment assets keep their
  separate micro-asset role. Measurement diagrams retain independent geometry.
- Illustrations are decorative support for existing labels and use empty alt text
  or equivalent assistive-technology hiding.
- The complete option card remains the click/focus/selected target.
- Verify the actual shared `QuizForm` on desktop, tablet, and mobile, including
  normal, hover, selected, keyboard, and focus-visible states.
- Do not alter functional values, validation, defaults, API payloads, analytics,
  or lead behavior for visual integration.
- Do not regenerate or artistically modify approved assets without separate
  approval.
