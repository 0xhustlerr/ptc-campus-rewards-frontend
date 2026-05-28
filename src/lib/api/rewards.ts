import { apiGet } from "@/lib/api/client";
import type { RewardItem } from "@/lib/api/types";

export async function getRewardsCatalog(): Promise<RewardItem[]> {
  return apiGet<RewardItem[]>("/rewards/catalog");
}
