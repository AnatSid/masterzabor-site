"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BelarusPhoneField } from "@/components/forms/BelarusPhoneField";
import { isValidBelarusPhone, normalizeBelarusPhone } from "@/lib/phone";

type LeadFormValues = {
  name: string;
  phone: string;
  city?: string;
  fenceType?: string;
  comment?: string;
  source: string;
};

type LeadFormProps = {
  title?: string;
  source: string;
  variant?: "simple" | "full";
  cityName?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function LeadForm({
  title = "Получите бесплатный расчёт",
  source,
  variant = "simple",
  cityName,
}: LeadFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    defaultValues: {
      source,
      city: cityName ?? "",
    },
  });

  useEffect(() => {
    if (cityName) {
      setValue("city", cityName);
    }
  }, [cityName, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          source,
          phone: normalizeBelarusPhone(values.phone),
        }),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      setStatus("success");
      reset({
        name: "",
        phone: "",
        city: cityName ?? "",
        fenceType: "",
        comment: "",
        source,
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
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Оставьте номер — перезвоним в течение рабочего дня и рассчитаем
        стоимость.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Имя</span>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
            placeholder="Александр"
            {...register("name", {
              required: "Введите имя",
              minLength: {
                value: 2,
                message: "Имя должно быть не короче 2 символов",
              },
            })}
          />
          {errors.name ? (
            <span className="mt-1 block text-sm text-red-600">
              {errors.name.message}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Телефон</span>
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
                id="lead-phone"
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value ?? ""}
              />
            )}
          />
          {errors.phone ? (
            <span className="mt-1 block text-sm text-red-600">
              {String(errors.phone.message)}
            </span>
          ) : null}
        </label>
      </div>

      {variant === "full" ? (
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Населённый пункт
            </span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
              placeholder="Город, деревня или посёлок"
              {...register("city")}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Тип ограждения
            </span>
            <select
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
              {...register("fenceType")}
            >
              <option value="">Выберите вариант</option>
              <option value="Профнастил">Профнастил</option>
              <option value="Евроштакетник">Евроштакетник</option>
              <option value="Сетка-рабица">Сетка-рабица</option>
              <option value="Распашные ворота">Распашные ворота</option>
              <option value="Откатные ворота">Откатные ворота</option>
              <option value="Калитка">Калитка</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-500">Необязательно</span>
            <span className="text-sm font-semibold text-slate-800">
              Комментарий
            </span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
              placeholder=""
              {...register("comment")}
            />
          </label>
        </div>
      ) : null}

      <input type="hidden" {...register("source")} value={source} />

      <button
        className="mt-6 w-full rounded-xl bg-[#F59E0B] px-6 py-3 font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Отправляем..." : "Получить расчёт"}
      </button>

      {status === "success" ? (
        <p className="mt-4 text-sm font-semibold text-[#1B5E20]">
          Заявка отправлена! Перезвоним в течение рабочего дня.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm font-semibold text-red-600">
          Не удалось отправить заявку. Попробуйте позвонить нам напрямую.
        </p>
      ) : null}
    </form>
  );
}
