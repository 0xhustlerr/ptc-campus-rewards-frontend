/**
 * @deprecated Dev-only legacy helpers. Production QR uses POST /wallets/me/qr-session.
 * Do not import from production pages.
 */

import { WalletQrSession } from "@/lib/types";

export function createWalletQrSession(_walletId: string): WalletQrSession {
  void _walletId;
  const sessionToken = `ptc_sess_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const expiresAt = Date.now() + 60_000;
  return { sessionToken, expiresAt };
}

export function encodeQrPayload(session: WalletQrSession): string {
  return JSON.stringify({ v: 1, t: session.sessionToken, exp: session.expiresAt });
}

export function getSecondsUntilExpiry(expiresAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}
