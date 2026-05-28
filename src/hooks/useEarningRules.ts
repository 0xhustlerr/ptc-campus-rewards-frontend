"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapEarningRule } from "@/lib/api/mappers";
import { getEarningRulesList } from "@/lib/api/staff";
import type { EarningRule } from "@/lib/types";

export function useEarningRules() {
  const [rules, setRules] = useState<EarningRule[]>([]);
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
    getEarningRulesList()
      .then((rows) => {
        if (!cancelled) {
          setRules(rows.filter((r) => r.active).map(mapEarningRule));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRules([]);
          setError(getUserFacingErrorMessage(err, "Unable to load earning rules."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { rules, isLoading, error, refresh };
}
