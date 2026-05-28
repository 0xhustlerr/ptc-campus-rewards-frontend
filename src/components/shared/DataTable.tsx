import { ReactNode } from "react";

import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";

export type ColumnDef<T> = {
  id: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  columns: ColumnDef<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  emptyTitle?: string;
  emptyMessage?: string;
  minWidth?: number;
};

export function DataTable<T>({
  title,
  subtitle,
  columns,
  data,
  getRowKey,
  emptyTitle = "No data",
  emptyMessage = "Nothing to show yet.",
  minWidth = 480,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  const table = (
    <div className="-mx-1 overflow-x-auto px-1">
      <table
        className="w-full text-left text-sm"
        style={{ minWidth: `${minWidth}px` }}
      >
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            {columns.map((col) => (
              <th
                key={col.id}
                className={`pb-2 pr-4 font-semibold last:pr-0 ${col.headerClassName ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={`py-3 pr-4 align-top last:pr-0 ${col.cellClassName ?? ""}`}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!title) return table;

  return (
    <Card title={title} subtitle={subtitle}>
      {table}
    </Card>
  );
}
