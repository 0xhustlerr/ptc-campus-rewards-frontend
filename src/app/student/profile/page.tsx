"use client";

import { AccountProfileCard } from "@/components/profile/AccountProfileCard";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Card } from "@/components/shared/Card";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EarnInfoCard } from "@/components/wallet/EarnInfoCard";
import { StudentStatsGrid } from "@/components/wallet/StudentStatsGrid";
import { useStudentWalletContext } from "@/contexts/StudentWalletContext";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { getCurrentUser } from "@/lib/api/auth";
import { formatWalletStatus } from "@/lib/formatters";

export default function StudentProfilePage() {
  const { data, isLoading, error, refresh } = useStudentWalletContext();
  const accountQuery = useAsyncQuery(() => getCurrentUser());

  return (
    <>
      <PageHeader as="h1" title="Profile" description="Your campus rewards account" />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading profile…"
        errorTitle="Unable to load profile"
      >
        {data && (
          <div className="space-y-4">
            <Card title="Program details">
              <KeyValueList
                items={[
                  { label: "Campus", value: data.profile.campus },
                  { label: "Program", value: data.profile.program },
                  { label: "Cohort", value: data.profile.cohort },
                  { label: "Wallet ID", value: data.profile.walletId, valueClassName: "font-mono text-xs" },
                  {
                    label: "Wallet status",
                    value: formatWalletStatus(data.wallet.status),
                    valueClassName: "text-emerald-700",
                  },
                ]}
              />
            </Card>

            <StudentStatsGrid stats={data.stats} />
            <EarnInfoCard />

            <AsyncBoundary
              isLoading={accountQuery.isLoading}
              error={accountQuery.error}
              onRetry={accountQuery.refresh}
              loadingMessage="Loading account…"
              errorTitle="Unable to load account"
            >
              {accountQuery.data && <AccountProfileCard user={accountQuery.data} />}
            </AsyncBoundary>
            <ChangePasswordForm />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
