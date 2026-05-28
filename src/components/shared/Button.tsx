import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variantClass =
    variant === "primary"
      ? "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-600"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400";

  return <button className={`${baseClass} ${variantClass} ${className}`} {...props} />;
}
