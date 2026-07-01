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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 p-5 text-white shadow-lift animate-fade-up">
      {/* Decorative ambient orbs */}
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-indigo-400/25 blur-2xl"
        aria-hidden
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-sky-100">Welcome back</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{studentName}</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur ${
              isActive
                ? "bg-emerald-400/20 text-emerald-50 ring-emerald-200/40"
                : "bg-white/15 text-white ring-white/30"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-white"}`}
              aria-hidden
            />
            {formatWalletStatus(status)}
          </span>
        </div>

        <p className="mt-6 text-sm text-sky-100">Your balance</p>
        <p className="text-4xl font-bold tracking-tight sm:text-5xl">
          {formatCreditsShort(balance)}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-sky-200">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M4 5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 3h12v5H4V8Z" />
          </svg>
          Wallet · {walletId}
        </p>
      </div>
    </section>
  );
}
