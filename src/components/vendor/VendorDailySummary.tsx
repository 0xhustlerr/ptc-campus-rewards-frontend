import { Card } from "@/components/shared/Card";
import { StatCard, StatGrid } from "@/components/shared/StatCard";
import { formatCredits } from "@/lib/formatters";
import { VendorDailySummary as Summary } from "@/lib/types";

type VendorDailySummaryProps = {
  summary: Summary;
};

export function VendorDailySummary({ summary }: VendorDailySummaryProps) {
  return (
    <Card title="Today at your stand">
      <StatGrid columns={3}>
        <StatCard label="Redemptions" value={summary.redemptionCount} />
        <StatCard label="PTC redeemed" value={formatCredits(summary.totalCreditsRedeemed)} tone="brand" />
        <StatCard label="Top item" value={summary.topItem} />
      </StatGrid>
    </Card>
  );
}
