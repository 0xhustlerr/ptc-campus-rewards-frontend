"use client";

import { RewardCatalogTable } from "@/components/admin/RewardCatalogTable";
import { RewardRulesTable } from "@/components/admin/RewardRulesTable";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { getAdminEarningRules, getAdminRewardItems } from "@/lib/api/admin";
import type { EarningRule, RewardItem } from "@/lib/api/types";

type RewardsData = { rules: EarningRule[]; items: RewardItem[] };

async function loadRewards(): Promise<RewardsData> {
  const [rules, items] = await Promise.all([getAdminEarningRules(), getAdminRewardItems()]);
  return { rules, items };
}

export default function AdminRewardsPage() {
  const { data, isLoading, error, refresh } = useAsyncQuery(loadRewards);

  return (
    <>
      <PageHeader
        title="Rewards & catalog"
        description="Earning rules and redemption catalog"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading rewards…"
        errorTitle="Unable to load rewards"
      >
        {data && (
          <div className="space-y-6">
            <RewardRulesTable rules={data.rules} onMutated={refresh} />
            <RewardCatalogTable items={data.items} onMutated={refresh} />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
