# QuizForm interaction pattern

Этот документ фиксирует утверждённую interaction architecture shared `QuizForm`. Используйте её как reference implementation для новых многошаговых форм MasterZabor и для изменений существующего квиза.

## Область применения

Pattern обязателен для multi-step форм, где пользователь последовательно отвечает на несколько вопросов и завершает flow отдельным финальным действием.

Не применяйте его автоматически к простым одностраничным `LeadForm` и contact forms. Для них не нужны стабильная многошаговая shell, transition anchor и quiz task mode без отдельной UX-причины.

## Стабильная shell и navigation geometry

Все шаги `QuizForm` используют общую shell и предсказуемую navigation zone.

- Steps 1–6 сохраняют одинаковый preferred navigation baseline
- В normal state кнопка **Получить расчёт** на Step 7 находится на том же preferred baseline, что кнопка **Далее** на Steps 1–6
- Step 7 не имеет жёсткой fixed height
- Validation messages, service errors, увеличенный размер текста и дополнительный content могут естественно увеличить Step 7 вниз

Ключевой принцип:

`same preferred baseline, flexible height when required`

Не уменьшайте утверждённый content или visual assets только ради размещения всего шага в одном viewport. Длинный шаг может требовать естественного вертикального scroll.

## Переход между шагами

При смене шага `QuizForm` выполняет следующие действия:

1. Переводит focus на heading нового шага
2. Использует `focus({ preventScroll: true })`, чтобы focus не создавал отдельный непредсказуемый scroll
3. Проверяет положение progress и heading относительно текущего viewport
4. Не выполняет scroll, если progress и heading уже находятся в допустимой верхней safe-zone
5. Возвращает viewport к dedicated transition anchor, если начало нового шага находится вне нормальной viewport-зоны

Не используйте безусловный `form.scrollIntoView()` после каждого перехода. Не добавляйте отдельные scroll offsets для homepage, CityPage, ServicePage, `/tseny`, `/kontakty` или blog.

Естественный вертикальный scroll внутри длинного шага допустим.

## Mobile task mode

Когда `QuizForm` находится в активной области viewport, он становится primary conversion task.

- Global mobile `FloatingButtons` скрываются
- Скрытые controls исключаются из focus и tab order через `inert` и согласованные accessibility semantics
- `FloatingButtons` возвращаются после выхода выше или ниже активной области формы
- Fixed global UI не перекрывает navigation zone квиза
- Shared marker `data-quiz-form` связывает любой callsite с общей task-mode логикой без page-specific state

Hide/show transition должен учитывать `prefers-reduced-motion` и не должен изменять analytics-контракт `TrackedContactLink`.

## Submit semantics

Multi-step submit flow соблюдает следующие правила:

- Steps 1–6 никогда не вызывают lead submit
- `/api/lead` вызывается только после финального действия **Получить расчёт** на Step 7
- Field validation errors и service/delivery errors остаются разными состояниями
- Service error не отображается до реальной финальной submit attempt
- При уходе назад с финального шага stale service error сбрасывается
- Новый fresh contact step не наследует stale submit или error state

Успешный ответ `/api/lead` означает, что API принял и сохранил заявку. Не описывайте этот success как гарантированную доставку в Telegram: API возвращает отдельный `deliveryStatus`, включая `telegram_failed`.

## Responsive breakpoint policy

Используйте единый breakpoint contract:

| Диапазон | Transition policy |
| --- | --- |
| Mobile `<768px` | Conditional mobile policy с фактическим измерением safe-zone и `0` scroll margin у transition anchor |
| Tablet `768–1023px` | Сохраняется tablet scroll offset `80px` через `md:scroll-mt-20` |
| Large `>=1024px` | Сохраняется desktop scroll offset `96px` через `lg:scroll-mt-24` |

Не вводите magic offsets для отдельных шагов или страниц. Отдельный offset допустим только как осознанное изменение общего breakpoint contract.

## Verification standard

Каждое изменение `QuizForm` требует проверки interaction flow, а не только статичного render.

Обязательные среды и сценарии:

- Реальное mobile device
- Production-mode runtime через `next build` и `next start`, а не только `next dev`
- Forward flow по всем шагам
- Back, затем повторный forward flow
- Mobile keyboard на шагах с полями
- Изменение viewport и browser chrome
- Hide и restore global `FloatingButtons`
- Отсутствие overlap с navigation zone
- Focus на heading нового шага
- Отсутствие horizontal overflow

Representative surfaces:

- `/`
- `/tseny`
- Representative ServicePage
- Representative CityPage
- `/kontakty`
- Representative blog page с shared `QuizForm`

Не отправляйте реальную lead-заявку во время visual или interaction regression check без отдельного разрешения.

## Правило повторного использования

Новая multi-step форма сначала должна переиспользовать этот interaction pattern: stable shell, transition policy, focus behavior, task mode и verification standard.

Если новый flow требует отклонения, зафиксируйте причину отдельно. Не создавайте page-specific workaround как неявное исключение из общего поведения.
