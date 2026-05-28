"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";

import { useStudentWallet } from "@/hooks/useStudentWallet";
import type {
  ActivityTimelineItem,
  CatalogRewardItem,
  StudentProfile,
  StudentWallet,
  StudentWalletStats,
  Transaction,
} from "@/lib/types";

export type StudentWalletData = {
  wallet: StudentWallet;
  profile: StudentProfile;
  stats: StudentWalletStats;
  transactions: Transaction[];
  catalog: CatalogRewardItem[];
  timeline: ActivityTimelineItem[];
};

type StudentWalletContextValue = {
  data: StudentWalletData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

const StudentWalletContext = createContext<StudentWalletContextValue | null>(null);

export function StudentWalletProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error, refresh } = useStudentWallet();
  const value = useMemo(
    () => ({ data, isLoading, error, refresh }),
    [data, isLoading, error, refresh],
  );
  return (
    <StudentWalletContext.Provider value={value}>{children}</StudentWalletContext.Provider>
  );
}

export function useStudentWalletContext(): StudentWalletContextValue {
  const ctx = useContext(StudentWalletContext);
  if (!ctx) {
    throw new Error("useStudentWalletContext must be used within StudentWalletProvider");
  }
  return ctx;
}
