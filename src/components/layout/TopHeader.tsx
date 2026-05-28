"use client";

import { APP_NAME, ROLE_LABELS } from "@/lib/constants";
import { User } from "@/lib/types";

import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

type TopHeaderProps = {
  user: User;
  onSwitchRole: (role: User["role"]) => void;
};

export function TopHeader({ user, onSwitchRole }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{APP_NAME}</p>
          <h1 className="text-lg font-semibold text-slate-900">{ROLE_LABELS[user.role]} Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <RoleSwitcher currentRole={user.role} onSwitchRole={onSwitchRole} />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
            {user.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
