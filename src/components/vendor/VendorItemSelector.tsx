import { formatCreditsShort } from "@/lib/formatters";
import { CatalogRewardItem } from "@/lib/types";

type VendorItemSelectorProps = {
  items: CatalogRewardItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  balance: number;
};

export function VendorItemSelector({
  items,
  selectedId,
  onSelect,
  balance,
}: VendorItemSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Select redemption item</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const canAfford = balance >= item.creditsCost;
          const isSelected = selectedId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={!canAfford}
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                  isSelected
                    ? "border-sky-600 bg-sky-50"
                    : canAfford
                      ? "border-slate-200 bg-white hover:border-sky-300"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                }`}
              >
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.vendor}</p>
                <p className="mt-1 text-sm font-bold text-sky-800">
                  {formatCreditsShort(item.creditsCost)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
