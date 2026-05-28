import { ROLE_DASHBOARD_PATHS } from "@/lib/constants";
import { User, UserRole } from "@/lib/types";

export function getRoleDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD_PATHS[role];
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/student") || pathname.includes("student-wallet")) {
    return role === "student";
  }
  if (pathname.startsWith("/staff") || pathname.includes("staff-rewards")) {
    return role === "staff" || role === "admin";
  }
  if (pathname.startsWith("/vendor") || pathname.includes("vendor-scanner")) {
    return role === "vendor" || role === "admin";
  }
  if (pathname.startsWith("/admin") || pathname.includes("admin-dashboard")) {
    return role === "admin";
  }
  return true;
}

/** Prevent open redirects; only allow in-app paths the role may access. */
export function getSafeRedirectPath(role: UserRole, next: string | null | undefined): string {
  if (
    next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.includes("..") &&
    canAccessRoute(role, next)
  ) {
    return next;
  }
  return ROLE_DASHBOARD_PATHS[role];
}

export function isRole(user: User, role: UserRole): boolean {
  return user.role === role;
}
