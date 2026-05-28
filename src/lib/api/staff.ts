import { apiGet, apiPost } from "@/lib/api/client";
import type {
  EarningRule,
  IssueRewardRequest,
  IssueRewardResponse,
  StudentListItem,
} from "@/lib/api/types";

export async function getStaffStudents(): Promise<StudentListItem[]> {
  return apiGet<StudentListItem[]>("/staff/students");
}

export async function getEarningRulesList(): Promise<EarningRule[]> {
  return apiGet<EarningRule[]>("/earning-rules");
}

export async function issueReward(body: IssueRewardRequest): Promise<IssueRewardResponse> {
  return apiPost<IssueRewardResponse>("/staff/issue-reward", body);
}
