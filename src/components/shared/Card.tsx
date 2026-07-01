import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  hover?: boolean;
  children: ReactNode;
  className?: string;
};

export function Card({
  title,
  subtitle,
  action,
  hover = false,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft ${
        hover ? "card-hover" : ""
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
