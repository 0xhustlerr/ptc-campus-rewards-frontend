import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { formatCreditsShort, formatRelativeDate } from "@/lib/formatters";
import { ActivityTimelineItem } from "@/lib/types";

type WalletActivityTimelineProps = {
  items: ActivityTimelineItem[];
  limit?: number;
};

export function WalletActivityTimeline({ items, limit }: WalletActivityTimelineProps) {
  const visible = limit ? items.slice(0, limit) : items;

  if (visible.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        message="Your earn and redeem activity will show up here."
      />
    );
  }

  return (
    <Card title="Recent activity">
      <ol className="relative space-y-4 border-l border-slate-200 pl-4">
        {visible.map((item) => (
          <li key={item.id} className="relative">
            <span
              className={`absolute -left-[1.3rem] top-1 h-2.5 w-2.5 rounded-full ${
                item.type === "earn" ? "bg-emerald-500" : "bg-amber-500"
              }`}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{formatRelativeDate(item.occurredAt)}</p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  item.type === "earn" ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {item.type === "earn" ? "+" : "-"}
                {formatCreditsShort(item.credits)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
