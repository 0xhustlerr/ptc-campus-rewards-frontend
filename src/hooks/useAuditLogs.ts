"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapAuditLog } from "@/lib/api/mappers";
import { getAuditLogs } from "@/lib/api/admin";
import type { AuditLogEntry } from "@/lib/types";

export function useAuditLogs(limit = 100) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
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
    getAuditLogs(limit)
      .then((rows) => {
        if (!cancelled) {
          setLogs(rows.map(mapAuditLog));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLogs([]);
          setError(getUserFacingErrorMessage(err, "Unable to load audit logs."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit, tick]);

  return { logs, isLoading, error, refresh };
}
