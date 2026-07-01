/** Shared Tailwind class strings for form controls (mobile-first touch targets). */
export const inputClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/15 sm:text-sm";

export const selectClassName = inputClassName;

export const textareaClassName = `${inputClassName} min-h-[88px] resize-y`;

export const labelClassName = "text-sm font-medium text-slate-700";

export const pillActiveClassName =
  "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-brand";

export const pillInactiveClassName =
  "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";
