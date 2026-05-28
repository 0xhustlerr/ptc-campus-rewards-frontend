import { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/DashboardShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
