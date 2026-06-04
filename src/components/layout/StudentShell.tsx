import { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { STUDENT_NAV_ITEMS } from "@/lib/constants";

type StudentShellProps = {
  children: ReactNode;
};

export function StudentShell({ children }: StudentShellProps) {
  return (
    <AppShell title="Student Wallet" navItems={STUDENT_NAV_ITEMS} maxWidth="student">
      {children}
    </AppShell>
  );
}
