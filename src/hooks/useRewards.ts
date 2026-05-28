"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapRewardItem } from "@/lib/api/mappers";
import { getRewardsCatalog } from "@/lib/api/rewards";
import type { CatalogRewardItem } from "@/lib/types";

export function useRewards() {
  const [items, setItems] = useState<CatalogRewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getRewardsCatalog()
      .then((catalog) => {
        if (!cancelled) {
          setItems(catalog.map(mapRewardItem));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setItems([]);
          setError(getUserFacingErrorMessage(err, "Unable to load rewards catalog."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { items, isLoading, error, refresh };
}
