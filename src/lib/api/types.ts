/** API response types aligned with FastAPI Pydantic schemas. */

export type UserRole = "student" | "staff" | "vendor" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";
export type WalletStatus = "active" | "frozen" | "closed";
export type StudentStatus = "active" | "inactive" | "graduated" | "withdrawn";
export type TransactionType = "earn" | "redeem" | "bonus" | "reversal" | "adjustment";
export type RewardCategory = "food_truck" | "school_supplies" | "student_perks";

export type ApiErrorBody = {
  detail: string;
  code: string;
  errors?: Array<Record<string, unknown>>;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

export type User = {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
};

export type Student = {
  id: string;
  user_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  cohort: string | null;
  program: string | null;
  status: StudentStatus;
  email: string | null;
  wallet_id: string | null;
  balance: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentListItem = {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  cohort: string | null;
  program: string | null;
  status: StudentStatus;
  wallet_id: string | null;
  balance: string | null;
};

export type WalletMe = {
  wallet_id: string;
  student_id: string;
  student_name: string;
  student_number: string;
  currency_code: string;
  balance: string;
  status: WalletStatus;
};

export type WalletBalance = {
  wallet_id: string;
  currency_code: string;
  balance: string;
  status: WalletStatus;
};

export type WalletRecord = {
  id: string;
  student_id: string;
  currency_code: string;
  status: WalletStatus;
  created_at: string;
  updated_at: string;
};

export type LedgerEntry = {
  id: string;
  account_id: string;
  direction: "debit" | "credit";
  amount: string;
  created_at: string;
};

export type LedgerTransaction = {
  id: string;
  transaction_type: TransactionType;
  status: string;
  reference_type: string | null;
  reference_id: string | null;
  idempotency_key: string;
  amount: string;
  created_at: string;
  entries: LedgerEntry[];
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type QRSession = {
  qr_session_token: string;
  expires_at: string;
  ttl_seconds: number;
};

export type EarningRule = {
  id: string;
  code: string;
  name: string;
  token_amount: string;
  daily_limit: number | null;
  weekly_limit: number | null;
  requires_note: boolean;
  requires_approval: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type RewardItem = {
  id: string;
  vendor_id: string | null;
  name: string;
  category: RewardCategory;
  price_tokens: string;
  inventory_count: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type IssueRewardRequest = {
  student_id: string;
  earning_rule_id: string;
  notes?: string | null;
  idempotency_key: string;
};

export type IssueRewardResponse = {
  earning_event_id: string;
  ledger_transaction_id: string | null;
  amount: string;
  new_balance: string;
  status: string;
};

export type VendorScanRequest = {
  qr_session_token: string;
};

export type VendorScanResponse = {
  session_valid: boolean;
  student_display_name: string | null;
  wallet_status: string | null;
  balance: string | null;
  expires_at: string | null;
  reason: string | null;
};

export type VendorRedeemRequest = {
  qr_session_token: string;
  reward_item_id: string;
  idempotency_key: string;
};

export type Redemption = {
  redemption_id: string;
  student_display_name: string;
  item_name: string;
  amount: string;
  balance_before: string;
  balance_after: string;
  vendor_name: string;
  redeemed_at: string;
};

export type AdminOverviewReport = {
  total_students: number;
  active_wallets: number;
  total_ptc_issued: string;
  total_ptc_redeemed: string;
  outstanding_ptc_balance: string;
  redemptions_today: number;
  transactions_today: number;
  most_active_student: string | null;
};

export type TokenVelocityDay = {
  date: string;
  issued: string;
  redeemed: string;
  transaction_count: number;
};

export type TokenVelocityReport = {
  days: number;
  series: TokenVelocityDay[];
};

export type RuleVolumeItem = {
  rule: string;
  total_ptc: string;
  event_count: number;
};

export type CategoryVolumeItem = {
  category: string;
  total_ptc: string;
  redemption_count: number;
};

export type TopStudentItem = {
  student_name: string;
  balance: string;
  transaction_count: number;
};

export type VendorSummaryItem = {
  vendor_id: string;
  vendor_name: string;
  vendor_type: string;
  total_ptc_redeemed: string;
  redemption_count: number;
};

export type AuditLog = {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string;
};

export type EarningRuleCreate = {
  code: string;
  name: string;
  token_amount: string;
  daily_limit?: number | null;
  weekly_limit?: number | null;
  requires_note?: boolean;
  requires_approval?: boolean;
  active?: boolean;
};

export type EarningRuleUpdate = Partial<Omit<EarningRuleCreate, "code">>;

export type RewardItemCreate = {
  name: string;
  category: RewardCategory;
  price_tokens: string;
  vendor_id?: string | null;
  inventory_count?: number | null;
  active?: boolean;
};

export type RewardItemUpdate = Partial<RewardItemCreate>;

export type AdminAdjustmentRequest = {
  wallet_id: string;
  amount: string;
  credit_student: boolean;
  idempotency_key: string;
  reason?: string | null;
};

export type AdminReversalRequest = {
  ledger_transaction_id: string;
  idempotency_key: string;
  reason?: string | null;
};
