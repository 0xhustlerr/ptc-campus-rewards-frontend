"use client";

import { useCallback, useRef, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapRedemptionReceipt, mapRewardItem, mapVendorScan } from "@/lib/api/mappers";
import { getScanFailureMessage, normalizeQrSessionToken } from "@/lib/api/qr-token";
import { getRewardsCatalog } from "@/lib/api/rewards";
import { redeemReward, scanQr } from "@/lib/api/vendor";
import type { CatalogRewardItem, ScannedWallet } from "@/lib/types";

export function useVendorScanner() {
  const [wallet, setWallet] = useState<ScannedWallet | null>(null);
  const [catalog, setCatalog] = useState<CatalogRewardItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redeemInFlightRef = useRef(false);

  const loadCatalog = useCallback(async () => {
    const items = await getRewardsCatalog();
    setCatalog(items.filter((i) => i.active).map(mapRewardItem));
  }, []);

  const scan = useCallback(
    async (rawToken: string) => {
      const qrSessionToken = normalizeQrSessionToken(rawToken);
      if (!qrSessionToken) {
        const message = "Invalid QR code. Scan the student's campus QR or paste the session token only.";
        setError(message);
        return { success: false as const, error: message };
      }

      setIsScanning(true);
      setError(null);
      setWallet(null);

      try {
        const [scanResult, catalogItems] = await Promise.all([
          scanQr({ qr_session_token: qrSessionToken }),
          getRewardsCatalog(),
        ]);
        const mappedCatalog = catalogItems.filter((i) => i.active).map(mapRewardItem);
        setCatalog(mappedCatalog);
        const mapped = mapVendorScan(scanResult, qrSessionToken);
        if (!scanResult.session_valid) {
          const reason = getScanFailureMessage(scanResult.reason);
          setError(reason);
          setWallet(mapped);
          return { success: false as const, wallet: mapped, error: reason };
        }
        setWallet(mapped);
        return { success: true as const, wallet: mapped, catalog: mappedCatalog };
      } catch (err) {
        const message = getUserFacingErrorMessage(err, "Scan failed. Please try again.");
        setError(message);
        return { success: false as const, error: message };
      } finally {
        setIsScanning(false);
      }
    },
    [],
  );

  const redeem = useCallback(async (qrSessionToken: string, rewardItemId: string) => {
    if (redeemInFlightRef.current) {
      return { success: false as const, error: "Redemption already in progress." };
    }

    const token = normalizeQrSessionToken(qrSessionToken);
    if (!token) {
      return { success: false as const, error: "QR session is invalid. Scan again." };
    }

    redeemInFlightRef.current = true;
    setIsRedeeming(true);
    setError(null);
    const idempotencyKey = crypto.randomUUID();

    try {
      const receipt = await redeemReward({
        qr_session_token: token,
        reward_item_id: rewardItemId,
        idempotency_key: idempotencyKey,
      });
      const mapped = mapRedemptionReceipt(receipt);
      setWallet((prev) => (prev ? { ...prev, balance: mapped.newBalance } : prev));
      return { success: true as const, receipt: mapped };
    } catch (err) {
      const message = getUserFacingErrorMessage(err, "Redemption failed.");
      setError(message);
      return { success: false as const, error: message };
    } finally {
      redeemInFlightRef.current = false;
      setIsRedeeming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setWallet(null);
    setError(null);
  }, []);

  return {
    wallet,
    catalog,
    isScanning,
    isRedeeming,
    error,
    scan,
    redeem,
    reset,
    loadCatalog,
  };
}
