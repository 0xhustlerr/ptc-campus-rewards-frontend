import {
  MOCK_STUDENT_USER_ID,
  mockAdminRedemptions,
  mockAuditLogs,
  mockEarningRules,
  mockIssuedRewards,
  mockStudentCatalog,
  mockStudentProfiles,
  mockStudentTransactions,
  mockStudentWallets,
} from "@/lib/mock-data";
import {
  AdminRedemption,
  AuditLogEntry,
  IssuedReward,
  IssueRewardInput,
  IssueRewardResult,
  RedeemRewardInput,
  RedeemRewardResult,
  ScannedWallet,
  StudentWallet,
  Transaction,
  Wallet,
} from "@/lib/types";

const wallets = new Map<string, Wallet>(
  mockStudentWallets.map((w) => [w.userId, { ...w }]),
);

let issuedRewards: IssuedReward[] = [...mockIssuedRewards];
let transactions: Transaction[] = [...mockStudentTransactions];
let redemptions: AdminRedemption[] = [...mockAdminRedemptions];
let auditLogs: AuditLogEntry[] = [...mockAuditLogs];
let vendorRedemptionCount = 0;
let vendorCreditsTotal = 0;

export function getWalletsSnapshot(): Wallet[] {
  return Array.from(wallets.values());
}

export function getWalletByUserId(userId: string): Wallet | undefined {
  return wallets.get(userId);
}

export function getStudentWalletRecord(userId: string): StudentWallet | undefined {
  const profile = mockStudentProfiles.find((p) => p.userId === userId);
  const wallet = wallets.get(userId);
  if (!profile || !wallet) return undefined;
  return {
    walletId: profile.walletId,
    userId,
    studentName: profile.name,
    balance: wallet.balance,
    status: "active",
  };
}

export function getIssuedRewardsSnapshot(): IssuedReward[] {
  return [...issuedRewards].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
  );
}

export function getTransactionsSnapshot(): Transaction[] {
  return [...transactions];
}

export function getRedemptionsSnapshot(): AdminRedemption[] {
  return [...redemptions];
}

export function getAuditLogsSnapshot(): AuditLogEntry[] {
  return [...auditLogs];
}

export function getVendorDailySummary() {
  return {
    redemptionCount: vendorRedemptionCount,
    totalCreditsRedeemed: vendorCreditsTotal,
    topItem: vendorRedemptionCount > 0 ? "Sandwich" : "—",
  };
}

function pushAudit(actor: string, action: string, entity: string) {
  auditLogs = [
    {
      id: `audit-${Date.now()}`,
      actor,
      action,
      entity,
      timestamp: new Date().toISOString(),
    },
    ...auditLogs,
  ];
}

export function issueReward(input: IssueRewardInput): IssueRewardResult {
  const rule = mockEarningRules.find((r) => r.id === input.ruleId);
  const profile = mockStudentProfiles.find((p) => p.userId === input.studentId);
  const wallet = wallets.get(input.studentId);

  if (!rule || !profile || !wallet) {
    return { success: false, error: "Invalid student or earning rule." };
  }

  if (!input.note.trim()) {
    return { success: false, error: "A note is required for this reward." };
  }

  const newBalance = wallet.balance + rule.amount;
  wallets.set(input.studentId, {
    ...wallet,
    balance: newBalance,
    lifetimeEarned: wallet.lifetimeEarned + rule.amount,
  });

  const issued: IssuedReward = {
    id: `issued-${Date.now()}`,
    studentId: input.studentId,
    studentName: profile.name,
    ruleId: rule.id,
    ruleLabel: rule.label,
    amount: rule.amount,
    note: input.note.trim(),
    issuedBy: input.issuedBy,
    issuedAt: new Date().toISOString(),
  };

  issuedRewards = [issued, ...issuedRewards];

  const txn: Transaction = {
    id: `txn-${Date.now()}`,
    userId: input.studentId,
    type: "earn",
    source: rule.label,
    amount: rule.amount,
    createdAt: issued.issuedAt,
    note: input.note.trim(),
  };
  transactions = [txn, ...transactions];

  pushAudit(input.issuedBy, `Issued ${rule.amount} PTC`, `${profile.name} · ${rule.label}`);

  return { success: true, issuedReward: issued, newBalance };
}

export function simulateWalletScan(): ScannedWallet {
  const profile = mockStudentProfiles.find((p) => p.userId === MOCK_STUDENT_USER_ID)!;
  const wallet = wallets.get(MOCK_STUDENT_USER_ID)!;
  return {
    sessionValid: true,
    walletId: profile.walletId,
    studentName: profile.name,
    balance: wallet.balance,
    status: "active",
    expiresInSeconds: 47,
  };
}

export function redeemReward(input: RedeemRewardInput): RedeemRewardResult {
  const profile = mockStudentProfiles.find((p) => p.walletId === input.walletId);
  const item = mockStudentCatalog.find((i) => i.id === input.itemId);
  if (!profile || !item) {
    return { success: false, error: "Invalid wallet or item." };
  }

  const wallet = wallets.get(profile.userId);
  if (!wallet) {
    return { success: false, error: "Wallet not found." };
  }

  if (wallet.balance < item.creditsCost) {
    return { success: false, error: "Insufficient PTC Credits for this redemption." };
  }

  const newBalance = wallet.balance - item.creditsCost;
  wallets.set(profile.userId, {
    ...wallet,
    balance: newBalance,
    lifetimeRedeemed: wallet.lifetimeRedeemed + item.creditsCost,
  });

  const redeemedAt = new Date().toISOString();
  const txn: Transaction = {
    id: `txn-redeem-${Date.now()}`,
    userId: profile.userId,
    type: "redeem",
    source: item.name,
    amount: item.creditsCost,
    createdAt: redeemedAt,
    note: input.vendorName,
  };
  transactions = [txn, ...transactions];

  const redemption: AdminRedemption = {
    id: `red-${Date.now()}`,
    date: redeemedAt,
    studentName: profile.name,
    vendor: input.vendorName,
    item: item.name,
    amount: item.creditsCost,
    status: "completed",
  };
  redemptions = [redemption, ...redemptions];
  vendorRedemptionCount += 1;
  vendorCreditsTotal += item.creditsCost;

  pushAudit(input.vendorName, `Redeemed ${item.creditsCost} PTC`, `${profile.name} · ${item.name}`);

  return {
    success: true,
    newBalance,
    transaction: txn,
    receipt: {
      id: redemption.id,
      studentName: profile.name,
      itemName: item.name,
      amount: item.creditsCost,
      newBalance,
      vendorName: input.vendorName,
      redeemedAt,
    },
  };
}
