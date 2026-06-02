import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { formatCreditsShort } from "@/lib/formatters";
import { StaffStudent } from "@/lib/types";

type StaffStudentsTableProps = {
  students: StaffStudent[];
  selectedId?: string;
  onSelect: (student: StaffStudent) => void;
};

export function StaffStudentsTable({ students, selectedId, onSelect }: StaffStudentsTableProps) {
  const columns: ColumnDef<StaffStudent>[] = [
    {
      id: "name",
      header: "Name",
      cellClassName: "min-w-0 max-w-[160px] break-words",
      cell: (s) => <span className="font-medium">{s.name}</span>,
    },
    {
      id: "cohort",
      header: "Cohort",
      cellClassName: "min-w-0 max-w-[120px] break-words",
      cell: (s) => s.cohort,
    },
    {
      id: "balance",
      header: "Balance",
      cell: (s) => <span className="font-semibold text-sky-800">{formatCreditsShort(s.balance)}</span>,
    },
    {
      id: "select",
      header: "Select",
      cell: (s) => (
        <button
          type="button"
          onClick={() => onSelect(s)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            selectedId === s.id
              ? "bg-sky-100 text-sky-800"
              : "bg-sky-600 text-white hover:bg-sky-700"
          }`}
        >
          {selectedId === s.id ? "Selected" : "Select"}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      title="All students"
      columns={columns}
      data={students}
      getRowKey={(s) => s.id}
      emptyTitle="No students"
      emptyMessage="No student records found."
      minWidth={0}
    />
  );
}
