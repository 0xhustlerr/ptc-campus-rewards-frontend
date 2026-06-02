"use client";

import { useEffect, useState } from "react";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { FormField, Input } from "@/components/shared/FormField";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { EarningRule, EarningRuleCreate, EarningRuleUpdate } from "@/lib/api/types";

type EarningRuleFormModalProps = {
  open: boolean;
  rule: EarningRule | null;
  onClose: () => void;
  onSave: (payload: EarningRuleCreate | { id: string; body: EarningRuleUpdate }) => Promise<void>;
};

type FormState = {
  code: string;
  name: string;
  tokenAmount: string;
  dailyLimit: string;
  weeklyLimit: string;
  requiresNote: boolean;
  requiresApproval: boolean;
  active: boolean;
};

function emptyForm(): FormState {
  return {
    code: "",
    name: "",
    tokenAmount: "1",
    dailyLimit: "",
    weeklyLimit: "",
    requiresNote: false,
    requiresApproval: false,
    active: true,
  };
}

function fromRule(rule: EarningRule): FormState {
  return {
    code: rule.code,
    name: rule.name,
    tokenAmount: rule.token_amount,
    dailyLimit: rule.daily_limit != null ? String(rule.daily_limit) : "",
    weeklyLimit: rule.weekly_limit != null ? String(rule.weekly_limit) : "",
    requiresNote: rule.requires_note,
    requiresApproval: rule.requires_approval,
    active: rule.active,
  };
}

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number.parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : null;
}

export function EarningRuleFormModal({ open, rule, onClose, onSave }: EarningRuleFormModalProps) {
  const isEdit = rule !== null;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(rule ? fromRule(rule) : emptyForm());
  }, [open, rule]);

  const handleSubmit = async () => {
    setError(null);
    const name = form.name.trim();
    const tokenAmount = form.tokenAmount.trim();
    if (!name) {
      setError("Rule name is required.");
      return;
    }
    if (!tokenAmount || Number.isNaN(Number(tokenAmount))) {
      setError("Enter a valid PTC amount.");
      return;
    }
    if (!isEdit) {
      const code = form.code.trim().toUpperCase();
      if (!code) {
        setError("Rule code is required.");
        return;
      }
      const body: EarningRuleCreate = {
        code,
        name,
        token_amount: tokenAmount,
        daily_limit: parseOptionalInt(form.dailyLimit),
        weekly_limit: parseOptionalInt(form.weeklyLimit),
        requires_note: form.requiresNote,
        requires_approval: form.requiresApproval,
        active: form.active,
      };
      setIsSubmitting(true);
      try {
        await onSave(body);
        onClose();
      } catch (err) {
        setError(getUserFacingErrorMessage(err, "Unable to save rule."));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const body: EarningRuleUpdate = {
      name,
      token_amount: tokenAmount,
      daily_limit: parseOptionalInt(form.dailyLimit),
      weekly_limit: parseOptionalInt(form.weeklyLimit),
      requires_note: form.requiresNote,
      requires_approval: form.requiresApproval,
      active: form.active,
    };
    setIsSubmitting(true);
    try {
      await onSave({ id: rule.id, body });
      onClose();
    } catch (err) {
      setError(getUserFacingErrorMessage(err, "Unable to save rule."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit earning rule" : "Add earning rule"}
      description={
        isEdit
          ? "Update amounts, limits, and availability for staff issuance."
          : "Create a rule staff can use when issuing PTC Credits."
      }
      submitLabel={isEdit ? "Save changes" : "Add rule"}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      {!isEdit && (
        <FormField label="Code" htmlFor="rule-code" hint="Unique identifier, e.g. QUIZ_PASSED">
          <Input
            id="rule-code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="QUIZ_PASSED"
            required
          />
        </FormField>
      )}
      <FormField label="Rule name" htmlFor="rule-name">
        <Input
          id="rule-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </FormField>
      <FormField label="PTC amount" htmlFor="rule-amount">
        <Input
          id="rule-amount"
          type="number"
          min="0"
          step="0.01"
          value={form.tokenAmount}
          onChange={(e) => setForm((f) => ({ ...f, tokenAmount: e.target.value }))}
          required
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Daily limit" htmlFor="rule-daily" hint="Leave blank for no limit">
          <Input
            id="rule-daily"
            type="number"
            min="0"
            step="1"
            value={form.dailyLimit}
            onChange={(e) => setForm((f) => ({ ...f, dailyLimit: e.target.value }))}
          />
        </FormField>
        <FormField label="Weekly limit" htmlFor="rule-weekly" hint="Leave blank for no limit">
          <Input
            id="rule-weekly"
            type="number"
            min="0"
            step="1"
            value={form.weeklyLimit}
            onChange={(e) => setForm((f) => ({ ...f, weeklyLimit: e.target.value }))}
          />
        </FormField>
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.requiresNote}
            onChange={(e) => setForm((f) => ({ ...f, requiresNote: e.target.checked }))}
            className="rounded border-slate-300"
          />
          Requires note when issuing
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.requiresApproval}
            onChange={(e) => setForm((f) => ({ ...f, requiresApproval: e.target.checked }))}
            className="rounded border-slate-300"
          />
          Requires approval before credits post
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="rounded border-slate-300"
          />
          Active (available for staff to issue)
        </label>
      </div>
    </AdminFormModal>
  );
}
