"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";

export type AsyncQueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useAsyncQuery<T>(
  queryFn: () => Promise<T>,
  deps: readonly unknown[] = [],
): AsyncQueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await queryFn();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(getUserFacingErrorMessage(err));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- queryFn + explicit deps
  }, [tick, ...deps]);

  return { data, isLoading, error, refresh };
}
