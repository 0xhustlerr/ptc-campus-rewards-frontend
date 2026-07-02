"use client";

import { useCallback, useRef, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapIssueToIssuedReward } from "@/lib/api/mappers";
import { issueReward } from "@/lib/api/staff";
import type { EarningRule, IssuedReward, StaffStudent } from "@/lib/types";

export type IssueRewardParams = {
  student: StaffStudent;
  rule: EarningRule;
  note: string;
  issuedBy: string;
};

export function useIssueReward() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentIssued, setRecentIssued] = useState<IssuedReward[]>([]);
  const inFlightRef = useRef(false);
  // Keep a stable idempotency key tied to the operation identity so that a
  // retry after a lost/timed-out response reuses the same key (the backend
  // dedupes it) instead of double-issuing credits. The key is only rotated
  // when the operation changes or after a confirmed success.
  const pendingKeyRef = useRef<{ signature: string; key: string } | null>(null);

  const submit = useCallback(async ({ student, rule, note, issuedBy }: IssueRewardParams) => {
    if (inFlightRef.current) {
      return { success: false as const, error: "Please wait for the current submission." };
    }

    inFlightRef.current = true;
    setIsSubmitting(true);

    const signature = `${student.id}|${rule.id}|${note ?? ""}`;
    if (pendingKeyRef.current?.signature !== signature) {
      pendingKeyRef.current = { signature, key: crypto.randomUUID() };
    }
    const idempotencyKey = pendingKeyRef.current.key;

    try {
      const response = await issueReward({
        student_id: student.id,
        earning_rule_id: rule.id,
        notes: note || null,
        idempotency_key: idempotencyKey,
      });

      const issued = mapIssueToIssuedReward(response, student, rule, note, issuedBy);
      setRecentIssued((prev) => [issued, ...prev].slice(0, 20));
      // Success confirmed — the next issue (even with identical params) is a
      // new operation and must use a fresh key.
      pendingKeyRef.current = null;

      return {
        success: true as const,
        newBalance: Number.parseFloat(response.new_balance),
        issued,
      };
    } catch (err) {
      return {
        success: false as const,
        error: getUserFacingErrorMessage(err, "Unable to issue reward."),
      };
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, recentIssued };
}
