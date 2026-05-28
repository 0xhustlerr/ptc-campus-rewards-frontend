import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { formatCreditsShort, formatDate } from "@/lib/formatters";
import { RedemptionReceipt as Receipt } from "@/lib/types";

type RedemptionReceiptProps = {
  receipt: Receipt;
  onDone: () => void;
};

export function RedemptionReceipt({ receipt, onDone }: RedemptionReceiptProps) {
  return (
    <Card title="Redemption successful" className="border-emerald-200 bg-emerald-50/50">
      <div className="space-y-3 text-sm">
        <p className="text-emerald-800">
          <span className="font-semibold">{receipt.studentName}</span> redeemed{" "}
          <span className="font-semibold">{receipt.itemName}</span>
        </p>
        <KeyValueList
          className="rounded-xl bg-white p-3"
          items={[
            ...(receipt.balanceBefore !== undefined
              ? [
                  {
                    label: "Previous balance",
                    value: formatCreditsShort(receipt.balanceBefore),
                  },
                ]
              : []),
            {
              label: "Deducted",
              value: `−${formatCreditsShort(receipt.amount)}`,
              valueClassName: "text-amber-700 font-semibold",
            },
            {
              label: "New balance",
              value: formatCreditsShort(receipt.newBalance),
              valueClassName: "text-sky-800 font-bold",
            },
            { label: "Vendor", value: receipt.vendorName },
            { label: "Time", value: formatDate(receipt.redeemedAt) },
          ]}
        />
        <Button type="button" onClick={onDone} className="w-full">
          Done — scan next student
        </Button>
      </div>
    </Card>
  );
}
