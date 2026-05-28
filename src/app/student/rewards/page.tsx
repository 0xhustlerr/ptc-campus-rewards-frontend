"use client";

import { useState } from "react";

import { RewardCatalog } from "@/components/reward/RewardCatalog";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { CategoryPills } from "@/components/shared/CategoryPills";
import { PageHeader } from "@/components/shared/PageHeader";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { useStudentWalletContext } from "@/contexts/StudentWalletContext";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import { CatalogCategory } from "@/lib/types";

const CATEGORY_OPTIONS = [
  { value: "all" as const, label: "All" },
  ...(Object.entries(CATALOG_CATEGORY_LABELS) as [CatalogCategory, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export default function StudentRewardsPage() {
  const { data, isLoading, error, refresh } = useStudentWalletContext();
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_OPTIONS)[number]["value"]>(
    "all",
  );

  return (
    <>
      <PageHeader
        as="h1"
        title="Rewards catalog"
        description="Redeem PTC Credits for food, supplies, and campus perks"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading rewards…"
        errorTitle="Unable to load rewards"
      >
        {data && (
          <div className="space-y-4">
            <WalletBalanceCard
              studentName={data.wallet.studentName}
              balance={data.wallet.balance}
              status={data.wallet.status}
              walletId={data.wallet.walletId}
            />
            <CategoryPills
              options={CATEGORY_OPTIONS}
              value={activeCategory}
              onChange={setActiveCategory}
            />
            <RewardCatalog
              items={data.catalog}
              balance={data.wallet.balance}
              filterCategory={activeCategory === "all" ? undefined : activeCategory}
            />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
