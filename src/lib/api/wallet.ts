import { apiGet, apiPost } from "@/lib/api/client";
import type { PaginatedResponse, QRSession, WalletMe } from "@/lib/api/types";
import type { LedgerTransaction } from "@/lib/api/types";

export async function getWalletMe(): Promise<WalletMe> {
  return apiGet<WalletMe>("/wallets/me");
}

export async function createQrSession(): Promise<QRSession> {
  return apiPost<QRSession>("/wallets/me/qr-session");
}

export async function getWalletTransactions(
  walletId: string,
  page = 1,
  pageSize = 50,
): Promise<PaginatedResponse<LedgerTransaction>> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return apiGet<PaginatedResponse<LedgerTransaction>>(
    `/wallets/${walletId}/transactions?${params.toString()}`,
  );
}
