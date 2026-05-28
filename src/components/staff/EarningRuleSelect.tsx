import { FormField, Select } from "@/components/shared/FormField";
import { EarningRule } from "@/lib/types";

type EarningRuleSelectProps = {
  rules: EarningRule[];
  value: string;
  onChange: (ruleId: string) => void;
  amountPreview?: number;
};

export function EarningRuleSelect({
  rules,
  value,
  onChange,
  amountPreview,
}: EarningRuleSelectProps) {
  return (
    <div className="space-y-2">
      <FormField label="Earning rule" htmlFor="earning-rule">
        <Select
          id="earning-rule"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Select earning rule"
        >
          <option value="">Choose a rule…</option>
          {rules.map((rule) => (
            <option key={rule.id} value={rule.id}>
              {rule.label} (+{rule.amount} PTC)
            </option>
          ))}
        </Select>
      </FormField>
      {amountPreview !== undefined && value && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          Preview: +{amountPreview} PTC Credits will be issued
        </p>
      )}
    </div>
  );
}
