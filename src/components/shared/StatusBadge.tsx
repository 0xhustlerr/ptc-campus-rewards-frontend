type StatusBadgeVariant = "active" | "inactive" | "success" | "warning" | "danger" | "pending";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
};

const variantClass: Record<StatusBadgeVariant, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  pending: "bg-sky-100 text-sky-800",
};

export function StatusBadge({ label, variant = "active" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${variantClass[variant]}`}
    >
      {label}
    </span>
  );
}
