import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-sm gap-2",
};

const variantClass: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-brand hover:from-sky-500 hover:to-sky-700 focus-visible:ring-sky-500/60",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400/50",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300/60",
  danger:
    "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_6px_20px_-6px_rgb(220_38_38/0.5)] hover:to-red-700 focus-visible:ring-red-500/60",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 disabled:active:scale-100";

  return (
    <button
      className={`${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...props}
    />
  );
}
