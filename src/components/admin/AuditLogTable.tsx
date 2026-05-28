import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/formatters";
import { AuditLogEntry } from "@/lib/types";

const columns: ColumnDef<AuditLogEntry>[] = [
  { id: "actor", header: "Actor", cell: (l) => <span className="font-medium">{l.actor}</span> },
  { id: "action", header: "Action", cell: (l) => l.action },
  { id: "entity", header: "Entity", cell: (l) => <span className="text-slate-600">{l.entity}</span> },
  { id: "time", header: "Timestamp", cell: (l) => formatDate(l.timestamp) },
];

type AuditLogTableProps = {
  logs: AuditLogEntry[];
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <DataTable
      title="Audit log"
      columns={columns}
      data={logs}
      getRowKey={(l) => l.id}
      emptyTitle="No audit entries"
      emptyMessage="System actions will be logged here."
      minWidth={560}
    />
  );
}
