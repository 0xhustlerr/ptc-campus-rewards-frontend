"use client";

import { ErrorState } from "@/components/shared/FeedbackStates";

export default function StudentError() {
  return (
    <ErrorState
      title="Wallet unavailable"
      message="We could not load your student wallet. Please refresh and try again."
    />
  );
}
