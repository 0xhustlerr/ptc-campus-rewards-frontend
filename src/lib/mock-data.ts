import {
  ActivityTimelineItem,
  AdminRedemption,
  AuditLogEntry,
  CatalogRewardItem,
  EarningRule,
  IssuedReward,
  RewardEvent,
  RewardOffer,
  RewardRule,
  StaffStudent,
  StudentProfile,
  StudentWallet,
  StudentWalletStats,
  Transaction,
  User,
  Wallet,
} from "@/lib/types";

export const MOCK_STUDENT_USER_ID = "u-student-arlo";

export const mockUsers: User[] = [
  {
    id: MOCK_STUDENT_USER_ID,
    name: "Arlo Jr.",
    email: "arlo.jr@ptc.edu",
    role: "student",
    campus: "PTC Main",
  },
  {
    id: "u-staff-1",
    name: "Ari Monroe",
    email: "ari.monroe@ptc.edu",
    role: "staff",
    campus: "PTC Main",
  },
  {
    id: "u-vendor-1",
    name: "Mina Patel",
    email: "mina.patel@ptc.edu",
    role: "vendor",
    campus: "PTC Main",
  },
  {
    id: "u-admin-1",
    name: "Taylor Reed",
    email: "taylor.reed@ptc.edu",
    role: "admin",
    campus: "PTC Main",
  },
];

export const mockStudentWallet: StudentWallet = {
  walletId: "wallet_demo_001",
  userId: MOCK_STUDENT_USER_ID,
  studentName: "Arlo Jr.",
  balance: 42,
  status: "active",
};

export const mockStudentProfile: StudentProfile = {
  userId: MOCK_STUDENT_USER_ID,
  name: "Arlo Jr.",
  email: "arlo.jr@ptc.edu",
  campus: "PTC Main",
  program: "Barbering",
  cohort: "Spring 2026",
  walletId: "wallet_demo_001",
};

export const mockStudentStats: StudentWalletStats = {
  earnedThisWeek: 17,
  redeemedThisWeek: 16,
  currentStreak: 5,
  perfectAttendanceDays: 4,
  perfectAttendanceTarget: 5,
};

export const mockWallets: Wallet[] = [
  {
    userId: MOCK_STUDENT_USER_ID,
    balance: 42,
    pendingCredits: 0,
    lifetimeEarned: 58,
    lifetimeRedeemed: 16,
  },
];

export const mockStudentTransactions: Transaction[] = [
  {
    id: "txn-earn-1",
    userId: MOCK_STUDENT_USER_ID,
    type: "earn",
    source: "On-time attendance",
    amount: 1,
    createdAt: "2026-05-26T08:00:00.000Z",
  },
  {
    id: "txn-earn-2",
    userId: MOCK_STUDENT_USER_ID,
    type: "earn",
    source: "Haircut completed",
    amount: 2,
    createdAt: "2026-05-26T11:30:00.000Z",
  },
  {
    id: "txn-earn-3",
    userId: MOCK_STUDENT_USER_ID,
    type: "earn",
    source: "Quiz passed",
    amount: 3,
    createdAt: "2026-05-27T09:15:00.000Z",
  },
  {
    id: "txn-earn-4",
    userId: MOCK_STUDENT_USER_ID,
    type: "earn",
    source: "Clean station",
    amount: 1,
    createdAt: "2026-05-27T16:45:00.000Z",
  },
  {
    id: "txn-earn-5",
    userId: MOCK_STUDENT_USER_ID,
    type: "earn",
    source: "Perfect attendance bonus",
    amount: 10,
    createdAt: "2026-05-28T07:00:00.000Z",
  },
  {
    id: "txn-redeem-1",
    userId: MOCK_STUDENT_USER_ID,
    type: "redeem",
    source: "Food truck sandwich",
    amount: 8,
    createdAt: "2026-05-25T12:30:00.000Z",
    note: "Campus Court Food Truck",
  },
  {
    id: "txn-redeem-2",
    userId: MOCK_STUDENT_USER_ID,
    type: "redeem",
    source: "Drink",
    amount: 3,
    createdAt: "2026-05-25T12:31:00.000Z",
    note: "Campus Court Food Truck",
  },
  {
    id: "txn-redeem-3",
    userId: MOCK_STUDENT_USER_ID,
    type: "redeem",
    source: "Comb",
    amount: 5,
    createdAt: "2026-05-24T14:00:00.000Z",
    note: "PTC Supplies",
  },
];

export const mockTransactions: Transaction[] = mockStudentTransactions;

export const mockStudentCatalog: CatalogRewardItem[] = [
  {
    id: "cat-1",
    name: "Sandwich",
    category: "food_truck",
    creditsCost: 8,
    description: "Daily sandwich special from the campus food truck.",
    vendor: "Campus Court Food Truck",
    available: true,
  },
  {
    id: "cat-2",
    name: "Drink",
    category: "food_truck",
    creditsCost: 3,
    description: "Fountain drink or bottled water.",
    vendor: "Campus Court Food Truck",
    available: true,
  },
  {
    id: "cat-3",
    name: "Clipper Guards",
    category: "school_supplies",
    creditsCost: 20,
    description: "Standard guard set for clipper practice.",
    vendor: "PTC Supplies",
    available: true,
  },
  {
    id: "cat-4",
    name: "Comb",
    category: "school_supplies",
    creditsCost: 5,
    description: "Professional styling comb.",
    vendor: "PTC Supplies",
    available: true,
  },
  {
    id: "cat-5",
    name: "VIP Workshop Seat",
    category: "student_perks",
    creditsCost: 40,
    description: "Reserved front-row seat for the next guest artist workshop.",
    vendor: "PTC Student Life",
    available: true,
  },
];

export const mockStudentActivityTimeline: ActivityTimelineItem[] = [
  {
    id: "act-1",
    label: "Perfect attendance bonus",
    credits: 10,
    type: "earn",
    occurredAt: "2026-05-28T07:00:00.000Z",
  },
  {
    id: "act-2",
    label: "Clean station",
    credits: 1,
    type: "earn",
    occurredAt: "2026-05-27T16:45:00.000Z",
  },
  {
    id: "act-3",
    label: "Quiz passed",
    credits: 3,
    type: "earn",
    occurredAt: "2026-05-27T09:15:00.000Z",
  },
  {
    id: "act-4",
    label: "Comb redeemed",
    credits: 5,
    type: "redeem",
    occurredAt: "2026-05-24T14:00:00.000Z",
  },
  {
    id: "act-5",
    label: "Food truck sandwich",
    credits: 8,
    type: "redeem",
    occurredAt: "2026-05-25T12:30:00.000Z",
  },
];

export const mockRewardEvents: RewardEvent[] = [
  {
    id: "rwd-1",
    category: "attendance",
    title: "Perfect attendance week",
    credits: 10,
    earnedAt: "2026-05-28T07:00:00.000Z",
    awardedBy: "Ari Monroe",
  },
  {
    id: "rwd-2",
    category: "services",
    title: "Haircut completed",
    credits: 2,
    earnedAt: "2026-05-26T11:30:00.000Z",
    awardedBy: "Ari Monroe",
  },
];

export const mockRewardOffers: RewardOffer[] = mockStudentCatalog.map((item) => ({
  id: item.id,
  name: item.name,
  vendor: item.vendor,
  creditsCost: item.creditsCost,
  description: item.description,
  active: item.available,
}));

export const MOCK_STUDENT_MAYA_ID = "u-student-maya";
export const MOCK_STUDENT_DIEGO_ID = "u-student-diego";

export const mockStudentProfiles: StudentProfile[] = [
  mockStudentProfile,
  {
    userId: MOCK_STUDENT_MAYA_ID,
    name: "Maya Chen",
    email: "maya.chen@ptc.edu",
    campus: "PTC Main",
    program: "Barbering",
    cohort: "Spring 2026",
    walletId: "wallet_demo_002",
  },
  {
    userId: MOCK_STUDENT_DIEGO_ID,
    name: "Diego Santos",
    email: "diego.santos@ptc.edu",
    campus: "PTC Main",
    program: "Barbering",
    cohort: "Fall 2025",
    walletId: "wallet_demo_003",
  },
];

export const mockStudentWallets: Wallet[] = [
  ...mockWallets,
  {
    userId: MOCK_STUDENT_MAYA_ID,
    balance: 28,
    pendingCredits: 0,
    lifetimeEarned: 44,
    lifetimeRedeemed: 16,
  },
  {
    userId: MOCK_STUDENT_DIEGO_ID,
    balance: 15,
    pendingCredits: 5,
    lifetimeEarned: 62,
    lifetimeRedeemed: 47,
  },
];

export const mockStaffStudents: StaffStudent[] = mockStudentProfiles.map((profile) => {
  const wallet = mockStudentWallets.find((w) => w.userId === profile.userId)!;
  return {
    id: profile.userId,
    name: profile.name,
    email: profile.email,
    cohort: profile.cohort,
    walletId: profile.walletId,
    balance: wallet.balance,
    status: "active" as const,
    lastActivity: "2026-05-28T07:00:00.000Z",
  };
});

export const mockEarningRules: EarningRule[] = [
  { id: "rule-attendance", label: "On-time attendance", amount: 1, category: "attendance" },
  { id: "rule-haircut", label: "Haircut completed", amount: 2, category: "services" },
  { id: "rule-beard", label: "Beard trim", amount: 1, category: "services" },
  {
    id: "rule-sanitation",
    label: "Clean station / sanitation passed",
    amount: 1,
    category: "sanitation",
  },
  { id: "rule-quiz", label: "Quiz passed", amount: 3, category: "quiz" },
  { id: "rule-mentorship", label: "Peer mentorship", amount: 2, category: "mentorship" },
  {
    id: "rule-perfect-week",
    label: "Perfect attendance week",
    amount: 10,
    category: "bonus",
    requiresNote: true,
  },
];

export const mockIssuedRewards: IssuedReward[] = [
  {
    id: "issued-1",
    studentId: MOCK_STUDENT_USER_ID,
    studentName: "Arlo Jr.",
    ruleId: "rule-quiz",
    ruleLabel: "Quiz passed",
    amount: 3,
    note: "Chapter 4 sanitation quiz",
    issuedBy: "Ari Monroe",
    issuedAt: "2026-05-27T09:20:00.000Z",
  },
  {
    id: "issued-2",
    studentId: MOCK_STUDENT_MAYA_ID,
    studentName: "Maya Chen",
    ruleId: "rule-haircut",
    ruleLabel: "Haircut completed",
    amount: 2,
    note: "Client service floor",
    issuedBy: "Ari Monroe",
    issuedAt: "2026-05-26T14:10:00.000Z",
  },
];

export const mockRewardRules: RewardRule[] = mockEarningRules.map((rule) => ({
  id: rule.id,
  name: rule.label,
  amount: rule.amount,
  dailyLimit: rule.id === "rule-perfect-week" ? 1 : 5,
  active: true,
}));

export const mockAdminRedemptions: AdminRedemption[] = [
  {
    id: "red-seed-1",
    date: "2026-05-25T12:30:00.000Z",
    studentName: "Arlo Jr.",
    vendor: "Campus Court Food Truck",
    item: "Sandwich",
    amount: 8,
    status: "completed",
  },
  {
    id: "red-seed-2",
    date: "2026-05-24T14:00:00.000Z",
    studentName: "Arlo Jr.",
    vendor: "PTC Supplies",
    item: "Comb",
    amount: 5,
    status: "completed",
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "audit-1",
    actor: "Ari Monroe",
    action: "Issued 3 PTC",
    entity: "Arlo Jr. · Quiz passed",
    timestamp: "2026-05-27T09:20:00.000Z",
  },
  {
    id: "audit-2",
    actor: "Mina Patel",
    action: "Redeemed 8 PTC",
    entity: "Arlo Jr. · Sandwich",
    timestamp: "2026-05-25T12:30:00.000Z",
  },
];
