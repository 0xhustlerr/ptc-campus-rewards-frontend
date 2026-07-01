"use client";

type PaginationProps = {
  /** 1-indexed current page. */
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Build a compact list of page numbers with ellipsis gaps for large ranges. */
function buildPageItems(page: number, pageCount: number): Array<number | "…"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const items: Array<number | "…"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("…");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < pageCount - 1) items.push("…");

  items.push(pageCount);
  return items;
}

const arrowClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const items = buildPageItems(page, pageCount);

  return (
    <nav
      className={`mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row ${className}`}
      aria-label="Pagination"
    >
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}</span>–
        <span className="font-semibold text-slate-700">{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={arrowClass}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12.6 4.4a1 1 0 0 1 0 1.4L8.4 10l4.2 4.2a1 1 0 1 1-1.4 1.4l-4.9-4.9a1 1 0 0 1 0-1.4l4.9-4.9a1 1 0 0 1 1.4 0Z" />
          </svg>
        </button>

        {items.map((item, index) =>
          item === "…" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-sm text-slate-400"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${
                item === page
                  ? "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-brand"
                  : "border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className={arrowClass}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M7.4 4.4a1 1 0 0 1 1.4 0l4.9 4.9a1 1 0 0 1 0 1.4l-4.9 4.9a1 1 0 1 1-1.4-1.4l4.2-4.2-4.2-4.2a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
