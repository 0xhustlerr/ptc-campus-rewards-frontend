import { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";

type OpsShellProps = {
  title: string;
  subtitle?: string;
  navItems?: readonly { label: string; href: string }[];
  children: ReactNode;
};

export function OpsShell({ title, subtitle, navItems, children }: OpsShellProps) {
  return (
    <AppShell title={title} subtitle={subtitle} navItems={navItems} maxWidth="ops">
      {children}
    </AppShell>
  );
}
