import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCreditsShort, formatDate } from "@/lib/formatters";
import { AdminRedemption } from "@/lib/types";

function redemptionVariant(status: AdminRedemption["status"]) {
  if (status === "completed") return "success" as const;
  if (status === "failed") return "danger" as const;
  return "pending" as const;
}

const columns: ColumnDef<AdminRedemption>[] = [
  { id: "date", header: "Date", cell: (r) => formatDate(r.date) },
  { id: "student", header: "Student", cell: (r) => <span className="font-medium">{r.studentName}</span> },
  { id: "vendor", header: "Vendor", cell: (r) => r.vendor },
  { id: "item", header: "Item", cell: (r) => r.item },
  {
    id: "amount",
    header: "Amount",
    cell: (r) => (
      <span className="font-semibold text-amber-700">−{formatCreditsShort(r.amount)}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <StatusBadge label={r.status} variant={redemptionVariant(r.status)} />,
  },
];

type RedemptionsTableProps = {
  redemptions: AdminRedemption[];
};

export function RedemptionsTable({ redemptions }: RedemptionsTableProps) {
  return (
    <DataTable
      title="Redemptions"
      columns={columns}
      data={redemptions}
      getRowKey={(r) => r.id}
      emptyTitle="No redemptions"
      emptyMessage="Vendor redemptions will be listed here."
      minWidth={640}
    />
  );
}
