"use client";

import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard, StatGrid } from "@/components/shared/StatCard";
import { TransactionList } from "@/components/transaction/TransactionList";
import { WalletActivityTimeline } from "@/components/wallet/WalletActivityTimeline";
import { useStudentWalletContext } from "@/contexts/StudentWalletContext";
import { formatCreditsShort } from "@/lib/formatters";

export default function StudentTransactionsPage() {
  const { data, isLoading, error, refresh } = useStudentWalletContext();

  return (
    <>
      <PageHeader
        as="h1"
        title="Activity"
        description="All earns and redemptions on your campus wallet"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading activity…"
        errorTitle="Unable to load activity"
      >
        {data && (
          <div className="space-y-4">
            <StatGrid>
              <StatCard
                label="Total earned"
                value={formatCreditsShort(
                  data.transactions
                    .filter((t) => t.type === "earn")
                    .reduce((sum, t) => sum + t.amount, 0),
                )}
                tone="earn"
              />
              <StatCard
                label="Total redeemed"
                value={formatCreditsShort(
                  data.transactions
                    .filter((t) => t.type === "redeem")
                    .reduce((sum, t) => sum + t.amount, 0),
                )}
                tone="redeem"
              />
            </StatGrid>
            <TransactionList transactions={data.transactions} title="All transactions" />
            <WalletActivityTimeline items={data.timeline} />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
