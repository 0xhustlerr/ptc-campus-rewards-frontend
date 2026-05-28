import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { OpsShell } from "@/components/layout/OpsShell";
import { ADMIN_NAV_ITEMS } from "@/lib/constants";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <OpsShell
        title="Admin Dashboard"
        subtitle="Manage students, earning rules, catalog, redemptions, and reports"
        navItems={ADMIN_NAV_ITEMS}
      >
        {children}
      </OpsShell>
    </RouteGuard>
  );
}
