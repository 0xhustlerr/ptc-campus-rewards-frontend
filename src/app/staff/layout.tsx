import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { OpsShell } from "@/components/layout/OpsShell";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["staff", "admin"]}>
      <OpsShell
        title="Staff Rewards"
        subtitle="Issue PTC Credits to students using approved earning rules"
      >
        {children}
      </OpsShell>
    </RouteGuard>
  );
}
