import { formatCreditsShort, formatRelativeDate } from "@/lib/formatters";
import { Transaction } from "@/lib/types";

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isEarn = transaction.type === "earn";

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition-colors hover:border-slate-300">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ring-inset ${
          isEarn
            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
            : "bg-amber-50 text-amber-700 ring-amber-600/15"
        }`}
        aria-hidden
      >
        {isEarn ? "+" : "−"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{transaction.source}</p>
        <p className="text-xs text-slate-500">{formatRelativeDate(transaction.createdAt)}</p>
        {transaction.note && (
          <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.note}</p>
        )}
      </div>
      <p
        className={`shrink-0 text-sm font-bold ${isEarn ? "text-emerald-700" : "text-amber-700"}`}
      >
        {isEarn ? "+" : "−"}
        {formatCreditsShort(transaction.amount)}
      </p>
    </li>
  );
}
