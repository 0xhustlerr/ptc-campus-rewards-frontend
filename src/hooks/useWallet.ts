"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapWalletMe } from "@/lib/api/mappers";
import { getWalletMe } from "@/lib/api/wallet";
import type { StudentWallet } from "@/lib/types";

export function useWallet() {
  const [wallet, setWallet] = useState<StudentWallet | null>(null);
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
    getWalletMe()
      .then((data) => {
        if (!cancelled) {
          setWallet(mapWalletMe(data));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setWallet(null);
          setError(getUserFacingErrorMessage(err, "Unable to load your wallet."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { wallet, isLoading, error, refresh };
}
