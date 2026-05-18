"use client";

import {
  BELARUS_PHONE_PREFIX,
  extractBelarusLocalDigits,
  formatBelarusPhoneMask,
  normalizeBelarusPhone,
} from "@/lib/phone";

type BelarusPhoneFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
};

export function BelarusPhoneField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "XX-XXX-XX-XX",
}: BelarusPhoneFieldProps) {
  const localDigits = extractBelarusLocalDigits(value);

  return (
    <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-300 focus-within:border-[#1B5E20] focus-within:ring-2 focus-within:ring-[#1B5E20]/20">
      <div className="flex items-center border-r border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-700">
        <span aria-hidden="true" className="mr-1">
          🇧🇾
        </span>
        <span>{BELARUS_PHONE_PREFIX}</span>
      </div>
      <input
        autoComplete="tel-national"
        className="w-full px-4 py-3 outline-none"
        id={id}
        inputMode="numeric"
        onBlur={onBlur}
        onChange={(event) => {
          const nextDigits = extractBelarusLocalDigits(event.target.value);
          onChange(normalizeBelarusPhone(nextDigits));
        }}
        placeholder={placeholder}
        type="tel"
        value={formatBelarusPhoneMask(localDigits)}
      />
    </div>
  );
}
