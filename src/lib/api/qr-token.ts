/**
 * Normalize vendor input into a bare QR session token (never a student ID or PII).
 */

const MAX_TOKEN_LENGTH = 256;

/** Legacy client-side QR JSON shape — extract token only, never forward wallet/student ids. */
type LegacyQrPayload = {
  v?: number;
  t?: string;
  exp?: number;
};

export function normalizeQrSessionToken(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_TOKEN_LENGTH) {
    return null;
  }

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as LegacyQrPayload;
      if (typeof parsed.t === "string" && parsed.t.length > 0) {
        return parsed.t.slice(0, MAX_TOKEN_LENGTH);
      }
    } catch {
      return null;
    }
  }

  // Reject obvious PII / wrong payload types
  const lower = trimmed.toLowerCase();
  if (lower.includes("@") || lower.includes("student_id") || lower.includes("wallet_id")) {
    return null;
  }

  return trimmed;
}

export function getScanFailureMessage(reason: string | null | undefined): string {
  switch (reason) {
    case "invalid_token":
      return "QR expired or already used — ask the student to refresh their QR.";
    case "wallet_not_found":
      return "Student wallet not found. Contact campus support.";
    default:
      return "Invalid or expired QR session.";
  }
}
