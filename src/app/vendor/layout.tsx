import { ReactNode } from "react";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { OpsShell } from "@/components/layout/OpsShell";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["vendor", "admin"]}>
      <OpsShell
        title="Vendor Scanner"
        subtitle="Scan student QR codes and redeem PTC Credits for campus items"
      >
        {children}
      </OpsShell>
    </RouteGuard>
  );
}
