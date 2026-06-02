"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/shared/Card";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { IssuedRewardsTable } from "@/components/staff/IssuedRewardsTable";
import { IssueRewardForm } from "@/components/staff/IssueRewardForm";
import { StaffStudentsTable } from "@/components/staff/StaffStudentsTable";
import { StudentSearch } from "@/components/staff/StudentSearch";
import { StudentSelectCard } from "@/components/staff/StudentSelectCard";
import { useAuth } from "@/hooks/useAuth";
import { useEarningRules } from "@/hooks/useEarningRules";
import { useIssueReward } from "@/hooks/useIssueReward";
import { useStaffStudents } from "@/hooks/useStaffStudents";
import { StaffStudent } from "@/lib/types";

export default function StaffRewardsPage() {
  const { currentUser } = useAuth();
  const {
    students,
    isLoading: studentsLoading,
    error: studentsError,
    refresh: refreshStudents,
  } = useStaffStudents();
  const {
    rules,
    isLoading: rulesLoading,
    error: rulesError,
    refresh: refreshRules,
  } = useEarningRules();
  const { recentIssued, submit, isSubmitting } = useIssueReward();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<StaffStudent | null>(null);

  const isLoading = studentsLoading || rulesLoading;
  const error = studentsError ?? rulesError;

  const refresh = () => {
    refreshStudents();
    refreshRules();
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.cohort.toLowerCase().includes(q),
    );
  }, [students, query]);

  const handleSuccess = () => {
    refreshStudents();
    if (selected) {
      const updated = students.find((s) => s.id === selected.id);
      if (updated) setSelected(updated);
    }
  };

  const issuedBy = currentUser?.name ?? currentUser?.email ?? "Staff";

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      loadingMessage="Loading staff dashboard…"
      errorTitle="Staff dashboard unavailable"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <StaffStudentsTable
            students={students}
            selectedId={selected?.id}
            onSelect={setSelected}
          />

          <Card title="Quick search">
            <StudentSearch
              query={query}
              onQueryChange={setQuery}
              results={searchResults}
              onSelect={(student) => {
                setSelected(student);
                setQuery("");
              }}
              selectedId={selected?.id}
            />
          </Card>

          <IssueRewardForm
            student={selected}
            rules={rules}
            issuedBy={issuedBy}
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            onSubmit={submit}
          />

          <IssuedRewardsTable rewards={recentIssued} />
        </div>

        <aside className="min-w-0">
          <StudentSelectCard student={selected} />
        </aside>
      </div>
    </AsyncBoundary>
  );
}
