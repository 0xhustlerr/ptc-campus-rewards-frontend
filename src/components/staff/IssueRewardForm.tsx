"use client";

import { FormEvent, useMemo, useState } from "react";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { FormField, Textarea } from "@/components/shared/FormField";
import { EarningRuleSelect } from "@/components/staff/EarningRuleSelect";
import type { IssueRewardParams } from "@/hooks/useIssueReward";
import { EarningRule, StaffStudent } from "@/lib/types";

type IssueRewardFormProps = {
  student: StaffStudent | null;
  rules: EarningRule[];
  issuedBy: string;
  onSuccess: () => void;
  isSubmitting: boolean;
  onSubmit: (params: IssueRewardParams) => Promise<
    | { success: true; newBalance: number; issued: { amount: number } }
    | { success: false; error: string }
  >;
};

export function IssueRewardForm({
  student,
  rules,
  issuedBy,
  onSuccess,
  isSubmitting,
  onSubmit,
}: IssueRewardFormProps) {
  const [ruleId, setRuleId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedRule = useMemo(() => rules.find((r) => r.id === ruleId), [rules, ruleId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!student) {
      setError("Please select a student.");
      return;
    }
    if (!ruleId || !selectedRule) {
      setError("Please select an earning rule.");
      return;
    }
    if (selectedRule.requiresNote && !note.trim()) {
      setError("A note is required for this earning rule.");
      return;
    }

    const result = await onSubmit({
      student,
      rule: selectedRule,
      note: note.trim(),
      issuedBy,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(
      `Issued ${result.issued.amount} PTC Credits to ${student.name}. New balance: ${result.newBalance} PTC Credits.`,
    );
    setRuleId("");
    setNote("");
    onSuccess();
  };

  return (
    <Card title="Issue PTC Credits" subtitle="Award credits using approved campus earning rules">
      <form onSubmit={handleSubmit} className="space-y-4">
        <EarningRuleSelect
          rules={rules}
          value={ruleId}
          onChange={setRuleId}
          amountPreview={selectedRule?.amount}
        />

        <FormField
          label={selectedRule?.requiresNote ? "Notes (required)" : "Notes (optional)"}
          htmlFor="reward-note"
        >
          <Textarea
            id="reward-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              selectedRule?.requiresNote
                ? "Required: describe what the student did"
                : "Optional: add context for this issuance"
            }
            aria-label="Reward notes"
          />
        </FormField>

        {error && <AlertBanner variant="error" message={error} />}
        {success && <AlertBanner variant="success" message={success} />}

        <Button type="submit" disabled={isSubmitting || !student} className="w-full sm:w-auto">
          {isSubmitting ? "Issuing…" : "Issue reward"}
        </Button>
      </form>
    </Card>
  );
}
