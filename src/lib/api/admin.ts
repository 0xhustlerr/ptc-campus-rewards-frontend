import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import type {
  AdminAccount,
  AdminAdjustmentRequest,
  AdminReversalRequest,
  AuditLog,
  CreateAdminRequest,
  EarningEvent,
  EarningRule,
  EarningRuleCreate,
  EarningRuleUpdate,
  LedgerTransaction,
  RewardItem,
  RewardItemCreate,
  RewardItemUpdate,
  StudentListItem,
  AdminUserStatusUpdate,
  PendingRegistration,
  User,
  WalletRecord,
} from "@/lib/api/types";

export async function getAdminStudents(): Promise<StudentListItem[]> {
  return apiGet<StudentListItem[]>("/admin/students");
}

export async function getAdminWallets(): Promise<WalletRecord[]> {
  return apiGet<WalletRecord[]>("/admin/wallets");
}

export async function getAdminTransactions(): Promise<LedgerTransaction[]> {
  return apiGet<LedgerTransaction[]>("/admin/transactions");
}

export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  return apiGet<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
}

export async function getAdminEarningRules(): Promise<EarningRule[]> {
  return apiGet<EarningRule[]>("/admin/earning-rules");
}

export async function getAdminRewardItems(): Promise<RewardItem[]> {
  return apiGet<RewardItem[]>("/admin/reward-items");
}

export async function createEarningRule(body: EarningRuleCreate): Promise<EarningRule> {
  return apiPost<EarningRule>("/admin/earning-rules", body);
}

export async function updateEarningRule(id: string, body: EarningRuleUpdate): Promise<EarningRule> {
  return apiPatch<EarningRule>(`/admin/earning-rules/${id}`, body);
}

export async function createRewardItem(body: RewardItemCreate): Promise<RewardItem> {
  return apiPost<RewardItem>("/admin/reward-items", body);
}

export async function updateRewardItem(id: string, body: RewardItemUpdate): Promise<RewardItem> {
  return apiPatch<RewardItem>(`/admin/reward-items/${id}`, body);
}

export async function postAdjustment(body: AdminAdjustmentRequest): Promise<LedgerTransaction> {
  return apiPost<LedgerTransaction>("/admin/adjustments", body);
}

export async function postReversal(body: AdminReversalRequest): Promise<LedgerTransaction> {
  return apiPost<LedgerTransaction>("/admin/reversals", body);
}

export async function getPendingRegistrations(): Promise<PendingRegistration[]> {
  return apiGet<PendingRegistration[]>("/admin/users/pending");
}

export async function getPendingEarningEvents(): Promise<EarningEvent[]> {
  return apiGet<EarningEvent[]>("/admin/earning-events/pending");
}

export async function approveEarningEvent(eventId: string): Promise<EarningEvent> {
  return apiPost<EarningEvent>(`/admin/earning-events/${eventId}/approve`, {});
}

export async function rejectEarningEvent(eventId: string): Promise<EarningEvent> {
  return apiPost<EarningEvent>(`/admin/earning-events/${eventId}/reject`, {});
}

export async function getAdminAccounts(): Promise<AdminAccount[]> {
  return apiGet<AdminAccount[]>("/admin/admins");
}

export async function createAdminAccount(body: CreateAdminRequest): Promise<AdminAccount> {
  return apiPost<AdminAccount>("/admin/admins", body);
}

export async function updateUserStatus(
  userId: string,
  body: AdminUserStatusUpdate,
): Promise<User> {
  return apiPatch<User>(`/admin/users/${userId}/status`, body);
}
