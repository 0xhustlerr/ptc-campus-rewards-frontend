"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { LoadingState } from "@/components/shared/FeedbackStates";
import { useAuth } from "@/hooks/useAuth";
import { canAccessRoute, getRoleDashboardPath } from "@/lib/role-helpers";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !currentUser) {
      router.replace("/login");
      return;
    }
    if (!canAccessRoute(currentUser.role, pathname)) {
      router.replace(getRoleDashboardPath(currentUser.role));
    }
  }, [currentUser, isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !currentUser) {
    return <LoadingState message="Loading dashboard…" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopHeader user={currentUser} onSwitchRole={() => {}} />
      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar role={currentUser.role} />
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <BottomNav role={currentUser.role} />
    </div>
  );
}
