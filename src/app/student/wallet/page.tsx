"use client";

import Link from "next/link";

import { RewardCatalog } from "@/components/reward/RewardCatalog";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { TransactionList } from "@/components/transaction/TransactionList";
import { EarnInfoCard } from "@/components/wallet/EarnInfoCard";
import { StudentQRCodeCardClient } from "@/components/wallet/StudentQRCodeCardClient";
import { StudentStatsGrid } from "@/components/wallet/StudentStatsGrid";
import { WalletActivityTimeline } from "@/components/wallet/WalletActivityTimeline";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { useStudentWalletContext } from "@/contexts/StudentWalletContext";

export default function StudentWalletPage() {
  const { data, isLoading, error, refresh } = useStudentWalletContext();

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      loadingMessage="Loading your wallet…"
      errorTitle="Unable to load wallet"
    >
      {data && (
        <div className="space-y-4">
          <WalletBalanceCard
            studentName={data.wallet.studentName}
            balance={data.wallet.balance}
            status={data.wallet.status}
            walletId={data.wallet.walletId}
          />
          <StudentStatsGrid stats={data.stats} />
          <StudentQRCodeCardClient />
          <TransactionList
            transactions={data.transactions}
            limit={3}
            showViewAll
            viewAllHref="/student/transactions"
          />
          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Available rewards</h2>
              <Link
                href="/student/rewards"
                className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                Browse all
              </Link>
            </div>
            <RewardCatalog items={data.catalog} balance={data.wallet.balance} />
          </section>
          <WalletActivityTimeline items={data.timeline} limit={4} />
          <EarnInfoCard />
        </div>
      )}
    </AsyncBoundary>
  );
}
