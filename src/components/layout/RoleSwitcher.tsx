"use client";

import { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ROLE_LABELS } from "@/lib/constants";
import { canAccessRoute, getRoleDashboardPath } from "@/lib/role-helpers";
import { UserRole } from "@/lib/types";

type RoleSwitcherProps = {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
};

export function RoleSwitcher({ currentRole, onSwitchRole }: RoleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value as UserRole;
    onSwitchRole(nextRole);
    if (!canAccessRoute(nextRole, pathname)) {
      router.push(getRoleDashboardPath(nextRole));
    }
  };

  return (
    <label className="flex items-center gap-2 text-xs text-slate-600">
      Role
      <select
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
        value={currentRole}
        onChange={onChange}
        aria-label="Switch user role"
      >
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <option key={role} value={role}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
