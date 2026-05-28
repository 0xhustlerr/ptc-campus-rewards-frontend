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
      className={`rounded-xl border p-3 ${
        canAfford ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="text-xs text-slate-500">{item.vendor}</p>
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
        </div>
        <span
          className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${
            canAfford ? "bg-sky-100 text-sky-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {formatCreditsShort(item.creditsCost)}
        </span>
      </div>
      {!canAfford && (
        <p className="mt-2 text-xs font-medium text-slate-500">Need more PTC Credits to redeem</p>
      )}
    </article>
  );
}
