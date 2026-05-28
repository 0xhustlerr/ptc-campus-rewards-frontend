"use client";

import { pillActiveClassName, pillInactiveClassName } from "@/lib/ui-classes";

export type PillOption<T extends string> = {
  value: T;
  label: string;
};

type CategoryPillsProps<T extends string> = {
  options: readonly PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

export function CategoryPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "Filter categories",
}: CategoryPillsProps<T>) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
              isActive ? pillActiveClassName : pillInactiveClassName
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
