import { ReactNode } from "react";

import { Card } from "@/components/shared/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "earn" | "redeem" | "brand";
  className?: string;
};

const toneValueClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-slate-900",
  earn: "text-emerald-800",
  redeem: "text-amber-800",
  brand: "text-sky-800",
};

const toneLabelClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-slate-500",
  earn: "text-emerald-700",
  redeem: "text-amber-700",
  brand: "text-sky-700",
};

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className = "",
}: StatCardProps) {
  return (
    <Card className={`!p-3 sm:!p-4 ${className}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${toneLabelClass[tone]}`}>
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold sm:text-2xl ${toneValueClass[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

type StatGridProps = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
};

export function StatGrid({ children, columns = 2 }: StatGridProps) {
  const colClass =
    columns === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2";

  return <div className={`grid gap-3 ${colClass}`}>{children}</div>;
}
