"use client";

import Link from "next/link";
import { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  variant?: "pill" | "tab" | "sidebar";
  icon?: ReactNode;
};

export function NavLink({ href, label, isActive, variant = "pill", icon }: NavLinkProps) {
  if (variant === "tab") {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex shrink-0 flex-col items-center justify-center whitespace-nowrap px-3 pb-2 pt-2.5 text-xs font-semibold transition-colors ${
          isActive ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span
          className={`mb-1 h-1 w-8 rounded-full transition-all ${
            isActive ? "bg-gradient-to-r from-sky-500 to-indigo-500" : "bg-transparent"
          }`}
          aria-hidden
        />
        {label}
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
          isActive
            ? "bg-sky-50 text-sky-700 shadow-xs ring-1 ring-inset ring-sky-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
        isActive
          ? "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-brand"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}
