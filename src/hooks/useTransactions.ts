"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapLedgerTransaction } from "@/lib/api/mappers";
import { getWalletTransactions } from "@/lib/api/wallet";
import type { Transaction } from "@/lib/types";

type UseTransactionsOptions = {
  walletId: string | null;
  userId: string;
  page?: number;
  pageSize?: number;
};

export function useTransactions({ walletId, userId, page = 1, pageSize = 50 }: UseTransactionsOptions) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!walletId) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    getWalletTransactions(walletId, page, pageSize)
      .then((result) => {
        if (!cancelled) {
          setTransactions(result.items.map((tx) => mapLedgerTransaction(tx, userId)));
          setTotal(result.total);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setTransactions([]);
          setError(getUserFacingErrorMessage(err, "Unable to load transactions."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [walletId, userId, page, pageSize, tick]);

  return { transactions, total, isLoading, error, refresh };
}
