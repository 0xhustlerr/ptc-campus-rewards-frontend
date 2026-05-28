/** Shared Tailwind class strings for form controls (mobile-first touch targets). */
export const inputClassName =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:text-sm";

export const selectClassName = inputClassName;

export const textareaClassName = `${inputClassName} min-h-[88px] resize-y`;

export const labelClassName = "text-sm font-medium text-slate-700";

export const pillActiveClassName = "bg-sky-600 text-white";

export const pillInactiveClassName =
  "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
