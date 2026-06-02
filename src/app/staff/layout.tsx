import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { StaffOpsShell } from "@/components/layout/StaffOpsShell";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["staff", "admin"]}>
      <StaffOpsShell
        title="Staff Rewards"
        subtitle="Issue PTC Credits to students using approved earning rules"
      >
        {children}
      </StaffOpsShell>
    </RouteGuard>
  );
}
