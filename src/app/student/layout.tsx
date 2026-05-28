import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { StudentShell } from "@/components/layout/StudentShell";
import { StudentWalletProvider } from "@/contexts/StudentWalletContext";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["student"]}>
      <StudentWalletProvider>
        <StudentShell>{children}</StudentShell>
      </StudentWalletProvider>
    </RouteGuard>
  );
}
