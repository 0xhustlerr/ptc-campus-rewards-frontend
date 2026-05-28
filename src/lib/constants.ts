import { CatalogCategory, UserRole } from "@/lib/types";

export const APP_NAME = "PTC Campus Rewards";

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  staff: "Staff",
  vendor: "Vendor",
  admin: "Admin",
};

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  student: "/student/wallet",
  staff: "/staff/rewards",
  vendor: "/vendor/scanner",
  admin: "/admin",
};

export const ROLE_NAV_ITEMS: Record<
  UserRole,
  Array<{ label: string; href: string }>
> = {
  student: [{ label: "Wallet", href: "/student/wallet" }],
  staff: [{ label: "Rewards", href: "/staff/rewards" }],
  vendor: [{ label: "Scanner", href: "/vendor/scanner" }],
  admin: [{ label: "Dashboard", href: "/admin" }],
};

export const STUDENT_NAV_ITEMS = [
  { label: "Wallet", href: "/student/wallet" },
  { label: "Activity", href: "/student/transactions" },
  { label: "Rewards", href: "/student/rewards" },
  { label: "Profile", href: "/student/profile" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin" },
  { label: "Students", href: "/admin/students" },
  { label: "Rewards", href: "/admin/rewards" },
  { label: "Redemptions", href: "/admin/redemptions" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Audit", href: "/admin/audit-logs" },
] as const;

export const CATALOG_CATEGORY_LABELS: Record<CatalogCategory, string> = {
  food_truck: "Food Truck",
  school_supplies: "School Supplies",
  student_perks: "Student Perks",
};

export const WALLET_QR_TTL_SECONDS = 60;

export const DEFAULT_VENDOR_NAME = "Campus Court Food Truck";
