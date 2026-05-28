import { apiGet } from "@/lib/api/client";
import type {
  AdminOverviewReport,
  CategoryVolumeItem,
  RuleVolumeItem,
  TokenVelocityReport,
  TopStudentItem,
  VendorSummaryItem,
} from "@/lib/api/types";

export async function getReportsOverview(): Promise<AdminOverviewReport> {
  return apiGet<AdminOverviewReport>("/admin/reports/overview");
}

export async function getTokenVelocity(days = 7): Promise<TokenVelocityReport> {
  return apiGet<TokenVelocityReport>(`/admin/reports/token-velocity?days=${days}`);
}

export async function getEarnedByRule(): Promise<RuleVolumeItem[]> {
  return apiGet<RuleVolumeItem[]>("/admin/reports/earned-by-rule");
}

export async function getRedeemedByCategory(): Promise<CategoryVolumeItem[]> {
  return apiGet<CategoryVolumeItem[]>("/admin/reports/redeemed-by-category");
}

export async function getTopStudents(limit = 10): Promise<TopStudentItem[]> {
  return apiGet<TopStudentItem[]>(`/admin/reports/top-students?limit=${limit}`);
}

export async function getVendorSummary(): Promise<VendorSummaryItem[]> {
  return apiGet<VendorSummaryItem[]>("/admin/reports/vendor-summary");
}
