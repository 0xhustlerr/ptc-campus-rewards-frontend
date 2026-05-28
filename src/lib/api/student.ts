import { apiGet } from "@/lib/api/client";
import type { Student } from "@/lib/api/types";

export async function getStudentMe(): Promise<Student> {
  return apiGet<Student>("/students/me");
}
