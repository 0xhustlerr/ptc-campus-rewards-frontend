import { WalletStatus } from "@/lib/types";

export function formatCredits(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCreditsLabel(value: number): string {
  return `${formatCredits(value)} PTC Credits`;
}

export function formatCreditsShort(value: number): string {
  return `${formatCredits(value)} PTC`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeDate(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return formatDate(value);
}

export function formatWalletStatus(status: WalletStatus): string {
  const labels: Record<WalletStatus, string> = {
    active: "Active",
    frozen: "Frozen",
    pending: "Pending setup",
  };
  return labels[status];
}
