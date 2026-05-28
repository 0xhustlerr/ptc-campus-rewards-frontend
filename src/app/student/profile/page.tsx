"use client";

import { Card } from "@/components/shared/Card";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EarnInfoCard } from "@/components/wallet/EarnInfoCard";
import { StudentStatsGrid } from "@/components/wallet/StudentStatsGrid";
import { useStudentWalletContext } from "@/contexts/StudentWalletContext";
import { formatWalletStatus } from "@/lib/formatters";

export default function StudentProfilePage() {
  const { data, isLoading, error, refresh } = useStudentWalletContext();

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
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-800">
                  {data.profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{data.profile.name}</h2>
                  <p className="text-sm text-slate-600">{data.profile.email}</p>
                </div>
              </div>
            </Card>

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
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
