"use client";

import { ReactNode, useEffect, useState } from "react";

import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { Pagination } from "@/components/shared/Pagination";

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
  /** Rows per page. Defaults to 7. Pass 0 to disable pagination. */
  pageSize?: number;
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
  pageSize = 7,
}: DataTableProps<T>) {
  const paginate = pageSize > 0 && data.length > pageSize;
  const pageCount = paginate ? Math.ceil(data.length / pageSize) : 1;
  const [page, setPage] = useState(1);

  // Keep the current page valid when the underlying data shrinks (search, refetch…).
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  const currentPage = Math.min(page, pageCount);
  const pageData = paginate
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  const content = (
    <>
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
                  className={`px-3 pb-2.5 pt-1 font-semibold first:pl-2 last:pr-2 ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageData.map((row) => (
              <tr
                key={getRowKey(row)}
                className="transition-colors hover:bg-slate-50/70"
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`px-3 py-3 align-top first:pl-2 last:pr-2 ${col.cellClassName ?? ""}`}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginate && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={data.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}
    </>
  );

  if (!title) return content;

  return (
    <Card title={title} subtitle={subtitle}>
      {content}
    </Card>
  );
}
