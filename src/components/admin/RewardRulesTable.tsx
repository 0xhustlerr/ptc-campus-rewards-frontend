"use client";

import { useState } from "react";

import { EarningRuleFormModal } from "@/components/admin/EarningRuleFormModal";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  createEarningRule,
  updateEarningRule,
} from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { EarningRule, EarningRuleCreate, EarningRuleUpdate } from "@/lib/api/types";
import { toNumber } from "@/lib/api/mappers";

type RewardRulesTableProps = {
  rules: EarningRule[];
  onMutated: () => void;
};

export function RewardRulesTable({ rules, onMutated }: RewardRulesTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EarningRule | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const openCreate = () => {
    setActionError(null);
    setEditingRule(null);
    setModalOpen(true);
  };

  const openEdit = (rule: EarningRule) => {
    setActionError(null);
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleSave = async (
    payload: EarningRuleCreate | { id: string; body: EarningRuleUpdate }
  ) => {
    if ("id" in payload) {
      await updateEarningRule(payload.id, payload.body);
    } else {
      await createEarningRule(payload);
    }
    onMutated();
  };

  const handleRemove = async (rule: EarningRule) => {
    if (
      !window.confirm(
        `Remove "${rule.name}" from active earning rules? Staff will no longer be able to issue credits with this rule.`
      )
    ) {
      return;
    }
    setActionError(null);
    setBusyId(rule.id);
    try {
      await updateEarningRule(rule.id, { active: false });
      onMutated();
    } catch (err) {
      setActionError(getUserFacingErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Card
        title="Earning rules"
        subtitle="Rules staff use when issuing PTC Credits to students"
      >
        <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
          <Button type="button" className="px-3 py-1.5 text-xs" onClick={openCreate}>
            Add rule
          </Button>
        </div>
        {actionError && (
          <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </p>
        )}
        {rules.length === 0 ? (
          <EmptyState title="No rules" message="Add an earning rule to get started." />
        ) : (
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4 font-semibold">Rule name</th>
                  <th className="pb-2 pr-4 font-semibold">Code</th>
                  <th className="pb-2 pr-4 font-semibold">Amount</th>
                  <th className="pb-2 pr-4 font-semibold">Daily limit</th>
                  <th className="pb-2 pr-4 font-semibold">Active</th>
                  <th className="pb-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((rule) => {
                  const busy = busyId === rule.id;
                  const dailyLabel =
                    rule.daily_limit != null ? `${rule.daily_limit}/day` : "No limit";
                  return (
                    <tr key={rule.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">{rule.name}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-600">{rule.code}</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-700">
                        +{toNumber(rule.token_amount)} PTC
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{dailyLabel}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge
                          label={rule.active ? "Active" : "Inactive"}
                          variant={rule.active ? "active" : "inactive"}
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                            onClick={() => openEdit(rule)}
                          >
                            Edit
                          </Button>
                          {rule.active && (
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={busy}
                              className="px-3 py-1.5 text-xs text-red-700"
                              onClick={() => handleRemove(rule)}
                            >
                              {busy ? "Removing…" : "Remove"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <EarningRuleFormModal
        open={modalOpen}
        rule={editingRule}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
