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

export function NavLink({ href, label, isActive, variant = "pill" }: NavLinkProps) {
  if (variant === "tab") {
    return (
      <Link
        href={href}
        className={`flex flex-1 flex-col items-center justify-center px-2 py-3 text-xs font-semibold ${
          isActive ? "text-sky-700" : "text-slate-500"
        }`}
      >
        <span
          className={`mb-1 h-1 w-8 rounded-full ${isActive ? "bg-sky-600" : "bg-transparent"}`}
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
        className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive ? "bg-sky-100 text-sky-800" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold ${
        isActive ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}
