type StatusBadgeVariant = "active" | "inactive" | "success" | "warning" | "danger" | "pending";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
};

const variantClass: Record<StatusBadgeVariant, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

const dotClass: Record<StatusBadgeVariant, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  pending: "bg-sky-500",
};

export function StatusBadge({ label, variant = "active" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${variantClass[variant]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass[variant]}`} aria-hidden />
      {label}
    </span>
  );
}
