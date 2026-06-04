import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { StaffOpsShell } from "@/components/layout/StaffOpsShell";
import { STAFF_NAV_ITEMS } from "@/lib/constants";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["staff"]}>
      <StaffOpsShell
        title="Staff Rewards"
        subtitle="Issue PTC Credits to students using approved earning rules"
        navItems={STAFF_NAV_ITEMS}
      >
        {children}
      </StaffOpsShell>
    </RouteGuard>
  );
}
