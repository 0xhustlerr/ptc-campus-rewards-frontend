"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getUserFacingErrorMessage } from "@/lib/api/errors";
import { createQrSession } from "@/lib/api/wallet";

function getSecondsUntilExpiry(expiresAtIso: string): number {
  return Math.max(0, Math.floor((new Date(expiresAtIso).getTime() - Date.now()) / 1000));
}

export function useQRCodeSession() {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadInFlightRef = useRef(false);

  const loadSession = useCallback(async () => {
    if (loadInFlightRef.current) return;
    loadInFlightRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const session = await createQrSession();
      setQrValue(session.qr_session_token);
      setExpiresAt(session.expires_at);
      setSecondsLeft(getSecondsUntilExpiry(session.expires_at));
    } catch (err) {
      setQrValue(null);
      setExpiresAt(null);
      setSecondsLeft(0);
      setError(getUserFacingErrorMessage(err, "Unable to generate QR session."));
    } finally {
      setIsLoading(false);
      loadInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = window.setInterval(() => {
      setSecondsLeft(getSecondsUntilExpiry(expiresAt));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [expiresAt]);

  const isExpired = secondsLeft <= 0 && !isLoading && Boolean(expiresAt);

  return {
    qrValue: qrValue ?? "",
    secondsLeft,
    isExpired,
    isLoading,
    error,
    refreshSession: loadSession,
    isReady: !isLoading && Boolean(qrValue) && !isExpired,
  };
}
