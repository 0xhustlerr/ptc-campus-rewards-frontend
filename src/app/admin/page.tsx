"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { StatGrid } from "@/components/shared/StatCard";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { formatCredits } from "@/lib/formatters";

export default function AdminOverviewPage() {
  const { reports, isLoading, error, refresh } = useAdminOverview();

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      loadingMessage="Loading admin overview…"
      errorTitle="Overview unavailable"
    >
      {reports && (
        <StatGrid columns={2}>
          <AdminMetricCard label="Total students" value={reports.totalStudents ?? 0} />
          <AdminMetricCard label="Total PTC issued" value={formatCredits(reports.totalIssued ?? 0)} />
          <AdminMetricCard label="Total PTC redeemed" value={formatCredits(reports.totalRedeemed ?? 0)} />
          <AdminMetricCard
            label="Outstanding balance"
            value={formatCredits(reports.outstandingBalance ?? 0)}
          />
          <AdminMetricCard label="Redemptions today" value={reports.redemptionsToday ?? 0} />
          <AdminMetricCard
            label="Most active student"
            value={reports.mostActiveStudent ?? "—"}
            hint="By campus activity this week"
          />
        </StatGrid>
      )}
    </AsyncBoundary>
  );
}
