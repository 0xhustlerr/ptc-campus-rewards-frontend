import { formatCreditsShort, formatWalletStatus } from "@/lib/formatters";
import { WalletStatus } from "@/lib/types";

type WalletBalanceCardProps = {
  studentName: string;
  balance: number;
  status: WalletStatus;
  walletId: string;
};

export function WalletBalanceCard({
  studentName,
  balance,
  status,
  walletId,
}: WalletBalanceCardProps) {
  const isActive = status === "active";

  return (
    <section className="rounded-3xl bg-gradient-to-br from-sky-600 to-sky-800 p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sky-100">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold">{studentName}</h1>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive ? "bg-emerald-400/20 text-emerald-100" : "bg-white/20 text-white"
          }`}
        >
          {formatWalletStatus(status)}
        </span>
      </div>
      <p className="mt-6 text-sm text-sky-100">Your balance</p>
      <p className="text-4xl font-bold tracking-tight">{formatCreditsShort(balance)}</p>
      <p className="mt-2 text-xs text-sky-200">Wallet · {walletId}</p>
    </section>
  );
}
