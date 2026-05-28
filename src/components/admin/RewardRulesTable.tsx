import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RewardRule } from "@/lib/types";

const columns: ColumnDef<RewardRule>[] = [
  { id: "name", header: "Rule name", cell: (r) => <span className="font-medium">{r.name}</span> },
  {
    id: "amount",
    header: "Amount",
    cell: (r) => <span className="font-semibold text-emerald-700">+{r.amount} PTC</span>,
  },
  { id: "limit", header: "Daily limit", cell: (r) => `${r.dailyLimit}/day` },
  {
    id: "active",
    header: "Active",
    cell: (r) => (
      <StatusBadge label={r.active ? "Active" : "Inactive"} variant={r.active ? "active" : "inactive"} />
    ),
  },
];

type RewardRulesTableProps = {
  rules: RewardRule[];
};

export function RewardRulesTable({ rules }: RewardRulesTableProps) {
  return (
    <DataTable
      title="Earning rules"
      columns={columns}
      data={rules}
      getRowKey={(r) => r.id}
      emptyTitle="No rules"
      emptyMessage="Earning rules will appear here."
    />
  );
}
