"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    window.gtag?.("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}
