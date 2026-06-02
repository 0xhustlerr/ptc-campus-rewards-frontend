"use client";

import { useState } from "react";

import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { getPendingRegistrations, updateUserStatus } from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { User } from "@/lib/api/types";

export default function AdminApprovalsPage() {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, isLoading, error, refresh } = useAsyncQuery(() => getPendingRegistrations());

  const handleAction = async (user: User, nextStatus: "active" | "suspended") => {
    setActionError(null);
    setUpdatingUserId(user.id);
    try {
      await updateUserStatus(user.id, nextStatus);
      refresh();
    } catch (err) {
      setActionError(getUserFacingErrorMessage(err));
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Registration approvals"
        description="Approve or reject pending user registrations"
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
        loadingMessage="Loading pending registrations…"
        errorTitle="Unable to load pending registrations"
      >
        {data && data.length === 0 && (
          <EmptyState
            title="No pending registrations"
            message="New registrations requiring approval will appear here."
          />
        )}
        {data && data.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => {
                  const busy = updatingUserId === user.id;
                  return (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-700">{user.email}</td>
                      <td className="px-4 py-3 capitalize text-slate-700">{user.role}</td>
                      <td className="px-4 py-3 capitalize text-amber-700">{user.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                            onClick={() => handleAction(user, "active")}
                          >
                            {busy ? "Working…" : "Approve"}
                          </Button>
                          <Button
                            variant="secondary"
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                            onClick={() => handleAction(user, "suspended")}
                          >
                            Suspend
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
