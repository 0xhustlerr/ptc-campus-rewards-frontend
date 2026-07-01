type AlertBannerProps = {
  variant: "success" | "error";
  message: string;
};

const config = {
  success: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconClass: "text-emerald-500",
    path: "M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.29a1 1 0 0 1-1.42.006l-3.8-3.8a1 1 0 1 1 1.414-1.414l3.09 3.09 6.494-6.574a1 1 0 0 1 1.416-.006Z",
  },
  error: {
    className: "border-red-200 bg-red-50 text-red-700",
    iconClass: "text-red-500",
    path: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a.9.9 0 0 1 .9.9v4.2a.9.9 0 1 1-1.8 0V6.9A.9.9 0 0 1 10 6Zm0 8.4a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z",
  },
} as const;

export function AlertBanner({ variant, message }: AlertBannerProps) {
  const { className, iconClass, path } = config[variant];

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <svg
        viewBox="0 0 20 20"
        className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`}
        fill="currentColor"
        aria-hidden
      >
        <path fillRule="evenodd" clipRule="evenodd" d={path} />
      </svg>
      <span className="min-w-0">{message}</span>
    </div>
  );
}
