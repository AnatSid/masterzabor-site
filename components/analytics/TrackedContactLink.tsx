"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import type { ContactEventType } from "@/lib/conversion-events";
import { trackContactClick } from "@/lib/client-analytics";

type TrackedContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  channel: ContactEventType;
  children: ReactNode;
  eventLocation: string;
  href: string;
  source?: string;
};

export function TrackedContactLink({
  channel,
  children,
  eventLocation,
  onClick,
  source,
  ...props
}: TrackedContactLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackContactClick(channel, {
      location: eventLocation,
      source,
    });
    onClick?.(event);
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
