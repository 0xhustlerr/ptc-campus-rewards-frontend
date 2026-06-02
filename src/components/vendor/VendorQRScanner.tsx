"use client";

import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { FormField, Input } from "@/components/shared/FormField";
import { useQrCameraScanner } from "@/hooks/useQrCameraScanner";

type VendorQRScannerProps = {
  onScan: (qrSessionToken: string) => void;
  isScanning?: boolean;
  /** Pause the camera while a wallet is loaded or redemption is in progress. */
  cameraPaused?: boolean;
  /** Show a success overlay after the session was verified (camera stays paused). */
  scanSucceeded?: boolean;
  studentName?: string;
  /** Show completion overlay after redemption receipt is shown. */
  redemptionComplete?: boolean;
};

export function VendorQRScanner({
  onScan,
  isScanning = false,
  cameraPaused = false,
  scanSucceeded = false,
  studentName,
  redemptionComplete = false,
}: VendorQRScannerProps) {
  const [token, setToken] = useState("");
  const [showManual, setShowManual] = useState(false);

  const paused = cameraPaused || isScanning;

  const { videoRef, status, error, retry, clearCooldown } = useQrCameraScanner({
    onDetect: onScan,
    paused,
    disabled: false,
  });

  const submitManual = () => {
    const value = token.trim();
    if (!value) {
      return;
    }
    clearCooldown();
    onScan(value);
    setToken("");
  };

  const statusLabel =
    status === "starting"
      ? "Starting camera…"
      : status === "active"
        ? "Point at student QR"
        : status === "error"
          ? "Camera unavailable"
          : null;

  const showSuccessOverlay = scanSucceeded && !isScanning && status === "paused";
  const showCompleteOverlay = redemptionComplete && !isScanning && status === "paused";

  return (
    <Card title="Scan student QR" subtitle="Use your camera or enter the session token manually">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-56 w-full max-w-sm overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
            aria-label="Camera preview for QR scanning"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-xl border-2 border-sky-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]" />
          </div>
          {status === "active" && (
            <div
              className="pointer-events-none absolute left-4 right-4 top-1/2 h-0.5 animate-pulse bg-sky-400/70"
              aria-hidden
            />
          )}
          {showSuccessOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-emerald-950/85 px-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white"
                aria-hidden
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center text-sm font-semibold text-emerald-50">QR scanned successfully</p>
              {studentName && (
                <p className="text-center text-xs text-emerald-200/90">
                  {studentName} — select an item to redeem
                </p>
              )}
            </div>
          )}
          {showCompleteOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/85 px-4">
              <p className="text-center text-sm font-semibold text-slate-100">Redemption complete</p>
              <p className="text-center text-xs text-slate-300">Tap Done on the receipt to scan another student</p>
            </div>
          )}
          {statusLabel && status !== "active" && !showSuccessOverlay && !showCompleteOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 px-4">
              <p className="text-center text-sm font-medium text-slate-200">{statusLabel}</p>
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70">
              <p className="text-sm font-semibold text-sky-200">Verifying session…</p>
            </div>
          )}
        </div>

        {error && (
          <div className="w-full space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <p>{error}</p>
            <Button type="button" variant="secondary" onClick={retry} className="w-full sm:w-auto">
              Retry camera
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">
          QR sessions expire quickly. Only session tokens are scanned — never student IDs or emails.
        </p>

        {showManual ? (
          <div className="w-full space-y-3">
            <FormField label="QR session token" htmlFor="qr-token">
              <Input
                id="qr-token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token from student QR"
                className="w-full font-mono text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitManual();
                  }
                }}
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={submitManual}
                disabled={isScanning || !token.trim()}
                className="flex-1 sm:flex-none"
              >
                {isScanning ? "Scanning…" : "Submit token"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowManual(false)}
                className="flex-1 sm:flex-none"
              >
                Hide manual entry
              </Button>
            </div>
          </div>
        ) : (
          <Button type="button" variant="secondary" onClick={() => setShowManual(true)} className="w-full sm:w-auto">
            Enter token manually
          </Button>
        )}
      </div>
    </Card>
  );
}
