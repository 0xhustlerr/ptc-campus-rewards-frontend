import { formatCreditsShort } from "@/lib/formatters";
import { CatalogRewardItem } from "@/lib/types";

type RewardItemCardProps = {
  item: CatalogRewardItem;
  balance: number;
};

export function RewardItemCard({ item, balance }: RewardItemCardProps) {
  const canAfford = balance >= item.creditsCost;

  return (
    <article
      className={`group rounded-2xl border p-3.5 transition-all ${
        canAfford
          ? "border-slate-200/80 bg-white shadow-soft hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-card"
          : "border-slate-200 bg-slate-50/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="text-xs font-medium text-slate-400">{item.vendor}</p>
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
        </div>
        <span
          className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
            canAfford
              ? "bg-sky-50 text-sky-700 ring-sky-600/15"
              : "bg-slate-100 text-slate-500 ring-slate-500/15"
          }`}
        >
          {formatCreditsShort(item.creditsCost)}
        </span>
      </div>
      {!canAfford && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.9 4.9a.9.9 0 1 0-1.8 0V10a.9.9 0 0 0 .38.73l2.2 1.6a.9.9 0 1 0 1.04-1.46l-1.82-1.32V6.9Z"
            />
          </svg>
          Need more PTC Credits to redeem
        </p>
      )}
    </article>
  );
}
