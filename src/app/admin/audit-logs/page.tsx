"use client";

import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuditLogs } from "@/hooks/useAuditLogs";

export default function AdminAuditLogsPage() {
  const { logs, isLoading, error, refresh } = useAuditLogs();

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Administrative actions across the rewards system"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading audit logs…"
        errorTitle="Unable to load audit logs"
      >
        {logs && <AuditLogTable logs={logs} />}
      </AsyncBoundary>
    </>
  );
}
