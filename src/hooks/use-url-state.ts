"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) urlParams.set(key, value);
        else urlParams.delete(key);
      });

      const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const next = `${pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;

      if (next === current) return; // no-op if unchanged
      router.push(next, { scroll: true });
    },
    [searchParams, pathname, router],
  );

  const getParam = useCallback(
    (key: string, defaultValue = "") => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams],
  );

  return { updateURL, getParam };
}
