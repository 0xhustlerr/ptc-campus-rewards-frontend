"use client";

import { ErrorState } from "@/components/shared/FeedbackStates";

export default function Error() {
  return <ErrorState title="Dashboard unavailable" message="Please refresh and try again." />;
}
