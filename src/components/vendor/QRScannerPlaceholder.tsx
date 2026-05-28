"use client";

import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { FormField, Input } from "@/components/shared/FormField";

type QRScannerPlaceholderProps = {
  onScan: (qrSessionToken: string) => void;
  isScanning?: boolean;
};

export function QRScannerPlaceholder({ onScan, isScanning }: QRScannerPlaceholderProps) {
  const [token, setToken] = useState("");

  return (
    <Card title="Scan student QR" subtitle="Enter or scan the student's session QR code">
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative flex h-56 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-900"
          aria-hidden
        >
          <div className="absolute inset-8 rounded-xl border-2 border-sky-400/80" />
          <div className="absolute left-0 right-0 top-1/2 h-0.5 animate-pulse bg-sky-400/60" />
          <p className="relative z-10 text-sm font-medium text-slate-300">Scanner preview</p>
        </div>
        <p className="text-center text-xs text-slate-500">
          QR sessions expire quickly. Only session tokens are scanned — never student IDs or emails.
        </p>
        <FormField label="QR session token" htmlFor="qr-token">
          <Input
            id="qr-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste token from student QR"
            className="w-full font-mono text-xs"
          />
        </FormField>
        <Button
          type="button"
          onClick={() => token.trim() && onScan(token.trim())}
          disabled={isScanning || !token.trim()}
          className="w-full sm:w-auto"
        >
          {isScanning ? "Scanning…" : "Scan QR"}
        </Button>
      </div>
    </Card>
  );
}
