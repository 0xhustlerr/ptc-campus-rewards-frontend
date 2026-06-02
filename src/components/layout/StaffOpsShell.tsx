"use client";

import { ReactNode } from "react";

import { OpsShell } from "@/components/layout/OpsShell";
import { useAuth } from "@/hooks/useAuth";

type StaffOpsShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function StaffOpsShell({ title, subtitle, children }: StaffOpsShellProps) {
  const { currentUser } = useAuth();

  const actor = currentUser
    ? {
        name: currentUser.name,
        email: currentUser.email,
        detail: currentUser.department,
      }
    : undefined;

  return (
    <OpsShell title={title} subtitle={subtitle} actor={actor}>
      {children}
    </OpsShell>
  );
}
