import Link from "next/link";

import { TransactionItem } from "@/components/transaction/TransactionItem";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { Transaction } from "@/lib/types";

type TransactionListProps = {
  transactions: Transaction[];
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
};

export function TransactionList({
  transactions,
  title = "Recent transactions",
  limit,
  showViewAll = false,
  viewAllHref = "/student/transactions",
}: TransactionListProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const visible = limit ? sorted.slice(0, limit) : sorted;

  if (visible.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        message="Earn and redemption activity will appear as credits move through your wallet."
      />
    );
  }

  return (
    <Card
      title={title}
      subtitle={showViewAll ? undefined : "Earns in green, redemptions in amber"}
    >
      {showViewAll && (
        <div className="mb-3 flex justify-end">
          <Link href={viewAllHref} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
            View all
          </Link>
        </div>
      )}
      <ul className="space-y-2">
        {visible.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </Card>
  );
}
