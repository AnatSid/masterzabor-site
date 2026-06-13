"use client";

import type {
  ContactEventType,
  QuizFunnelEventType,
} from "@/lib/conversion-events";

type EventPayload = {
  type: ContactEventType | QuizFunnelEventType;
  location?: string;
  source?: string;
  pagePath?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

const yandexCounterId = process.env.NEXT_PUBLIC_YM_ID;

function getPagePath(pagePath?: string) {
  if (pagePath) {
    return pagePath;
  }

  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.pathname;
}

function sendBrowserCounters(payload: Required<EventPayload>) {
  window.gtag?.("event", payload.type, {
    event_category: "conversion",
    event_label: payload.location,
    page_path: payload.pagePath,
    source: payload.source,
  });

  if (yandexCounterId && window.ym) {
    window.ym(yandexCounterId, "reachGoal", payload.type, {
      location: payload.location,
      page_path: payload.pagePath,
      source: payload.source,
    });
  }
}

export function trackConversionEvent(payload: EventPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const fullPayload: Required<EventPayload> = {
    type: payload.type,
    location: payload.location ?? "unknown",
    source: payload.source ?? "unknown",
    pagePath: getPagePath(payload.pagePath) ?? "unknown",
  };

  try {
    sendBrowserCounters(fullPayload);
  } catch {
    // Browser counters are best-effort; KV counter still runs below.
  }

  window
    .fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPayload),
      keepalive: true,
    })
    .catch(() => {
      // Analytics must never break contact clicks or quiz flow.
    });
}

export function trackContactClick(
  type: ContactEventType,
  payload: Omit<EventPayload, "type"> = {},
) {
  trackConversionEvent({ ...payload, type });
}

export function trackQuizFunnel(
  type: QuizFunnelEventType,
  payload: Omit<EventPayload, "type"> = {},
) {
  trackConversionEvent({ ...payload, type });
}
