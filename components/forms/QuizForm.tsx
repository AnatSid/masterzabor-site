"use client";

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

const fenceTypes = ["Профнастил", "Евроштакетник", "Сетка-рабица"] as const;
const heights = ["1.5 м", "1.8 м", "2.0 м", "2.5 м"] as const;
const gateTypes = ["Распашные", "Откатные", "Не нужны"] as const;
const wicketTypes = ["Да, нужна", "Нет, не нужна"] as const;
const STEP_FOCUS_DELAY_MS = 50;
const optionFocusClass =
  "touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 motion-reduce:transition-none";

function FenceOptionPreview({ label }: { label: string }) {
  const tone =
    label === "Профнастил"
      ? "from-slate-200 to-slate-300"
      : label === "Евроштакетник"
        ? "from-amber-100 to-amber-200"
        : "from-green-100 to-green-200";
  const icon = label === "Профнастил" ? "▦" : label === "Евроштакетник" ? "|||": "#";

  return (
    <div
      aria-hidden="true"
      className={`mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-gradient-to-br sm:h-[120px] ${tone}`}
    >
      {/* TODO: заменить на фото */}
      <div className="text-center">
        <div className="text-3xl font-bold text-slate-700">{icon}</div>
        <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {label}
        </div>
      </div>
    </div>
  );
}

function LengthScheme() {
  return (
    <svg
      aria-hidden="true"
      className="mt-4 h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-3"
      focusable="false"
      viewBox="0 0 360 150"
    >
      {/* Лёгкая имитация секций забора вместо пунктира */}
      <line x1="24" y1="34" x2="336" y2="34" stroke="#94A3B8" strokeWidth="1.4" strokeOpacity="0.55" />
      <line x1="24" y1="98" x2="336" y2="98" stroke="#94A3B8" strokeWidth="1.2" strokeOpacity="0.5" />
      {Array.from({ length: 11 }).map((_, index) => {
        const x = 24 + index * 31.2;

        return (
          <line
            key={x}
            x1={x}
            y1="98"
            x2={x}
            y2="38"
            stroke="#94A3B8"
            strokeWidth="1.3"
            strokeOpacity="0.5"
          />
        );
      })}

      <line x1="24" y1="114" x2="336" y2="114" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
      <polygon points="24,114 40,105 40,123" fill="#F59E0B" />
      <polygon points="336,114 320,105 320,123" fill="#F59E0B" />
      <text x="180" y="140" textAnchor="middle" fontSize="20" fontWeight="700" fill="#92400E">
        Длина, м
      </text>
    </svg>
  );
}

function HeightScheme() {
  return (
    <svg
      aria-hidden="true"
      className="mt-4 h-44 w-full rounded-xl border border-slate-200 bg-white p-3 sm:h-48"
      focusable="false"
      viewBox="0 0 360 180"
    >
      <line x1="24" y1="152" x2="336" y2="152" stroke="#111827" strokeWidth="2.4" />
      <rect x="64" y="52" width="62" height="100" fill="none" stroke="#111827" strokeWidth="2" />
      <circle cx="176" cy="68" r="10" fill="none" stroke="#111827" strokeWidth="2" />
      <line x1="176" y1="78" x2="176" y2="126" stroke="#111827" strokeWidth="2" />
      <line x1="176" y1="90" x2="160" y2="108" stroke="#111827" strokeWidth="2" />
      <line x1="176" y1="90" x2="192" y2="108" stroke="#111827" strokeWidth="2" />
      <line x1="176" y1="126" x2="163" y2="152" stroke="#111827" strokeWidth="2" />
      <line x1="176" y1="126" x2="189" y2="152" stroke="#111827" strokeWidth="2" />
      <line x1="42" y1="56" x2="42" y2="146" stroke="#F59E0B" strokeWidth="2" />
      <polygon points="42,56 38,64 46,64" fill="#F59E0B" />
      <polygon points="42,146 38,138 46,138" fill="#F59E0B" />
      <text x="214" y="38" fontSize="13" fontWeight="700" fill="#111827">1.5 / 1.8 / 2.0 / 2.5 м</text>
      <text x="214" y="60" fontSize="13" fontWeight="600" fill="#334155">рост человека ~170 см</text>
    </svg>
  );
}

function GateIcon({ type }: { type: string }) {
  if (type === "Не нужны") {
    return null;
  }

  if (type === "Распашные") {
    return (
      <svg aria-hidden="true" className="mb-3 h-16 w-full" focusable="false" viewBox="0 0 140 64">
        <rect x="30" y="12" width="32" height="40" fill="none" stroke="#334155" />
        <rect x="78" y="12" width="32" height="40" fill="none" stroke="#334155" />
        <line x1="62" y1="32" x2="50" y2="22" stroke="#334155" />
        <line x1="78" y1="32" x2="90" y2="22" stroke="#334155" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="mb-3 h-16 w-full" focusable="false" viewBox="0 0 140 64">
      <rect x="30" y="12" width="68" height="40" fill="none" stroke="#334155" />
      <line x1="100" y1="32" x2="116" y2="32" stroke="#334155" strokeWidth="2" />
      <polygon points="116,32 108,27 108,37" fill="#334155" />
    </svg>
  );
}

function WicketIcon({ type }: { type: string }) {
  if (type === "Нет, не нужна") {
    return null;
  }

  return (
    <svg aria-hidden="true" className="mb-3 h-16 w-full" focusable="false" viewBox="0 0 140 64">
      <rect x="44" y="10" width="52" height="44" fill="none" stroke="#334155" />
    </svg>
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
      height: "1.8 м",
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
      height: "1.8 м",
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
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${optionFocusClass} ${
                    values.fenceType === type
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={type}
                  onClick={() => {
                    trackQuizEventOnce("quiz_started");
                    setValue("fenceType", type, { shouldValidate: true })
                  }}
                  type="button"
                >
                  <FenceOptionPreview label={type} />
                  {type}
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
            <span className="mt-3 block text-sm text-slate-600">
              Если сомневаетесь в высоте, нажмите «Не знаю, нужна консультация»
              — подскажем по телефону.
            </span>
            <HeightScheme />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                aria-pressed={values.height === "Нужна консультация"}
                className={`col-span-2 flex min-h-[88px] w-full items-center justify-center rounded-xl border border-dashed px-4 py-4 text-center text-sm leading-tight whitespace-normal font-semibold transition sm:col-span-1 ${optionFocusClass} ${
                  values.height === "Нужна консультация"
                    ? "border-slate-500 bg-slate-200 text-slate-900"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-500"
                }`}
                onClick={() =>
                  setValue("height", "Нужна консультация", {
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
              {gateTypes.map((type) => (
                <button
                  aria-pressed={values.gateType === type}
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${optionFocusClass} ${
                    values.gateType === type
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={type}
                  onClick={() =>
                    setValue("gateType", type, { shouldValidate: true })
                  }
                  type="button"
                >
                  <GateIcon type={type} />
                  {type}
                </button>
              ))}
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
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {wicketTypes.map((type) => (
                <button
                  aria-pressed={values.wicket === type}
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${optionFocusClass} ${
                    values.wicket === type
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={type}
                  onClick={() =>
                    setValue("wicket", type, { shouldValidate: true })
                  }
                  type="button"
                >
                  <WicketIcon type={type} />
                  {type}
                </button>
              ))}
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
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${optionFocusClass} ${
                    values.paymentMethod === method
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={method}
                  onClick={() =>
                    setValue("paymentMethod", method, { shouldValidate: true })
                  }
                  type="button"
                >
                  {method}
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
                <span className="text-xs text-slate-500">Необязательно</span>
                <span className="block text-sm font-semibold text-slate-800">
                  Комментарий
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
