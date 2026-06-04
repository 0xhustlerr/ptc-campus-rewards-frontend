import type {
  AdminOverviewReport,
  CategoryVolumeItem,
  EarningRule as ApiEarningRule,
  LedgerTransaction,
  Redemption as ApiRedemption,
  RewardItem as ApiRewardItem,
  RuleVolumeItem,
  Student as ApiStudent,
  StudentListItem,
  TokenVelocityDay,
  TopStudentItem,
  VendorScanResponse,
  WalletMe,
} from "@/lib/api/types";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import type {
  ActivityTimelineItem,
  AdminRedemption,
  AdminReports,
  AuditLogEntry,
  CatalogCategory,
  CatalogRewardItem,
  EarningRule,
  IssuedReward,
  RedemptionReceipt,
  RewardRule,
  ScannedWallet,
  StaffStudent,
  StudentProfile,
  StudentWallet,
  StudentWalletStats,
  Transaction,
  TransactionType,
  User,
  WalletStatus,
} from "@/lib/types";

export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function mapWalletStatus(status: string): WalletStatus {
  if (status === "frozen" || status === "closed") return "frozen";
  if (status === "pending") return "pending";
  return "active";
}

function mapTransactionType(type: string): TransactionType {
  if (type === "redeem") return "redeem";
  return "earn";
}

function displayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "User";
  return localPart.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function displayNameFromProfiles(user: {
  email: string;
  staff_profile?: { first_name: string; last_name: string } | null;
  student_profile?: { first_name: string; last_name: string } | null;
  vendor_profile?: { name: string } | null;
}): string {
  if (user.staff_profile) {
    return `${user.staff_profile.first_name} ${user.staff_profile.last_name}`.trim();
  }
  if (user.student_profile) {
    return `${user.student_profile.first_name} ${user.student_profile.last_name}`.trim();
  }
  if (user.vendor_profile?.name) {
    return user.vendor_profile.name;
  }
  return displayNameFromEmail(user.email);
}

export function mapUser(user: {
  id: string;
  email: string;
  role: User["role"];
  phone?: string | null;
  staff_profile?: { first_name: string; last_name: string; department: string | null } | null;
  student_profile?: { first_name: string; last_name: string } | null;
  vendor_profile?: { name: string } | null;
}): User {
  const staffProfile = user.staff_profile;
  const name = displayNameFromProfiles(user);

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name,
    campus: "PTC Campus",
    department: staffProfile?.department ?? undefined,
  };
}

export function mapStudentListItem(student: StudentListItem): StaffStudent {
  const name = `${student.first_name} ${student.last_name}`.trim();
  return {
    id: student.id,
    name,
    email: `${student.student_number}@ptc.edu`,
    cohort: student.cohort ?? "—",
    walletId: student.wallet_id ?? "",
    balance: toNumber(student.balance),
    status: student.status === "active" ? "active" : "frozen",
    lastActivity: "—",
  };
}

export function mapStudentProfile(student: ApiStudent, wallet: WalletMe): StudentProfile {
  return {
    userId: student.user_id,
    name: `${student.first_name} ${student.last_name}`.trim(),
    email: student.email ?? `${student.student_number}@ptc.edu`,
    campus: "PTC Campus",
    program: student.program ?? "—",
    cohort: student.cohort ?? "—",
    walletId: wallet.wallet_id,
  };
}

export function mapWalletMe(wallet: WalletMe): StudentWallet {
  return {
    walletId: wallet.wallet_id,
    userId: wallet.student_id,
    studentName: wallet.student_name,
    balance: toNumber(wallet.balance),
    status: mapWalletStatus(wallet.status),
  };
}

export function mapLedgerTransaction(tx: LedgerTransaction, userId: string): Transaction {
  const type = mapTransactionType(tx.transaction_type);
  const source =
    tx.reference_type?.replace(/_/g, " ") ??
    (type === "earn" ? "PTC Credits earned" : "PTC Credits redeemed");
  return {
    id: tx.id,
    userId,
    type,
    source: source.charAt(0).toUpperCase() + source.slice(1),
    amount: toNumber(tx.amount),
    createdAt: tx.created_at,
  };
}

export function mapRewardItem(item: ApiRewardItem): CatalogRewardItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category as CatalogCategory,
    creditsCost: toNumber(item.price_tokens),
    description: `${CATALOG_CATEGORY_LABELS[item.category as CatalogCategory] ?? item.category} reward`,
    vendor: "Campus vendor",
    available: item.active && (item.inventory_count === null || item.inventory_count > 0),
  };
}

export function mapEarningRule(rule: ApiEarningRule): EarningRule {
  return {
    id: rule.id,
    label: rule.name,
    amount: toNumber(rule.token_amount),
    category: "bonus",
    requiresNote: rule.requires_note,
  };
}

export function mapRewardRule(rule: ApiEarningRule): RewardRule {
  return {
    id: rule.id,
    name: rule.name,
    amount: toNumber(rule.token_amount),
    dailyLimit: rule.daily_limit ?? 0,
    active: rule.active,
  };
}

export function mapVendorScan(scan: VendorScanResponse, qrToken: string): ScannedWallet {
  const expiresAt = scan.expires_at ? new Date(scan.expires_at).getTime() : undefined;
  const expiresInSeconds =
    expiresAt !== undefined ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : undefined;

  return {
    sessionValid: scan.session_valid,
    walletId: "",
    studentName: scan.student_display_name ?? "Student",
    balance: toNumber(scan.balance),
    status: mapWalletStatus(scan.wallet_status ?? "active"),
    expiresInSeconds,
    qrSessionToken: qrToken,
  };
}

export function mapRedemptionReceipt(receipt: ApiRedemption): RedemptionReceipt {
  return {
    id: receipt.redemption_id,
    studentName: receipt.student_display_name,
    itemName: receipt.item_name,
    amount: toNumber(receipt.amount),
    balanceBefore: toNumber(receipt.balance_before),
    newBalance: toNumber(receipt.balance_after),
    vendorName: receipt.vendor_name,
    redeemedAt: receipt.redeemed_at,
  };
}

export function buildStudentStats(transactions: Transaction[]): StudentWalletStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let earnedThisWeek = 0;
  let redeemedThisWeek = 0;

  for (const tx of transactions) {
    const at = new Date(tx.createdAt).getTime();
    if (at < weekAgo) continue;
    if (tx.type === "earn") earnedThisWeek += tx.amount;
    else redeemedThisWeek += tx.amount;
  }

  return {
    earnedThisWeek,
    redeemedThisWeek,
    currentStreak: 0,
    perfectAttendanceDays: 0,
    perfectAttendanceTarget: 5,
  };
}

export function buildActivityTimeline(transactions: Transaction[]): ActivityTimelineItem[] {
  return transactions.slice(0, 8).map((tx) => ({
    id: tx.id,
    label: tx.source,
    credits: tx.amount,
    type: tx.type,
    occurredAt: tx.createdAt,
  }));
}

export function mapAdminOverview(overview: AdminOverviewReport): Partial<AdminReports> {
  return {
    totalStudents: overview.total_students,
    totalIssued: toNumber(overview.total_ptc_issued),
    totalRedeemed: toNumber(overview.total_ptc_redeemed),
    outstandingBalance: toNumber(overview.outstanding_ptc_balance),
    redemptionsToday: overview.redemptions_today,
    mostActiveStudent: overview.most_active_student ?? "—",
  };
}

export function mapEarnedByRule(items: RuleVolumeItem[]): AdminReports["tokensEarnedByRule"] {
  return items.map((row) => ({ rule: row.rule, amount: toNumber(row.total_ptc) }));
}

export function mapRedeemedByCategory(items: CategoryVolumeItem[]): AdminReports["tokensRedeemedByCategory"] {
  return items.map((row) => ({
    category: row.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    amount: toNumber(row.total_ptc),
  }));
}

export function mapTokenVelocity(series: TokenVelocityDay[]): AdminReports["weeklyTransactionVolume"] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return series.map((row) => {
    const date = new Date(row.date);
    return {
      day: dayNames[date.getDay()] ?? row.date,
      count: row.transaction_count,
    };
  });
}

export function mapTopStudents(items: TopStudentItem[]): AdminReports["topActiveStudents"] {
  return items.map((row) => ({
    name: row.student_name,
    activityCount: row.transaction_count,
  }));
}

export function mapLedgerToAdminRedemption(tx: LedgerTransaction): AdminRedemption | null {
  if (tx.transaction_type !== "redeem") return null;
  return {
    id: tx.id,
    date: tx.created_at,
    studentName: tx.reference_id ?? "Student",
    vendor: "Campus vendor",
    item: tx.reference_type ?? "Redemption",
    amount: toNumber(tx.amount),
    status: tx.status === "posted" ? "completed" : "pending",
  };
}

export function mapAuditLog(log: {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
}): AuditLogEntry {
  return {
    id: log.id,
    actor: log.actor_user_id ?? "system",
    action: log.action,
    entity: log.entity_type + (log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ""),
    timestamp: log.created_at,
  };
}

export function mapIssueToIssuedReward(
  response: { earning_event_id: string; amount: string; new_balance: string },
  student: StaffStudent,
  rule: EarningRule,
  note: string,
  issuedBy: string,
): IssuedReward {
  return {
    id: response.earning_event_id,
    studentId: student.id,
    studentName: student.name,
    ruleId: rule.id,
    ruleLabel: rule.label,
    amount: toNumber(response.amount),
    note,
    issuedBy,
    issuedAt: new Date().toISOString(),
  };
}
