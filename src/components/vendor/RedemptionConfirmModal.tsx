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
};

export function RedemptionConfirmModal({
  open,
  wallet,
  item,
  onConfirm,
  onCancel,
  isProcessing,
}: RedemptionConfirmModalProps) {
  if (!open || !item) return null;

  const newBalance = wallet.balance - item.creditsCost;
  const insufficient = newBalance < 0;

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

        {wallet.expiresInSeconds !== undefined && (
          <p className="mt-3 text-xs text-amber-700">
            QR session expires in {wallet.expiresInSeconds}s — confirm while valid.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={insufficient || isProcessing}
            className="flex-1"
          >
            {isProcessing ? "Processing…" : "Confirm deduction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
