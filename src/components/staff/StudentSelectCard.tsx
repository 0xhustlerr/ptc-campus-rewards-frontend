import { EmptyPlaceholder } from "@/components/shared/EmptyPlaceholder";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { formatCreditsShort, formatWalletStatus } from "@/lib/formatters";
import { StaffStudent } from "@/lib/types";

type StudentSelectCardProps = {
  student: StaffStudent | null;
};

export function StudentSelectCard({ student }: StudentSelectCardProps) {
  if (!student) {
    return (
      <EmptyPlaceholder
        title="No student selected"
        message="Search or select a student from the table to issue PTC Credits."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Selected student</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{student.name}</h3>
      <p className="text-sm text-slate-600">{student.email}</p>
      <KeyValueList
        className="mt-4"
        items={[
          { label: "Cohort", value: student.cohort },
          { label: "Balance", value: formatCreditsShort(student.balance), valueClassName: "text-sky-700" },
          { label: "Status", value: formatWalletStatus(student.status), valueClassName: "text-emerald-700" },
          { label: "Wallet", value: student.walletId, valueClassName: "font-mono text-xs" },
        ]}
      />
    </div>
  );
}
