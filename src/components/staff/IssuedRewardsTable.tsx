import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { formatCreditsShort, formatDate } from "@/lib/formatters";
import { IssuedReward } from "@/lib/types";

const columns: ColumnDef<IssuedReward>[] = [
  { id: "student", header: "Student", cell: (r) => <span className="font-medium">{r.studentName}</span> },
  { id: "rule", header: "Rule", cell: (r) => r.ruleLabel },
  {
    id: "amount",
    header: "Amount",
    cell: (r) => <span className="font-semibold text-emerald-700">+{formatCreditsShort(r.amount)}</span>,
  },
  {
    id: "note",
    header: "Note",
    cellClassName: "max-w-[160px]",
    cell: (r) => <span className="truncate text-slate-600">{r.note}</span>,
  },
  { id: "date", header: "Date", cell: (r) => formatDate(r.issuedAt) },
];

type IssuedRewardsTableProps = {
  rewards: IssuedReward[];
};

export function IssuedRewardsTable({ rewards }: IssuedRewardsTableProps) {
  return (
    <DataTable
      title="Recently issued rewards"
      columns={columns}
      data={rewards}
      getRowKey={(r) => r.id}
      emptyTitle="No rewards issued yet"
      emptyMessage="Issued PTC Credits will appear here after you submit."
      minWidth={0}
    />
  );
}
