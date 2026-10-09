"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: string;
  eventLabel?: string;
  children: ReactNode;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function TrackedLink({ eventName = "contact_click", eventLabel = "whatsapp", onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        window.gtag?.("event", eventName, { link_label: eventLabel });
        onClick?.(event);
      }}
    />
  );
}
