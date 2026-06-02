import { ReactNode } from "react";

import { AppShell, type AppShellActor } from "@/components/layout/AppShell";

type OpsShellProps = {
  title: string;
  subtitle?: string;
  actor?: AppShellActor;
  navItems?: readonly { label: string; href: string }[];
  children: ReactNode;
};

export function OpsShell({ title, subtitle, actor, navItems, children }: OpsShellProps) {
  return (
    <AppShell title={title} subtitle={subtitle} actor={actor} navItems={navItems} maxWidth="ops">
      {children}
    </AppShell>
  );
}
