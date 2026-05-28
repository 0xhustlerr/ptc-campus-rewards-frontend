type AlertBannerProps = {
  variant: "success" | "error";
  message: string;
};

export function AlertBanner({ variant, message }: AlertBannerProps) {
  const className =
    variant === "success"
      ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
      : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700";

  return (
    <p className={className} role={variant === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}
