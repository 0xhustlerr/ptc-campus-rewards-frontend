export type UserRole = "student" | "staff" | "vendor" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campus: string;
  department?: string;
  avatarUrl?: string;
};

export type WalletStatus = "active" | "frozen" | "pending";

export type Wallet = {
  userId: string;
  balance: number;
  pendingCredits: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
};

export type StudentWallet = {
  walletId: string;
  userId: string;
  studentName: string;
  balance: number;
  status: WalletStatus;
};

export type StudentWalletStats = {
  earnedThisWeek: number;
  redeemedThisWeek: number;
  currentStreak: number;
  perfectAttendanceDays: number;
  perfectAttendanceTarget: number;
};

export type StudentProfile = {
  userId: string;
  name: string;
  email: string;
  campus: string;
  program: string;
  cohort: string;
  walletId: string;
};

export type StaffStudent = {
  id: string;
  name: string;
  email: string;
  cohort: string;
  walletId: string;
  balance: number;
  status: WalletStatus;
  lastActivity: string;
};

export type EarningRule = {
  id: string;
  label: string;
  amount: number;
  category: RewardCategory;
  requiresNote?: boolean;
};

export type IssuedReward = {
  id: string;
  studentId: string;
  studentName: string;
  ruleId: string;
  ruleLabel: string;
  amount: number;
  note: string;
  issuedBy: string;
  issuedAt: string;
};

export type IssueRewardInput = {
  studentId: string;
  ruleId: string;
  note: string;
  issuedBy: string;
};

export type IssueRewardResult = {
  success: boolean;
  issuedReward?: IssuedReward;
  newBalance?: number;
  error?: string;
};

export type ScannedWallet = {
  sessionValid: boolean;
  walletId: string;
  studentName: string;
  balance: number;
  status: WalletStatus;
  expiresInSeconds?: number;
  /** Absolute session expiry (epoch ms) for live countdown, unlike the
   * snapshot expiresInSeconds captured at scan time. */
  expiresAt?: number;
  qrSessionToken?: string;
};

export type RedeemRewardInput = {
  walletId: string;
  itemId: string;
  vendorName: string;
};

export type RedeemRewardResult = {
  success: boolean;
  newBalance?: number;
  transaction?: Transaction;
  receipt?: RedemptionReceipt;
  error?: string;
};

export type RedemptionReceipt = {
  id: string;
  studentName: string;
  itemName: string;
  amount: number;
  balanceBefore?: number;
  newBalance: number;
  vendorName: string;
  redeemedAt: string;
};

export type VendorDailySummary = {
  redemptionCount: number;
  totalCreditsRedeemed: number;
  topItem: string;
};

export type RewardCategory =
  | "attendance"
  | "services"
  | "quiz"
  | "sanitation"
  | "mentorship"
  | "bonus";

export type CatalogCategory = "food_truck" | "school_supplies" | "student_perks";

export type RewardEvent = {
  id: string;
  category: RewardCategory;
  title: string;
  credits: number;
  earnedAt: string;
  awardedBy: string;
};

export type TransactionType = "earn" | "redeem";

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  source: string;
  amount: number;
  createdAt: string;
  note?: string;
};

export type RewardOffer = {
  id: string;
  name: string;
  vendor: string;
  creditsCost: number;
  description: string;
  active: boolean;
};

export type CatalogRewardItem = {
  id: string;
  name: string;
  category: CatalogCategory;
  creditsCost: number;
  description: string;
  vendor: string;
  available: boolean;
};

export type RewardRule = {
  id: string;
  name: string;
  amount: number;
  dailyLimit: number;
  active: boolean;
};

export type AdminRedemption = {
  id: string;
  date: string;
  studentName: string;
  vendor: string;
  item: string;
  amount: number;
  status: "completed" | "failed" | "pending";
};

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
};

export type AdminReports = {
  totalStudents: number;
  totalIssued: number;
  totalRedeemed: number;
  outstandingBalance: number;
  redemptionsToday: number;
  mostActiveStudent: string;
  tokensEarnedByRule: Array<{ rule: string; amount: number }>;
  tokensRedeemedByCategory: Array<{ category: string; amount: number }>;
  weeklyTransactionVolume: Array<{ day: string; count: number }>;
  topActiveStudents: Array<{ name: string; activityCount: number }>;
};

export type WalletQrSession = {
  sessionToken: string;
  expiresAt: number;
};

export type ActivityTimelineItem = {
  id: string;
  label: string;
  credits: number;
  type: TransactionType;
  occurredAt: string;
};
