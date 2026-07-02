"use client";

import { Button } from "@/components/shared/Button";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { formatCreditsShort } from "@/lib/formatters";
import { CatalogRewardItem, ScannedWallet } from "@/lib/types";

type RedemptionConfirmModalProps = {
  open: boolean;
  wallet: ScannedWallet;
  item: CatalogRewardItem | null;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  /** Live seconds remaining on the QR session; when <= 0 confirmation is blocked. */
  remainingSeconds?: number;
};

export function RedemptionConfirmModal({
  open,
  wallet,
  item,
  onConfirm,
  onCancel,
  isProcessing,
  remainingSeconds,
}: RedemptionConfirmModalProps) {
  if (!open || !item) return null;

  const newBalance = wallet.balance - item.creditsCost;
  const insufficient = newBalance < 0;
  const displaySeconds = remainingSeconds ?? wallet.expiresInSeconds;
  const expired = displaySeconds !== undefined && displaySeconds <= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-redemption-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="confirm-redemption-title" className="text-lg font-bold text-slate-900">
          Confirm redemption
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review before deducting PTC Credits. This action cannot be undone in the demo.
        </p>

        <KeyValueList
          className="mt-4 rounded-xl bg-slate-50 p-3"
          items={[
            { label: "Student", value: wallet.studentName },
            { label: "Item", value: item.name },
            {
              label: "Cost",
              value: `−${formatCreditsShort(item.creditsCost)}`,
              valueClassName: "text-amber-700 font-semibold",
            },
            {
              label: "New balance",
              value: insufficient ? "Insufficient" : formatCreditsShort(newBalance),
              valueClassName: insufficient ? "text-red-700 font-bold" : "text-sky-800 font-bold",
            },
          ]}
        />

        {displaySeconds !== undefined && (
          <p className={`mt-3 text-xs ${expired ? "text-red-700" : "text-amber-700"}`}>
            {expired
              ? "QR session expired — ask the student to refresh their QR."
              : `QR session expires in ${displaySeconds}s — confirm while valid.`}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={insufficient || isProcessing || expired}
            className="flex-1"
          >
            {isProcessing ? "Processing…" : "Confirm deduction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
