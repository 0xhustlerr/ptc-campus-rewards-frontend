"use client";

import { StudentsTable } from "@/components/admin/StudentsTable";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { mapStudentListItem } from "@/lib/api/mappers";
import { getAdminStudents } from "@/lib/api/admin";

export default function AdminStudentsPage() {
  const { data: students, isLoading, error, refresh } = useAsyncQuery(async () => {
    const rows = await getAdminStudents();
    return rows.map(mapStudentListItem);
  });

  return (
    <>
      <PageHeader
        title="Students"
        description="Campus wallet accounts and balances"
      />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading students…"
        errorTitle="Unable to load students"
      >
        {students && <StudentsTable students={students} />}
      </AsyncBoundary>
    </>
  );
}
