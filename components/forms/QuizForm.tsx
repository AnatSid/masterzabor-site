"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BelarusPhoneField } from "@/components/forms/BelarusPhoneField";
import {
  PAYMENT_METHODS,
  QUIZ_STEPS,
  QUIZ_TOTAL_STEPS,
  type PaymentMethod,
} from "@/components/forms/quiz-form-config";
import { trackQuizFunnel } from "@/lib/client-analytics";
import type { QuizFunnelEventType } from "@/lib/conversion-events";
import { isValidBelarusPhone, normalizeBelarusPhone } from "@/lib/phone";

type QuizFormValues = {
  fenceType: string;
  length: string;
  height: string;
  gateType: string;
  wicket: string;
  paymentMethod: PaymentMethod | "";
  name: string;
  phone: string;
  city?: string;
  comment?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";
type VisualOptionAssetScale = "default" | "expanded";
type VisualOptionAssetSize = "object" | "neutral" | "payment";

const fenceTypes = ["Профнастил", "Евроштакетник", "Сетка-рабица"] as const;
const heights = ["1.5 м", "1.7 м", "2.0 м"] as const;
const gateTypes = ["Распашные", "Откатные", "Не нужны"] as const;
const wicketTypes = ["Да, нужна", "Нет, не нужна"] as const;
const fenceTypeImages: Record<(typeof fenceTypes)[number], string> = {
  "Профнастил": "/icons/quiz/quiz-fence-profnastil.webp",
  "Евроштакетник": "/icons/quiz/quiz-fence-evroshtaketnik.webp",
  "Сетка-рабица": "/icons/quiz/quiz-fence-rabitsa.webp",
};
const gateTypeImages: Record<(typeof gateTypes)[number], string> = {
  "Распашные": "/icons/quiz/quiz-gate-swing.webp",
  "Откатные": "/icons/quiz/quiz-gate-sliding.webp",
  "Не нужны": "/icons/quiz/quiz-option-none.webp",
};
const wicketTypeImages: Record<(typeof wicketTypes)[number], string> = {
  "Да, нужна": "/icons/quiz/quiz-gate-wicket.webp",
  "Нет, не нужна": "/icons/quiz/quiz-option-none.webp",
};
const paymentMethodImages: Record<PaymentMethod, string> = {
  "Собственные средства": "/icons/quiz/quiz-payment-own-funds.webp",
  "Рассрочка или кредит":
    "/icons/quiz/quiz-payment-installment-credit.webp",
  "Пока не решил": "/icons/quiz/quiz-payment-undecided.webp",
};
const STEP_FOCUS_DELAY_MS = 50;
const optionFocusClass =
  "touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 motion-reduce:transition-none";
const visualObjectAssetSlotClass =
  "flex h-[146px] w-[146px] shrink-0 items-center justify-center max-[340px]:h-[132px] max-[340px]:w-[132px] sm:mb-3 sm:h-[184px] sm:w-full";
const visualOptionAssetSizeClasses: Record<VisualOptionAssetSize, string> = {
  object: visualObjectAssetSlotClass,
  neutral: visualObjectAssetSlotClass,
  payment:
    "flex h-[92px] w-[92px] shrink-0 items-center justify-center max-[340px]:h-[84px] max-[340px]:w-[84px] sm:mb-3 sm:h-32 sm:w-full",
};
const visualOptionAssetImageClasses: Record<VisualOptionAssetSize, string> = {
  object: "h-full w-auto max-w-full",
  neutral:
    "h-28 w-28 max-[340px]:h-[104px] max-[340px]:w-[104px] sm:h-[152px] sm:w-[152px]",
  payment: "h-full w-auto max-w-full",
};
const visualOptionAssetScaleClasses: Record<VisualOptionAssetScale, string> = {
  default: "",
  expanded: "sm:h-[200px] sm:w-[200px] sm:max-w-none",
};
const visualObjectOptionCardClass =
  "flex items-center gap-3 rounded-xl border px-3 py-1 text-left font-semibold transition-colors sm:block sm:px-3 sm:py-4";
const visualOptionNormalClass =
  "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20] hover:bg-green-50/40";
const visualOptionSelectedClass =
  "border-[#1B5E20] bg-green-50 text-[#1B5E20] shadow-[0_0_0_1px_rgba(27,94,32,0.20),0_6px_16px_rgba(27,94,32,0.12)]";

function getVisualOptionCardStateClass(isSelected: boolean) {
  return isSelected ? visualOptionSelectedClass : visualOptionNormalClass;
}

function VisualOptionAsset({
  scale = "default",
  size,
  src,
}: {
  scale?: VisualOptionAssetScale;
  size: VisualOptionAssetSize;
  src: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={visualOptionAssetSizeClasses[size]}
    >
      <Image
        alt=""
        className={`object-contain ${visualOptionAssetImageClasses[size]} ${visualOptionAssetScaleClasses[scale]}`}
        height={512}
        src={src}
        unoptimized
        width={512}
      />
    </span>
  );
}

function FenceOptionPreview({
  label,
}: {
  label: (typeof fenceTypes)[number];
}) {
  return <VisualOptionAsset size="object" src={fenceTypeImages[label]} />;
}

function LengthScheme() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-4 w-full max-w-[42rem]"
    >
      <Image
        alt=""
        className="h-auto w-full object-contain"
        height={400}
        src="/icons/quiz/quiz-measure-length.webp"
        unoptimized
        width={1200}
      />
    </div>
  );
}

function HeightScheme() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-1.5 w-full max-[340px]:mt-1 sm:mt-1 sm:max-w-[37.5rem]"
    >
      <Image
        alt=""
        className="h-auto w-full object-contain"
        height={400}
        src="/icons/quiz/quiz-measure-height.webp"
        unoptimized
        width={1200}
      />
    </div>
  );
}

function PaymentOptionPreview({ method }: { method: PaymentMethod }) {
  return (
    <VisualOptionAsset size="payment" src={paymentMethodImages[method]} />
  );
}

type QuizFormProps = {
  cityName?: string;
  source?: string;
  defaultFenceType?: string;
  defaultGateType?: string;
  defaultWicketType?: string;
  defaultStep?: number;
  presentation?: "default" | "compact";
};

function sanitizeDefaultStep(step?: number) {
  if (!step) {
    return 1;
  }

  return Math.min(QUIZ_TOTAL_STEPS, Math.max(1, Math.trunc(step)));
}

export function QuizForm({
  cityName,
  source = "home-quiz",
  defaultFenceType,
  defaultGateType,
  defaultWicketType,
  defaultStep,
  presentation = "default",
}: QuizFormProps) {
  const isCompact = presentation === "compact";
  const initialFenceType = fenceTypes.includes(defaultFenceType as (typeof fenceTypes)[number])
    ? defaultFenceType
    : "Профнастил";
  const initialGateType = gateTypes.includes(defaultGateType as (typeof gateTypes)[number])
    ? defaultGateType
    : "Не нужны";
  const initialWicketType = wicketTypes.includes(defaultWicketType as (typeof wicketTypes)[number])
    ? defaultWicketType
    : "Нет, не нужна";
  const initialStep = sanitizeDefaultStep(defaultStep);
  const trackedQuizEvents = useRef(new Set<string>());
  const formRef = useRef<HTMLFormElement>(null);
  const stepHeadingRef = useRef<HTMLElement>(null);
  const previousStepRef = useRef(initialStep);
  const initialResetValues = useMemo(
    () => ({
      fenceType: initialFenceType,
      height: "1.7 м",
      gateType: initialGateType,
      wicket: initialWicketType,
      paymentMethod: "" as const,
      length: "",
      name: "",
      phone: "",
      city: cityName ?? "",
      comment: "",
    }),
    [cityName, initialFenceType, initialGateType, initialWicketType],
  );

  const [step, setStep] = useState(initialStep);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fenceType: initialFenceType,
      height: "1.7 м",
      gateType: initialGateType,
      wicket: initialWicketType,
      paymentMethod: "",
      city: cityName ?? "",
    },
  });

  useEffect(() => {
    if (cityName) {
      setValue("city", cityName);
    }
  }, [cityName, setValue]);

  useEffect(() => {
    setStatus("idle");
    setStep(initialStep);
    reset(initialResetValues);
    trackedQuizEvents.current.clear();
  }, [initialResetValues, initialStep, reset, source]);

  const values = watch();
  const progress = (step / QUIZ_TOTAL_STEPS) * 100;
  const currentStep = QUIZ_STEPS[step - 1];
  const isContactStep = currentStep.id === "contact";

  useEffect(() => {
    if (previousStepRef.current === step) {
      return;
    }

    previousStepRef.current = step;

    if (status === "success") {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      stepHeadingRef.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ block: "start" });
    }, STEP_FOCUS_DELAY_MS);

    return () => window.clearTimeout(focusTimer);
  }, [status, step]);

  const trackQuizEventOnce = (type: QuizFunnelEventType) => {
    if (trackedQuizEvents.current.has(type)) {
      return;
    }

    trackedQuizEvents.current.add(type);
    trackQuizFunnel(type, {
      location: "quiz",
      source,
      pagePath: undefined,
    });
  };

  const nextStep = async () => {
    trackQuizEventOnce("quiz_started");

    const fields = [...currentStep.fields] as (keyof QuizFormValues)[];
    const isValid = await trigger(fields);

    if (isValid) {
      const next = Math.min(step + 1, QUIZ_TOTAL_STEPS);
      const nextStepId = QUIZ_STEPS[next - 1]?.id;

      if (nextStepId === "height") {
        trackQuizEventOnce("quiz_step_3_reached");
      }

      if (nextStepId === "paymentMethod") {
        trackQuizEventOnce("quiz_payment_step_reached");
      }

      if (nextStepId === "contact") {
        clearErrors(["name", "phone"]);
        trackQuizEventOnce("quiz_contact_step_reached");
      }

      setStep(next);
    }
  };

  const onSubmit = handleSubmit(async (formValues) => {
    setStatus("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          phone: normalizeBelarusPhone(formValues.phone),
          source,
        }),
      });

      if (!response.ok) {
        throw new Error("Quiz request failed");
      }

      setStatus("success");
      setStep(initialStep);
      reset(initialResetValues);
    } catch {
      setStatus("error");
    }
  });

  return (
    <form
      className={
        isCompact
          ? "grid scroll-mt-20 grid-rows-[auto_minmax(0,1fr)_auto_auto] rounded-2xl bg-white p-5 shadow-lg shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6 lg:scroll-mt-24"
          : "grid scroll-mt-20 grid-rows-[auto_minmax(0,1fr)_auto_auto] rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 lg:scroll-mt-24"
      }
      aria-label="Калькулятор стоимости забора"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div className={isCompact ? "mb-6" : "mb-8"}>
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Шаг {step} из {QUIZ_TOTAL_STEPS}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          aria-label={`Шаг ${step} из ${QUIZ_TOTAL_STEPS}`}
          aria-valuemax={QUIZ_TOTAL_STEPS}
          aria-valuemin={1}
          aria-valuenow={step}
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-[#1B5E20] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={
          isContactStep
            ? "min-w-0"
            : "min-h-[34rem] min-w-0 sm:min-h-[25rem]"
        }
      >
        <div
          className="h-full animate-[fadeIn_220ms_ease-out] motion-reduce:animate-none"
          key={step}
        >
        {currentStep.id === "fenceType" ? (
          <fieldset>
            <legend
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Выберите тип забора
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {fenceTypes.map((type) => (
                <button
                  aria-pressed={values.fenceType === type}
                  className={`${visualObjectOptionCardClass} ${optionFocusClass} ${getVisualOptionCardStateClass(values.fenceType === type)}`}
                  key={type}
                  onClick={() => {
                    trackQuizEventOnce("quiz_started");
                    setValue("fenceType", type, { shouldValidate: true })
                  }}
                  type="button"
                >
                  <FenceOptionPreview label={type} />
                  <span className="min-w-0 break-words leading-tight">
                    {type}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("fenceType", { required: true })}
            />
          </fieldset>
        ) : null}

        {currentStep.id === "length" ? (
          <label className="block">
            <span
              aria-level={3}
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              role="heading"
              tabIndex={-1}
            >
              Укажите примерную длину
            </span>
            <span className="mt-3 block text-sm text-slate-600">
              Можно примерно, например 35 метров. Этого достаточно, чтобы
              рассчитать предварительную стоимость по телефону.
            </span>
            <LengthScheme />
            <input
              aria-describedby={errors.length ? "quiz-length-error" : undefined}
              aria-invalid={Boolean(errors.length)}
              aria-label="Примерная длина забора"
              autoComplete="off"
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
              inputMode="decimal"
              placeholder="Например, 40 м"
              {...register("length", {
                required: "Введите примерную длину",
              })}
            />
            {errors.length ? (
              <span
                className="mt-2 block text-sm text-red-600"
                id="quiz-length-error"
                role="alert"
              >
                {errors.length.message}
              </span>
            ) : null}
          </label>
        ) : null}

        {currentStep.id === "height" ? (
          <fieldset>
            <legend
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Выберите высоту
            </legend>
            <span className="mt-2 block text-sm text-slate-600 max-[340px]:mt-1">
              Нужна другая высота или сомневаетесь в выборе? Выберите «Не знаю,
              нужна консультация» — подскажем подходящий вариант по телефону.
            </span>
            <HeightScheme />
            <p className="mt-1 text-center text-xs text-slate-500">
              Для ориентира: средний рост взрослого человека – около 175 см.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 max-[340px]:mt-2 sm:mt-2 sm:grid-cols-4">
              {heights.map((height) => (
                <button
                  aria-pressed={values.height === height}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${optionFocusClass} ${
                    values.height === height
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={height}
                  onClick={() =>
                    setValue("height", height, { shouldValidate: true })
                  }
                  type="button"
                >
                  {height}
                </button>
              ))}
              <button
                aria-pressed={
                  values.height === "Не знаю, нужна консультация"
                }
                className={`col-span-2 flex min-h-[88px] w-full items-center justify-center rounded-xl border border-dashed px-4 py-4 text-center text-sm leading-tight whitespace-normal font-semibold transition sm:col-span-1 ${optionFocusClass} ${
                  values.height === "Не знаю, нужна консультация"
                    ? "border-slate-500 bg-slate-200 text-slate-900"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-500"
                }`}
                onClick={() =>
                  setValue("height", "Не знаю, нужна консультация", {
                    shouldValidate: true,
                  })
                }
                type="button"
              >
                <span className="block max-w-[9.5rem]">
                  <span className="block">Не знаю,</span>
                  <span className="block">нужна</span>
                  <span className="block">консультация</span>
                </span>
              </button>
            </div>
            <input type="hidden" {...register("height", { required: true })} />
          </fieldset>
        ) : null}

        {currentStep.id === "gateType" ? (
          <fieldset>
            <legend
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Нужны ворота?
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {gateTypes.map((type) => {
                const isNeutralOption = type === "Не нужны";

                return (
                  <button
                    aria-pressed={values.gateType === type}
                    className={`${visualObjectOptionCardClass} ${optionFocusClass} ${getVisualOptionCardStateClass(values.gateType === type)}`}
                    key={type}
                    onClick={() =>
                      setValue("gateType", type, { shouldValidate: true })
                    }
                    type="button"
                  >
                    <VisualOptionAsset
                      scale={isNeutralOption ? "default" : "expanded"}
                      size={isNeutralOption ? "neutral" : "object"}
                      src={gateTypeImages[type]}
                    />
                    <span className="min-w-0 break-words leading-tight">
                      {type}
                    </span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register("gateType", { required: true })} />
          </fieldset>
        ) : null}

        {currentStep.id === "wicket" ? (
          <fieldset>
            <legend
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Нужна калитка?
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {wicketTypes.map((type) => {
                const isNeutralOption = type === "Нет, не нужна";

                return (
                  <button
                    aria-pressed={values.wicket === type}
                    className={`${visualObjectOptionCardClass} ${optionFocusClass} ${getVisualOptionCardStateClass(values.wicket === type)}`}
                    key={type}
                    onClick={() =>
                      setValue("wicket", type, { shouldValidate: true })
                    }
                    type="button"
                  >
                    <VisualOptionAsset
                      scale={isNeutralOption ? "default" : "expanded"}
                      size={isNeutralOption ? "neutral" : "object"}
                      src={wicketTypeImages[type]}
                    />
                    <span className="min-w-0 break-words leading-tight">
                      {type}
                    </span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register("wicket", { required: true })} />
          </fieldset>
        ) : null}

        {currentStep.id === "paymentMethod" ? (
          <fieldset>
            <legend
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Какой вариант оплаты рассматриваете?
            </legend>
            <span className="mt-3 block text-sm text-slate-600">
              Это поможет подобрать подходящий вариант расчёта.
            </span>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  aria-pressed={values.paymentMethod === method}
                  className={`flex min-h-[92px] items-center gap-3 rounded-xl border px-4 py-2 text-left font-semibold transition-colors sm:block sm:min-h-[148px] sm:py-4 sm:text-center ${optionFocusClass} ${getVisualOptionCardStateClass(values.paymentMethod === method)}`}
                  key={method}
                  onClick={() =>
                    setValue("paymentMethod", method, { shouldValidate: true })
                  }
                  type="button"
                >
                  <PaymentOptionPreview method={method} />
                  <span className="min-w-0 break-words leading-tight">
                    {method}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("paymentMethod", {
                required: "Выберите вариант оплаты",
              })}
            />
            {errors.paymentMethod ? (
              <span className="mt-2 block text-sm text-red-600" role="alert">
                {errors.paymentMethod.message}
              </span>
            ) : null}
          </fieldset>
        ) : null}

        {currentStep.id === "contact" ? (
          <div>
            <h3
              className="scroll-mt-24 text-2xl font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E20]"
              ref={(node) => {
                stepHeadingRef.current = node;
              }}
              tabIndex={-1}
            >
              Как с вами связаться?
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Имя
                </span>
                <input
                  aria-describedby={errors.name ? "quiz-name-error" : undefined}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
                  placeholder="Ваше имя"
                  {...register("name", { required: "Введите имя" })}
                />
                {errors.name ? (
                  <span
                    className="mt-2 block text-sm text-red-600"
                    id="quiz-name-error"
                    role="alert"
                  >
                    {errors.name.message}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Телефон
                </span>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    validate: (value) =>
                      isValidBelarusPhone(value) ||
                      "Проверьте номер телефона",
                  }}
                  render={({ field }) => (
                    <BelarusPhoneField
                      ariaDescribedBy={errors.phone ? "quiz-phone-error" : undefined}
                      ariaInvalid={Boolean(errors.phone)}
                      id="quiz-phone"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  )}
                />
                {errors.phone ? (
                  <span
                    className="mt-2 block text-sm text-red-600"
                    id="quiz-phone-error"
                    role="alert"
                  >
                    {String(errors.phone.message)}
                  </span>
                ) : null}
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-800">
                  Населённый пункт
                </span>
                <input
                  autoComplete="address-level2"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
                  placeholder="Город, деревня или посёлок"
                  {...register("city")}
                />
                {cityName ? (
                  <span className="mt-2 block text-xs text-slate-500">
                    Укажите ваш населённый пункт, если он отличается
                  </span>
                ) : null}
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-sm font-semibold text-slate-800">
                  Комментарий (необязательно)
                </span>
                <textarea
                  autoComplete="off"
                  className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
                  placeholder=""
                  {...register("comment")}
                />
              </label>
            </div>
          </div>
        ) : null}
        </div>
      </div>

      <div className={`${isCompact ? "mt-6" : "mt-8"} grid grid-cols-2 gap-3`}>
        <button
          className="min-h-12 touch-manipulation rounded-xl border border-slate-300 px-3 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:px-6"
          disabled={step === 1 || status === "loading"}
          onClick={() => setStep((current) => Math.max(current - 1, 1))}
          type="button"
        >
          Назад
        </button>

        {step < QUIZ_TOTAL_STEPS ? (
          <button
            className="min-h-12 touch-manipulation rounded-xl bg-[#F59E0B] px-3 py-3 font-bold text-white transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:px-6"
            onClick={nextStep}
            type="button"
          >
            Далее
          </button>
        ) : (
          <button
            className="min-h-12 touch-manipulation rounded-xl bg-[#F59E0B] px-3 py-3 font-bold text-white transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none sm:px-6"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? "Отправляем..." : "Получить расчёт"}
          </button>
        )}
      </div>

      <div aria-atomic="true" aria-live="polite">
        {status === "success" ? (
          <p className="mt-4 text-sm font-semibold text-[#1B5E20]">
            Заявка отправлена! Перезвоним в течение рабочего дня.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-4 text-sm font-semibold text-red-600">
            Пока заявка не отправилась. Позвоните нам или повторите попытку после
            настройки API.
          </p>
        ) : null}
      </div>
    </form>
  );
}
