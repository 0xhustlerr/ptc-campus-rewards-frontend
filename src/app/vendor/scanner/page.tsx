"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { ErrorState } from "@/components/shared/FeedbackStates";
import { VendorQRScanner } from "@/components/vendor/VendorQRScanner";
import { RedemptionConfirmModal } from "@/components/vendor/RedemptionConfirmModal";
import { RedemptionReceipt } from "@/components/vendor/RedemptionReceipt";
import { ScannedWalletCard } from "@/components/vendor/ScannedWalletCard";
import { VendorDailySummary } from "@/components/vendor/VendorDailySummary";
import { VendorItemSelector } from "@/components/vendor/VendorItemSelector";
import { useVendorRedemptions } from "@/hooks/useVendorRedemptions";
import { useVendorScanner } from "@/hooks/useVendorScanner";
import { RedemptionReceipt as Receipt } from "@/lib/types";

export default function VendorScannerPage() {
  const { summary, refresh: refreshSummary } = useVendorRedemptions();
  const {
    wallet,
    catalog,
    isScanning,
    isRedeeming,
    error: scanError,
    scan,
    redeem,
    reset,
  } = useVendorScanner();

  const [selectedItemId, setSelectedItemId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const handleScan = async (qrSessionToken: string) => {
    setFailure(null);
    setReceipt(null);
    const result = await scan(qrSessionToken);
    if (!result.success) {
      setFailure(result.error ?? "Scan failed.");
      return;
    }
    const items = "catalog" in result && result.catalog ? result.catalog : catalog;
    const firstAvailable = items.find((i) => i.available);
    if (firstAvailable) setSelectedItemId(firstAvailable.id);
  };

  // Live clock so the QR-session expiry is re-evaluated every second while the
  // wallet/confirm modal is open, rather than frozen at scan time.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!wallet?.expiresAt) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [wallet?.expiresAt]);

  const selectedItem = catalog.find((i) => i.id === selectedItemId) ?? null;
  const qrToken = wallet?.qrSessionToken ?? "";
  const remainingSeconds =
    wallet?.expiresAt !== undefined
      ? Math.max(0, Math.floor((wallet.expiresAt - now) / 1000))
      : wallet?.expiresInSeconds;
  const sessionExpired =
    wallet != null && (remainingSeconds === undefined || remainingSeconds <= 0);
  const canRedeem = Boolean(wallet?.sessionValid && !sessionExpired && qrToken);

  const handleConfirm = async () => {
    if (!wallet || !selectedItem || !qrToken || !canRedeem) {
      setModalOpen(false);
      setFailure("QR session expired — ask the student to refresh their QR.");
      return;
    }
    setFailure(null);
    const result = await redeem(qrToken, selectedItem.id);
    setModalOpen(false);

    if (!result.success) {
      setFailure(result.error ?? "Redemption failed.");
      return;
    }

    setReceipt(result.receipt);
    refreshSummary();
  };

  const resetFlow = () => {
    reset();
    setReceipt(null);
    setFailure(null);
    setSelectedItemId("");
  };

  const displayError = failure ?? scanError;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <VendorQRScanner
          onScan={handleScan}
          isScanning={isScanning}
          cameraPaused={Boolean(receipt) || canRedeem}
          scanSucceeded={canRedeem && !receipt}
          studentName={wallet?.studentName}
          redemptionComplete={Boolean(receipt)}
        />
        <VendorDailySummary summary={summary} />
      </div>

      <div className="space-y-4">
        {displayError && <ErrorState title="Redemption failed" message={displayError} />}

        {receipt ? (
          <RedemptionReceipt receipt={receipt} onDone={resetFlow} />
        ) : wallet && canRedeem ? (
          <>
            <ScannedWalletCard wallet={wallet} />
            <Card title="Select item to redeem">
              <VendorItemSelector
                items={catalog}
                selectedId={selectedItemId}
                onSelect={setSelectedItemId}
                balance={wallet.balance}
              />
              <Button
                type="button"
                disabled={!selectedItemId || isRedeeming}
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full"
              >
                Review redemption
              </Button>
            </Card>
          </>
        ) : wallet && (!wallet.sessionValid || sessionExpired) ? (
          <Card>
            <p className="text-sm text-amber-800">
              {scanError ?? "QR session is invalid or expired. Ask the student to refresh their QR."}
            </p>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-slate-600">
              Scan a student QR to load their wallet. Vendor confirmation is required before any
              PTC Credits are deducted.
            </p>
          </Card>
        )}

        {wallet && selectedItem && canRedeem && (
          <RedemptionConfirmModal
            open={modalOpen}
            wallet={wallet}
            item={selectedItem}
            onConfirm={handleConfirm}
            onCancel={() => setModalOpen(false)}
            isProcessing={isRedeeming}
            remainingSeconds={remainingSeconds}
          />
        )}
      </div>
    </div>
  );
}
