"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapAdminOverview } from "@/lib/api/mappers";
import { getReportsOverview } from "@/lib/api/reports";
import type { AdminReports } from "@/lib/types";

export function useAdminOverview() {
  const [reports, setReports] = useState<Partial<AdminReports> | null>(null);
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
    getReportsOverview()
      .then((overview) => {
        if (!cancelled) {
          setReports(mapAdminOverview(overview));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setReports(null);
          setError(getUserFacingErrorMessage(err, "Unable to load overview."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { reports, isLoading, error, refresh };
}
