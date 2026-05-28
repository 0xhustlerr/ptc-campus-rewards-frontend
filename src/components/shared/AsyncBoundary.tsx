import { ReactNode } from "react";

import { Button } from "@/components/shared/Button";
import { ErrorState, LoadingState } from "@/components/shared/FeedbackStates";

type AsyncBoundaryProps = {
  isLoading: boolean;
  error: string | null;
  loadingMessage?: string;
  errorTitle?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function AsyncBoundary({
  isLoading,
  error,
  loadingMessage,
  errorTitle = "Unable to load",
  onRetry,
  children,
}: AsyncBoundaryProps) {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (error) {
    return (
      <div className="space-y-3">
        <ErrorState title={errorTitle} message={error} />
        {onRetry && (
          <Button type="button" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }
  return <>{children}</>;
}
