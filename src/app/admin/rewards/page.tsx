"use client";

import { RewardCatalogTable } from "@/components/admin/RewardCatalogTable";
import { RewardRulesTable } from "@/components/admin/RewardRulesTable";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { mapRewardItem, mapRewardRule } from "@/lib/api/mappers";
import { getEarningRulesList } from "@/lib/api/staff";
import { getRewardsCatalog } from "@/lib/api/rewards";
import { CatalogRewardItem, RewardRule } from "@/lib/types";

type RewardsData = { rules: RewardRule[]; items: CatalogRewardItem[] };

async function loadRewards(): Promise<RewardsData> {
  const [rules, items] = await Promise.all([getEarningRulesList(), getRewardsCatalog()]);
  return {
    rules: rules.map(mapRewardRule),
    items: items.map(mapRewardItem),
  };
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
            <RewardRulesTable rules={data.rules} />
            <RewardCatalogTable items={data.items} />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
