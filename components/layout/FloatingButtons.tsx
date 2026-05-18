import {
  PHONE,
  TELEGRAM_LINK,
} from "@/lib/constants";

export function FloatingButtons() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] md:hidden">
      <a
        className="flex items-center justify-center rounded-xl bg-[#1B5E20] px-4 py-3 text-sm font-bold text-white"
        href={`tel:${PHONE}`}
      >
        📞 Позвонить
      </a>
      <a
        className="flex items-center justify-center rounded-xl bg-[#1B5E20] px-4 py-3 text-sm font-bold text-white"
        href={TELEGRAM_LINK}
        rel="noopener noreferrer"
        target="_blank"
      >
        💬 Написать
      </a>
    </div>
  );
}
