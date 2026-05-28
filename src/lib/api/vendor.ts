import { apiGet, apiPost } from "@/lib/api/client";
import type { Redemption, VendorRedeemRequest, VendorScanRequest, VendorScanResponse } from "@/lib/api/types";

export async function scanQr(body: VendorScanRequest): Promise<VendorScanResponse> {
  return apiPost<VendorScanResponse>("/vendor/scan", body);
}

export async function redeemReward(body: VendorRedeemRequest): Promise<Redemption> {
  return apiPost<Redemption>("/vendor/redeem", body);
}

export async function getVendorRedemptions(): Promise<Redemption[]> {
  return apiGet<Redemption[]>("/vendor/redemptions");
}
