import { StatCard } from "@/components/shared/StatCard";

type AdminMetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

/** @deprecated Use StatCard directly */
export function AdminMetricCard(props: AdminMetricCardProps) {
  return <StatCard {...props} />;
}
