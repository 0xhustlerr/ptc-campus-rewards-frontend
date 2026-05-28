"use client";

import { ReportsOverview } from "@/components/admin/ReportsOverview";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAdminReports } from "@/hooks/useAdminReports";

export default function AdminReportsPage() {
  const { reports, isLoading, error, refresh } = useAdminReports();

  return (
    <>
      <PageHeader
        title="Reports"
        description="Campus rewards program insights"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading reports…"
        errorTitle="Unable to load reports"
      >
        {reports && <ReportsOverview reports={reports} />}
      </AsyncBoundary>
    </>
  );
}
