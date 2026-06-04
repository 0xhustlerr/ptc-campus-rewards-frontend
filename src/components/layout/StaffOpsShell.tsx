"use client";

import { ReactNode } from "react";

import { OpsShell } from "@/components/layout/OpsShell";
import { useAuth } from "@/hooks/useAuth";

type StaffOpsShellProps = {
  title: string;
  subtitle?: string;
  navItems?: readonly { label: string; href: string }[];
  children: ReactNode;
};

export function StaffOpsShell({ title, subtitle, navItems, children }: StaffOpsShellProps) {
  const { currentUser } = useAuth();

  const actor = currentUser
    ? {
        name: currentUser.name,
        email: currentUser.email,
        detail: currentUser.department,
      }
    : undefined;

  return (
    <OpsShell title={title} subtitle={subtitle} actor={actor} navItems={navItems}>
      {children}
    </OpsShell>
  );
}
