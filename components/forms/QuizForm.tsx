"use client";

import { useEffect, useState } from "react";
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
    <svg className="mt-4 h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" viewBox="0 0 320 120">
      <rect x="20" y="22" width="280" height="76" fill="none" stroke="#475569" strokeDasharray="5 5" />
      <line x1="20" y1="95" x2="300" y2="95" stroke="#0F172A" strokeWidth="2" />
      <polygon points="20,95 30,90 30,100" fill="#0F172A" />
      <polygon points="300,95 290,90 290,100" fill="#0F172A" />
      <text x="160" y="112" textAnchor="middle" fontSize="12" fill="#334155">
        длина, м
      </text>
    </svg>
  );
}

function HeightScheme() {
  return (
    <svg className="mt-4 h-36 w-full rounded-xl border border-slate-200 bg-white p-3" viewBox="0 0 320 140">
      <line x1="20" y1="118" x2="300" y2="118" stroke="#111827" strokeWidth="2" />
      <rect x="56" y="38" width="52" height="80" fill="none" stroke="#111827" />
      <circle cx="150" cy="52" r="8" fill="none" stroke="#111827" />
      <line x1="150" y1="60" x2="150" y2="100" stroke="#111827" />
      <line x1="150" y1="70" x2="136" y2="84" stroke="#111827" />
      <line x1="150" y1="70" x2="164" y2="84" stroke="#111827" />
      <line x1="150" y1="100" x2="139" y2="118" stroke="#111827" />
      <line x1="150" y1="100" x2="161" y2="118" stroke="#111827" />
      <line x1="36" y1="38" x2="36" y2="118" stroke="#111827" />
      <polygon points="36,38 32,46 40,46" fill="#111827" />
      <polygon points="36,118 32,110 40,110" fill="#111827" />
      <text x="182" y="30" fontSize="11" fill="#111827">1.5 / 1.8 / 2.0 / 2.5 м</text>
      <text x="182" y="48" fontSize="11" fill="#334155">рост человека ~170 см</text>
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
};

export function QuizForm({ cityName }: QuizFormProps) {
  const [step, setStep] = useState(1);
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
      fenceType: "Профнастил",
      height: "1.8 м",
      gateType: "Не нужны",
      wicket: "Калитка не нужна",
      city: cityName ?? "",
    },
  });

  useEffect(() => {
    if (cityName) {
      setValue("city", cityName);
    }
  }, [cityName, setValue]);

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
          source: "home-quiz",
        }),
      });

      if (!response.ok) {
        throw new Error("Quiz request failed");
      }

      setStatus("success");
      setStep(1);
      reset({
        fenceType: "Профнастил",
        height: "1.8 м",
        gateType: "Не нужны",
        wicket: "Калитка не нужна",
        length: "",
        name: "",
        phone: "",
        city: cityName ?? "",
        comment: "",
      });
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

      <div className="min-h-64">
        <div className="animate-[fadeIn_220ms_ease-out]" key={step}>
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
                className={`rounded-xl border border-dashed px-4 py-4 text-sm font-semibold transition ${
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
                Не знаю, нужна консультация
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
                      "Введите номер: +375 и 9 цифр (25, 29, 33 или 44)",
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
