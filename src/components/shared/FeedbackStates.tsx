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
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-sm text-slate-600 shadow-soft"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600"
        aria-hidden
      />
      {message}
    </div>
  );
}

export function EmptyState({ title, message }: MessageStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
      <div
        className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
          <path d="M4 4a2 2 0 0 1 2-2h5.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm7 0v4h4l-4-4Z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
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
