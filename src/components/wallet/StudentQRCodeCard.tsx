"use client";

import QRCode from "react-qr-code";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { ErrorState, LoadingState } from "@/components/shared/FeedbackStates";
import { useQRCodeSession } from "@/hooks/useQRCodeSession";

export function StudentQRCodeCard() {
  const { qrValue, secondsLeft, isExpired, isLoading, error, refreshSession, isReady } =
    useQRCodeSession();

  if (isLoading) {
    return (
      <Card title="Campus QR" subtitle="Show this at approved vendors to redeem rewards">
        <LoadingState message="Preparing secure QR…" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Campus QR" subtitle="Show this at approved vendors to redeem rewards">
        <div className="space-y-3">
          <ErrorState title="QR unavailable" message={error} />
          <Button type="button" variant="secondary" onClick={refreshSession}>
            Try again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Campus QR" subtitle="Show this at approved vendors to redeem rewards">
      <div className="flex flex-col items-center gap-4">
        {isReady && !isExpired ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <QRCode value={qrValue} size={168} level="M" />
          </div>
        ) : (
          <div className="flex h-[200px] w-full max-w-[200px] items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-center text-sm font-medium text-amber-900">
            QR expired — refresh to redeem.
          </div>
        )}
        <p className="text-center text-sm text-slate-600">
          {isExpired ? (
            <span className="font-semibold text-amber-800">QR expired — refresh to redeem.</span>
          ) : (
            <>
              QR refreshes in{" "}
              <span className="font-semibold text-slate-900">{secondsLeft}s</span>
            </>
          )}
        </p>
        <p className="text-center text-xs text-slate-500">
          Session-based code only. No personal details are stored in the QR.
        </p>
        <Button type="button" variant="secondary" onClick={refreshSession} className="w-full sm:w-auto">
          Refresh QR
        </Button>
      </div>
    </Card>
  );
}
