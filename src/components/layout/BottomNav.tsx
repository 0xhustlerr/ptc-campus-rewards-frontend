"use client";

import { usePathname } from "next/navigation";

import { NavLink } from "@/components/layout/NavLink";
import { ROLE_NAV_ITEMS } from "@/lib/constants";
import { UserRole } from "@/lib/types";

type BottomNavProps = {
  role: UserRole;
};

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const items = ROLE_NAV_ITEMS[role];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-2 md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              label={item.label}
              isActive={pathname === item.href}
              variant="pill"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
