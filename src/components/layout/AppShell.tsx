"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { NavLink } from "@/components/layout/NavLink";
import { APP_NAME } from "@/lib/constants";

type NavItem = { label: string; href: string };

type AppShellProps = {
  title: string;
  subtitle?: string;
  navItems?: readonly NavItem[];
  navVariant?: "pill" | "tab";
  maxWidth?: "student" | "ops";
  children: ReactNode;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  title,
  subtitle,
  navItems,
  navVariant = "pill",
  maxWidth = "ops",
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const widthClass = maxWidth === "student" ? "max-w-lg md:max-w-2xl" : "max-w-6xl";
  const isTabNav = navVariant === "tab";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className={`mx-auto flex w-full ${widthClass} flex-col gap-3 px-4 py-3 md:px-6`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{APP_NAME}</p>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
          {navItems && navItems.length > 0 && navVariant === "pill" && (
            <nav
              className="flex gap-2 overflow-x-auto pb-1"
              aria-label="Section navigation"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={isNavActive(pathname, item.href)}
                  variant="pill"
                />
              ))}
            </nav>
          )}
        </div>
      </header>

      <main
        className={`mx-auto w-full ${widthClass} px-4 py-4 ${
          isTabNav ? "pb-24 md:pb-6" : "pb-6"
        } md:px-6`}
      >
        {children}
      </main>

      {navItems && navItems.length > 0 && isTabNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden"
          aria-label="Primary navigation"
        >
          <ul className={`mx-auto flex ${widthClass} items-stretch justify-around`}>
            {navItems.map((item) => (
              <li key={item.href} className="flex-1">
                <NavLink
                  href={item.href}
                  label={item.label}
                  isActive={pathname === item.href}
                  variant="tab"
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** Simple link back to home hub from ops layouts on large screens */
export function ShellHomeLink() {
  return (
    <Link
      href="/"
      className="text-xs font-semibold text-sky-700 hover:text-sky-800"
    >
      ← All dashboards
    </Link>
  );
}
