"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { LoadingState } from "@/components/shared/FeedbackStates";
import { useAuth } from "@/hooks/useAuth";
import { canAccessRoute } from "@/lib/role-helpers";
import type { UserRole } from "@/lib/types";

type RouteGuardProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, role } = useAuth();

  const hasAccess =
    Boolean(isAuthenticated) &&
    Boolean(role) &&
    allowedRoles.includes(role!) &&
    canAccessRoute(role!, pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!role || !allowedRoles.includes(role)) {
      router.replace("/unauthorized");
      return;
    }
    if (!canAccessRoute(role, pathname)) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, pathname, router]);

  if (isLoading) {
    return <LoadingState message="Checking your session…" />;
  }

  if (!hasAccess) {
    return <LoadingState message="Redirecting…" />;
  }

  return <>{children}</>;
}
