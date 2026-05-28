"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import {
  mapAdminOverview,
  mapEarnedByRule,
  mapRedeemedByCategory,
  mapTokenVelocity,
  mapTopStudents,
} from "@/lib/api/mappers";
import {
  getEarnedByRule,
  getRedeemedByCategory,
  getReportsOverview,
  getTokenVelocity,
  getTopStudents,
} from "@/lib/api/reports";
import type { AdminReports } from "@/lib/types";

const EMPTY_REPORTS: AdminReports = {
  totalStudents: 0,
  totalIssued: 0,
  totalRedeemed: 0,
  outstandingBalance: 0,
  redemptionsToday: 0,
  mostActiveStudent: "—",
  tokensEarnedByRule: [],
  tokensRedeemedByCategory: [],
  weeklyTransactionVolume: [],
  topActiveStudents: [],
};

export function useAdminReports() {
  const [reports, setReports] = useState<AdminReports>(EMPTY_REPORTS);
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
    Promise.all([
      getReportsOverview(),
      getEarnedByRule(),
      getRedeemedByCategory(),
      getTokenVelocity(7),
      getTopStudents(10),
    ])
      .then(([overview, earned, redeemed, velocity, topStudents]) => {
        if (cancelled) return;
        setReports({
          ...EMPTY_REPORTS,
          ...mapAdminOverview(overview),
          tokensEarnedByRule: mapEarnedByRule(earned),
          tokensRedeemedByCategory: mapRedeemedByCategory(redeemed),
          weeklyTransactionVolume: mapTokenVelocity(velocity.series),
          topActiveStudents: mapTopStudents(topStudents),
        });
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setReports(EMPTY_REPORTS);
          setError(getUserFacingErrorMessage(err, "Unable to load reports."));
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
