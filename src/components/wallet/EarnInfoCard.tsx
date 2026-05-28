import { Card } from "@/components/shared/Card";

const EARN_WAYS = [
  { label: "On-time attendance", credits: "+1 PTC" },
  { label: "Haircut completed", credits: "+2 PTC" },
  { label: "Quiz passed", credits: "+3 PTC" },
  { label: "Clean station", credits: "+1 PTC" },
  { label: "Perfect attendance bonus", credits: "+10 PTC" },
];

export function EarnInfoCard() {
  return (
    <Card title="How you earn" subtitle="Keep showing up and doing great work on campus">
      <ul className="space-y-2">
        {EARN_WAYS.map((way) => (
          <li
            key={way.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="text-slate-700">{way.label}</span>
            <span className="font-semibold text-emerald-700">{way.credits}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
