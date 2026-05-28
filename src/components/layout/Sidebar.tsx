"use client";

import { usePathname } from "next/navigation";

import { NavLink } from "@/components/layout/NavLink";
import { ROLE_NAV_ITEMS } from "@/lib/constants";
import { UserRole } from "@/lib/types";

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = ROLE_NAV_ITEMS[role];

  return (
    <aside className="hidden border-r border-slate-200 bg-white md:block md:w-64">
      <nav className="p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Navigation</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                label={item.label}
                isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                variant="sidebar"
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
