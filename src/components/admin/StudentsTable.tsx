import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCreditsShort, formatDate, formatWalletStatus } from "@/lib/formatters";
import { StaffStudent } from "@/lib/types";

const columns: ColumnDef<StaffStudent>[] = [
  {
    id: "name",
    header: "Name",
    cell: (s) => (
      <>
        <p className="font-medium text-slate-900">{s.name}</p>
        <p className="text-xs text-slate-500">{s.email}</p>
      </>
    ),
  },
  { id: "cohort", header: "Cohort", cell: (s) => <span className="text-slate-700">{s.cohort}</span> },
  {
    id: "balance",
    header: "Balance",
    cell: (s) => (
      <span className="font-semibold text-sky-800">{formatCreditsShort(s.balance)}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (s) => (
      <StatusBadge
        label={formatWalletStatus(s.status)}
        variant={s.status === "active" ? "active" : "inactive"}
      />
    ),
  },
  {
    id: "activity",
    header: "Last activity",
    cell: (s) => <span className="text-slate-500">{formatDate(s.lastActivity)}</span>,
  },
  {
    id: "action",
    header: "Action",
    cell: () => (
      <button
        type="button"
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        View
      </button>
    ),
  },
];

type StudentsTableProps = {
  students: StaffStudent[];
};

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={students}
      getRowKey={(s) => s.id}
      emptyTitle="No students"
      emptyMessage="Student records will appear here."
      minWidth={640}
    />
  );
}
