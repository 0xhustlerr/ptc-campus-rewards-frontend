import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { OpsShell } from "@/components/layout/OpsShell";
import { VENDOR_NAV_ITEMS } from "@/lib/constants";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["vendor"]}>
      <OpsShell
        title="Vendor Scanner"
        subtitle="Scan student QR codes and redeem PTC Credits for campus items"
        navItems={VENDOR_NAV_ITEMS}
      >
        {children}
      </OpsShell>
    </RouteGuard>
  );
}
