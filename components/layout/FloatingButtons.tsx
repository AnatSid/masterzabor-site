import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import {
  PHONE,
  TELEGRAM_LINK,
  VIBER_LINK,
  WHATSAPP_LINK,
} from "@/lib/constants";

const iconClassName = "h-6 w-6";

function TelegramIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.53 4.46a1 1 0 0 0-1.03-.14L3.13 11.12a1 1 0 0 0 .05 1.86l4.24 1.53 1.53 4.24a1 1 0 0 0 1.86.05l6.8-17.37a1 1 0 0 0-.08-.97Zm-11.7 10.7-.57-1.57 6.78-6.79-6.21 8.36Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z"
        fill="currentColor"
      />
      <path
        d="M16.45 14.3c-.2.57-1.1 1.04-1.5 1.09-.4.05-.9.07-1.45-.12-.33-.11-.76-.25-1.31-.49-2.3-.99-3.8-3.29-3.91-3.45-.11-.16-.93-1.24-.93-2.36 0-1.12.59-1.67.8-1.9.2-.23.45-.29.6-.29.15 0 .3 0 .43.01.14.01.32-.05.5.39.2.47.67 1.64.73 1.75.06.12.1.25.02.4-.08.16-.12.25-.24.38-.12.14-.25.3-.36.4-.12.12-.24.25-.1.5.13.25.6.99 1.3 1.6.88.78 1.61 1.03 1.86 1.15.25.12.4.1.55-.06.15-.17.63-.73.8-.98.17-.25.35-.2.58-.12.24.08 1.5.71 1.76.84.26.13.43.2.49.31.06.11.06.67-.14 1.24Z"
        fill="#fff"
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.14 3c4.05 0 6.8 2.61 7.03 6.64.1 1.83-.24 3.4-.99 4.62-.3.5-.41.9-.35 1.42l.2 1.6c.08.62-.48 1.13-1.09.98l-1.58-.4c-.48-.12-.83-.04-1.25.2-1.26.7-2.77 1.03-4.45.94-4.03-.21-6.65-2.98-6.66-7.02C3 6.82 6.27 3 12.14 3Z"
        fill="currentColor"
      />
      <path
        d="M14.84 13.95c-.17.44-1 .86-1.34.89-.36.04-.8.08-1.3-.1-.3-.11-.7-.24-1.2-.45-1.9-.82-3.17-2.72-3.27-2.84-.1-.13-.78-1.05-.78-2.02s.5-1.48.69-1.67c.18-.19.39-.24.52-.24h.38c.12.01.27-.03.42.33.16.4.56 1.4.61 1.49.05.1.08.21.02.34-.07.12-.1.2-.2.3-.1.1-.2.24-.3.33-.1.1-.2.2-.08.42.11.21.5.84 1.07 1.36.72.66 1.33.88 1.54.98.21.1.34.08.47-.06.13-.14.53-.62.67-.84.15-.21.29-.18.5-.1.2.07 1.27.61 1.49.72.22.1.36.16.41.26.05.1.05.57-.13 1.1Z"
        fill="#fff"
      />
      <path
        d="M14.77 7.63a.74.74 0 1 0 .02 1.48c.66.01 1.18.52 1.19 1.2a.74.74 0 1 0 1.48-.02 2.7 2.7 0 0 0-2.69-2.66Z"
        fill="#fff"
      />
    </svg>
  );
}

const messengers = [
  { label: "Telegram", channel: "click_telegram", href: TELEGRAM_LINK, color: "#229ED9", icon: TelegramIcon },
  { label: "WhatsApp", channel: "click_whatsapp", href: WHATSAPP_LINK, color: "#25D366", icon: WhatsAppIcon },
  { label: "Viber", channel: "click_viber", href: VIBER_LINK, color: "#7360F2", icon: ViberIcon },
] as const;

export function FloatingButtons() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] md:hidden">
      <TrackedContactLink
        channel="click_call"
        className="flex items-center justify-center rounded-xl bg-[#1B5E20] px-4 py-3 text-sm font-bold text-white"
        eventLocation="floating_mobile"
        href={`tel:${PHONE}`}
      >
        📞 Позвонить
      </TrackedContactLink>
      <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2">
        {messengers.map((item) => (
          <TrackedContactLink
            aria-label={item.label}
            channel={item.channel}
            className="flex size-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
            eventLocation="floating_mobile"
            href={item.href}
            key={item.href}
            rel="noopener noreferrer"
            style={{ color: item.color }}
            target={item.href.startsWith("http") ? "_blank" : undefined}
          >
            <item.icon />
          </TrackedContactLink>
        ))}
      </div>
    </div>
  );
}
