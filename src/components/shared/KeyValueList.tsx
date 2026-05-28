import { ReactNode } from "react";

type KeyValueItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

type KeyValueListProps = {
  items: KeyValueItem[];
  className?: string;
};

export function KeyValueList({ items, className = "" }: KeyValueListProps) {
  return (
    <dl className={`space-y-2 text-sm ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4">
          <dt className="text-slate-500">{item.label}</dt>
          <dd className={`text-right font-medium text-slate-900 ${item.valueClassName ?? ""}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
