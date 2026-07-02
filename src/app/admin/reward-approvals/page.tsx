"use client";

import { useState } from "react";

import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import {
  approveEarningEvent,
  getPendingEarningEvents,
  rejectEarningEvent,
} from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";

function formatIssuedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function RewardApprovalsPage() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, isLoading, error, refresh } = useAsyncQuery(() => getPendingEarningEvents());

  const handleAction = async (eventId: string, action: "approve" | "reject") => {
    setActionError(null);
    setBusyId(eventId);
    try {
      if (action === "approve") {
        await approveEarningEvent(eventId);
      } else {
        await rejectEarningEvent(eventId);
      }
      refresh();
    } catch (err) {
      setActionError(getUserFacingErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Reward approvals"
        description="Approve or reject staff-issued rewards that require review before crediting"
      />
      {actionError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </p>
      )}
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading pending rewards…"
        errorTitle="Unable to load pending rewards"
      >
        {data && data.length === 0 && (
          <EmptyState
            title="No rewards awaiting approval"
            message="Rewards issued under rules that require approval will appear here."
          />
        )}
        {data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((event) => {
              const busy = busyId === event.id;
              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">
                        {event.rule_name ?? "Earning rule"} · {event.amount} PTC
                      </p>
                      <p className="text-sm text-slate-600">
                        {event.student_name ?? "Student"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        disabled={busy}
                        className="px-3 py-1.5 text-xs"
                        onClick={() => handleAction(event.id, "approve")}
                      >
                        {busy ? "Working…" : "Approve"}
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={busy}
                        className="px-3 py-1.5 text-xs"
                        onClick={() => handleAction(event.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <KeyValueList
                      items={[
                        { label: "Amount", value: `${event.amount} PTC` },
                        { label: "Note", value: event.notes ?? "—" },
                        { label: "Issued", value: formatIssuedAt(event.created_at) },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
