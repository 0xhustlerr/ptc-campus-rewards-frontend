"use client";

import { useCallback, useEffect, useState } from "react";

import type { StudentWalletData } from "@/contexts/StudentWalletContext";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import {
  buildActivityTimeline,
  buildStudentStats,
  mapLedgerTransaction,
  mapRewardItem,
  mapStudentProfile,
  mapWalletMe,
} from "@/lib/api/mappers";
import { getStudentMe } from "@/lib/api/student";
import { getRewardsCatalog } from "@/lib/api/rewards";
import { getWalletMe, getWalletTransactions } from "@/lib/api/wallet";

type LoadState = {
  data: StudentWalletData | null;
  isLoading: boolean;
  error: string | null;
};

export function useStudentWallet() {
  const [state, setState] = useState<LoadState>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [student, walletMe, catalogRes] = await Promise.all([
          getStudentMe(),
          getWalletMe(),
          getRewardsCatalog(),
        ]);
        const txPage = await getWalletTransactions(walletMe.wallet_id, 1, 50);

        if (cancelled) return;

        const wallet = mapWalletMe(walletMe);
        const transactions = txPage.items.map((tx) =>
          mapLedgerTransaction(tx, student.user_id),
        );
        const profile = mapStudentProfile(student, walletMe);
        const catalog = catalogRes.map(mapRewardItem);
        const stats = buildStudentStats(transactions);
        const timeline = buildActivityTimeline(transactions);

        setState({
          data: { wallet, profile, stats, transactions, catalog, timeline },
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: getUserFacingErrorMessage(err, "Unable to load your wallet. Please try again."),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { ...state, refresh };
}
