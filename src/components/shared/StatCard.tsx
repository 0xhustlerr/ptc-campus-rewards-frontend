import { ReactNode } from "react";

type Tone = "default" | "earn" | "redeem" | "brand";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
};

const toneValueClass: Record<Tone, string> = {
  default: "text-slate-900",
  earn: "text-emerald-700",
  redeem: "text-amber-700",
  brand: "text-sky-700",
};

const toneLabelClass: Record<Tone, string> = {
  default: "text-slate-500",
  earn: "text-emerald-600",
  redeem: "text-amber-600",
  brand: "text-sky-600",
};

const toneAccentClass: Record<Tone, string> = {
  default: "from-slate-300/0 via-slate-300/0 to-slate-300/0",
  earn: "from-emerald-400 via-emerald-300 to-teal-300",
  redeem: "from-amber-400 via-amber-300 to-orange-300",
  brand: "from-sky-400 via-sky-300 to-indigo-300",
};

const toneIconClass: Record<Tone, string> = {
  default: "bg-slate-100 text-slate-500",
  earn: "bg-emerald-50 text-emerald-600",
  redeem: "bg-amber-50 text-amber-600",
  brand: "bg-sky-50 text-sky-600",
};

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft sm:p-4 ${className}`}
    >
      {tone !== "default" && (
        <span
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneAccentClass[tone]}`}
          aria-hidden
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${toneLabelClass[tone]}`}
        >
          {label}
        </p>
        {icon && (
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneIconClass[tone]}`}
            aria-hidden
          >
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-1 text-lg font-bold tracking-tight sm:text-2xl ${toneValueClass[tone]}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
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
