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

  const submit = useCallback(async ({ student, rule, note, issuedBy }: IssueRewardParams) => {
    if (inFlightRef.current) {
      return { success: false as const, error: "Please wait for the current submission." };
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await issueReward({
        student_id: student.id,
        earning_rule_id: rule.id,
        notes: note || null,
        idempotency_key: idempotencyKey,
      });

      const issued = mapIssueToIssuedReward(response, student, rule, note, issuedBy);
      setRecentIssued((prev) => [issued, ...prev].slice(0, 20));

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
