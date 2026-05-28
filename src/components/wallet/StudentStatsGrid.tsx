import { StatCard, StatGrid } from "@/components/shared/StatCard";
import { formatCreditsShort } from "@/lib/formatters";
import { StudentWalletStats } from "@/lib/types";

type StudentStatsGridProps = {
  stats: StudentWalletStats;
};

export function StudentStatsGrid({ stats }: StudentStatsGridProps) {
  const attendancePercent = Math.round(
    (stats.perfectAttendanceDays / stats.perfectAttendanceTarget) * 100,
  );

  return (
    <StatGrid columns={2}>
      <StatCard label="Earned this week" value={formatCreditsShort(stats.earnedThisWeek)} tone="earn" />
      <StatCard
        label="Redeemed this week"
        value={formatCreditsShort(stats.redeemedThisWeek)}
        tone="redeem"
      />
      <StatCard label="Current streak" value={`${stats.currentStreak} days`} />
      <StatCard
        label="Perfect attendance"
        value={`${stats.perfectAttendanceDays}/${stats.perfectAttendanceTarget} days`}
        hint={`${attendancePercent}% complete`}
        tone="brand"
      />
    </StatGrid>
  );
}
