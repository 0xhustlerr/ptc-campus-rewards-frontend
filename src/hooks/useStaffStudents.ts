"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapStudentListItem } from "@/lib/api/mappers";
import { getStaffStudents } from "@/lib/api/staff";
import type { StaffStudent } from "@/lib/types";

export function useStaffStudents() {
  const [students, setStudents] = useState<StaffStudent[]>([]);
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
    getStaffStudents()
      .then((rows) => {
        if (!cancelled) {
          setStudents(rows.map(mapStudentListItem));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStudents([]);
          setError(getUserFacingErrorMessage(err, "Unable to load students."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { students, isLoading, error, refresh };
}
