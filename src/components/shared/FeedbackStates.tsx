type MessageStateProps = {
  title: string;
  message: string;
};

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export function EmptyState({ title, message }: MessageStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}

export function ErrorState({ title, message }: MessageStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <h3 className="text-base font-semibold text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}
