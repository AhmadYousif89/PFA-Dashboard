"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const urlParams = params;

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        } else {
          urlParams.delete(key);
        }
      });

      const newURL = `${pathname}?${urlParams.toString()}`;
      router.push(newURL, { scroll: true });
    },
    [params, pathname, router],
  );

  const getParam = useCallback(
    (key: string, defaultValue = "") => {
      return params.get(key) ?? defaultValue;
    },
    [params],
  );

  return { updateURL, getParam, searchParams: params };
}
