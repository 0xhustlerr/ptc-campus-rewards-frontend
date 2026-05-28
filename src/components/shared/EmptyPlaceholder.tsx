type EmptyPlaceholderProps = {
  title: string;
  message: string;
};

/** Dashed-border empty selection state (e.g. no student selected). */
export function EmptyPlaceholder({ title, message }: EmptyPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{message}</p>
    </div>
  );
}
