"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BelarusPhoneField } from "@/components/forms/BelarusPhoneField";
import { isValidBelarusPhone, normalizeBelarusPhone } from "@/lib/phone";

type QuizFormValues = {
  fenceType: string;
  length: string;
  height: string;
  gateType: string;
  wicket: string;
  name: string;
  phone: string;
  city?: string;
  comment?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const fenceTypes = ["Профнастил", "Евроштакетник", "Сетка-рабица"] as const;
const heights = ["1.5 м", "1.8 м", "2.0 м", "2.5 м"] as const;
const gateTypes = ["Распашные", "Откатные", "Не нужны"] as const;
const wicketTypes = [
  "Калитка с замком",
  "Калитка без замка",
  "Калитка не нужна",
] as const;

function FenceOptionPreview({ label }: { label: string }) {
  const tone =
    label === "Профнастил"
      ? "from-slate-200 to-slate-300"
      : label === "Евроштакетник"
        ? "from-amber-100 to-amber-200"
        : "from-green-100 to-green-200";
  const icon = label === "Профнастил" ? "▦" : label === "Евроштакетник" ? "|||": "#";

  return (
    <div className={`mb-3 flex h-[120px] w-full items-center justify-center rounded-lg bg-gradient-to-br ${tone}`}>
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
      className="mt-4 h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-3"
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
      className="mt-4 h-44 w-full rounded-xl border border-slate-200 bg-white p-3 sm:h-48"
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
      <svg className="mb-3 h-16 w-full" viewBox="0 0 140 64">
        <rect x="30" y="12" width="32" height="40" fill="none" stroke="#334155" />
        <rect x="78" y="12" width="32" height="40" fill="none" stroke="#334155" />
        <line x1="62" y1="32" x2="50" y2="22" stroke="#334155" />
        <line x1="78" y1="32" x2="90" y2="22" stroke="#334155" />
      </svg>
    );
  }

  return (
    <svg className="mb-3 h-16 w-full" viewBox="0 0 140 64">
      <rect x="30" y="12" width="68" height="40" fill="none" stroke="#334155" />
      <line x1="100" y1="32" x2="116" y2="32" stroke="#334155" strokeWidth="2" />
      <polygon points="116,32 108,27 108,37" fill="#334155" />
    </svg>
  );
}

function WicketIcon({ type }: { type: string }) {
  if (type === "Калитка не нужна") {
    return null;
  }

  if (type === "Калитка с замком") {
    return (
      <svg className="mb-3 h-16 w-full" viewBox="0 0 140 64">
        <rect x="44" y="10" width="52" height="44" fill="none" stroke="#334155" />
        <rect x="88" y="26" width="8" height="8" fill="none" stroke="#334155" />
        <path d="M88 26c0-4 2-6 4-6s4 2 4 6" fill="none" stroke="#334155" />
      </svg>
    );
  }

  return (
    <svg className="mb-3 h-16 w-full" viewBox="0 0 140 64">
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
};

function sanitizeDefaultStep(step?: number) {
  if (!step) {
    return 1;
  }

  return Math.min(6, Math.max(1, Math.trunc(step)));
}

export function QuizForm({
  cityName,
  source = "home-quiz",
  defaultFenceType,
  defaultGateType,
  defaultWicketType,
  defaultStep,
}: QuizFormProps) {
  const initialFenceType = fenceTypes.includes(defaultFenceType as (typeof fenceTypes)[number])
    ? defaultFenceType
    : "Профнастил";
  const initialGateType = gateTypes.includes(defaultGateType as (typeof gateTypes)[number])
    ? defaultGateType
    : "Не нужны";
  const initialWicketType = wicketTypes.includes(defaultWicketType as (typeof wicketTypes)[number])
    ? defaultWicketType
    : "Калитка не нужна";
  const initialStep = sanitizeDefaultStep(defaultStep);
  const initialResetValues = useMemo(
    () => ({
      fenceType: initialFenceType,
      height: "1.8 м",
      gateType: initialGateType,
      wicket: initialWicketType,
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
  }, [initialResetValues, initialStep, reset, source]);

  const values = watch();
  const progress = (step / 6) * 100;

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof QuizFormValues)[]> = {
      1: ["fenceType"],
      2: ["length"],
      3: ["height"],
      4: ["gateType"],
      5: ["wicket"],
      6: ["name", "phone"],
    };

    const isValid = await trigger(fieldsByStep[step]);

    if (isValid) {
      setStep((current) => Math.min(current + 1, 6));
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
      className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8"
      onSubmit={onSubmit}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Шаг {step} из 6</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#1B5E20] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="min-h-[520px]">
        <div className="h-full animate-[fadeIn_220ms_ease-out]" key={step}>
        {step === 1 ? (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-950">
              Выберите тип забора
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {fenceTypes.map((type) => (
                <button
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${
                    values.fenceType === type
                      ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#1B5E20]"
                  }`}
                  key={type}
                  onClick={() =>
                    setValue("fenceType", type, { shouldValidate: true })
                  }
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

        {step === 2 ? (
          <label className="block">
            <span className="text-2xl font-bold text-slate-950">
              Укажите длину забора
            </span>
            <span className="mt-3 block text-sm text-slate-600">
              Можно примерно, например 35 метров. Этого достаточно, чтобы
              рассчитать предварительную стоимость по телефону.
            </span>
            <LengthScheme />
            <input
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
              placeholder="Например, 40 м"
              {...register("length", {
                required: "Введите примерную длину",
              })}
            />
            {errors.length ? (
              <span className="mt-2 block text-sm text-red-600">
                {errors.length.message}
              </span>
            ) : null}
          </label>
        ) : null}

        {step === 3 ? (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-950">
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
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
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
                className={`col-span-2 flex min-h-[88px] w-full items-center justify-center rounded-xl border border-dashed px-4 py-4 text-center text-sm leading-tight whitespace-normal font-semibold transition sm:col-span-1 ${
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

        {step === 4 ? (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-950">
              Нужны ворота?
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {gateTypes.map((type) => (
                <button
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${
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

        {step === 5 ? (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-950">
              Какая калитка нужна?
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {wicketTypes.map((type) => (
                <button
                  className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${
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

        {step === 6 ? (
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              Как с вами связаться?
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Имя
                </span>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
                  placeholder="Ваше имя"
                  {...register("name", { required: "Введите имя" })}
                />
                {errors.name ? (
                  <span className="mt-2 block text-sm text-red-600">
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
                      id="quiz-phone"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  )}
                />
                {errors.phone ? (
                  <span className="mt-2 block text-sm text-red-600">
                    {String(errors.phone.message)}
                  </span>
                ) : null}
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-800">
                  Населённый пункт
                </span>
                <input
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={step === 1 || status === "loading"}
          onClick={() => setStep((current) => Math.max(current - 1, 1))}
          type="button"
        >
          Назад
        </button>

        {step < 6 ? (
          <button
            className="rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600"
            onClick={nextStep}
            type="button"
          >
            Далее
          </button>
        ) : (
          <button
            className="rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? "Отправляем..." : "Получить расчёт"}
          </button>
        )}
      </div>

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
    </form>
  );
}
