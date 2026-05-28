"use client";

import { RedemptionsTable } from "@/components/admin/RedemptionsTable";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { mapLedgerToAdminRedemption } from "@/lib/api/mappers";
import { getAdminTransactions } from "@/lib/api/admin";
import type { AdminRedemption } from "@/lib/types";

async function loadRedemptions(): Promise<AdminRedemption[]> {
  const txs = await getAdminTransactions();
  return txs
    .map(mapLedgerToAdminRedemption)
    .filter((r): r is AdminRedemption => r !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function AdminRedemptionsPage() {
  const { data: redemptions, isLoading, error, refresh } = useAsyncQuery(loadRedemptions);

  return (
    <>
      <PageHeader
        title="Redemptions"
        description="Redemption transactions from the campus ledger"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading redemptions…"
        errorTitle="Unable to load redemptions"
      >
        {redemptions && <RedemptionsTable redemptions={redemptions} />}
      </AsyncBoundary>
    </>
  );
}
