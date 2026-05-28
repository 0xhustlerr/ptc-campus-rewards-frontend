import { Card } from "@/components/shared/Card";
import { formatCredits } from "@/lib/formatters";
import { AdminReports } from "@/lib/types";

type ReportsOverviewProps = {
  reports: AdminReports;
};

export function ReportsOverview({ reports }: ReportsOverviewProps) {
  const maxEarned = Math.max(...reports.tokensEarnedByRule.map((r) => r.amount), 1);
  const maxRedeemed = Math.max(...reports.tokensRedeemedByCategory.map((r) => r.amount), 1);
  const maxVolume = Math.max(...reports.weeklyTransactionVolume.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="PTC earned by rule">
          <ul className="space-y-3">
            {reports.tokensEarnedByRule.map((row) => (
              <li key={row.rule}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{row.rule}</span>
                  <span className="font-semibold text-emerald-700">{formatCredits(row.amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(row.amount / maxEarned) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="PTC redeemed by category">
          <ul className="space-y-3">
            {reports.tokensRedeemedByCategory.map((row) => (
              <li key={row.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{row.category}</span>
                  <span className="font-semibold text-amber-700">{formatCredits(row.amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${(row.amount / maxRedeemed) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Weekly transaction volume">
        <div className="flex items-end justify-between gap-2 h-32">
          {reports.weeklyTransactionVolume.map((day) => (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full max-w-[40px] rounded-t-lg bg-sky-500"
                style={{ height: `${(day.count / maxVolume) * 100}%`, minHeight: "8px" }}
              />
              <span className="text-xs font-medium text-slate-600">{day.day}</span>
              <span className="text-xs text-slate-400">{day.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Top active students">
        <ol className="space-y-2">
          {reports.topActiveStudents.map((student, index) => (
            <li
              key={student.name}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-900">
                {index + 1}. {student.name}
              </span>
              <span className="text-slate-600">{student.activityCount} activities</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
