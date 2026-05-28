"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapRedemptionReceipt } from "@/lib/api/mappers";
import { getVendorRedemptions } from "@/lib/api/vendor";
import type { RedemptionReceipt, VendorDailySummary } from "@/lib/types";

export function useVendorRedemptions() {
  const [redemptions, setRedemptions] = useState<RedemptionReceipt[]>([]);
  const [summary, setSummary] = useState<VendorDailySummary>({
    redemptionCount: 0,
    totalCreditsRedeemed: 0,
    topItem: "—",
  });
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
    getVendorRedemptions()
      .then((rows) => {
        if (cancelled) return;
        const mapped = rows.map(mapRedemptionReceipt);
        setRedemptions(mapped);

        const today = new Date().toISOString().slice(0, 10);
        const todayRows = mapped.filter((r) => r.redeemedAt.startsWith(today));
        const totals = todayRows.reduce((sum, r) => sum + r.amount, 0);
        const top = todayRows.reduce<Record<string, number>>((acc, r) => {
          acc[r.itemName] = (acc[r.itemName] ?? 0) + 1;
          return acc;
        }, {});
        const topItem =
          Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

        setSummary({
          redemptionCount: todayRows.length,
          totalCreditsRedeemed: totals,
          topItem,
        });
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setRedemptions([]);
          setError(getUserFacingErrorMessage(err, "Unable to load redemptions."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { redemptions, summary, isLoading, error, refresh };
}
