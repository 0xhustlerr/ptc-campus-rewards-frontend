import { Card } from "@/components/shared/Card";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { formatCreditsShort, formatWalletStatus } from "@/lib/formatters";
import { ScannedWallet } from "@/lib/types";

type ScannedWalletCardProps = {
  wallet: ScannedWallet;
};

export function ScannedWalletCard({ wallet }: ScannedWalletCardProps) {
  return (
    <Card title="Scanned wallet" subtitle="Session verified — no personal ID exposed">
      <KeyValueList
        items={[
          { label: "Student", value: wallet.studentName },
          {
            label: "Balance",
            value: formatCreditsShort(wallet.balance),
            valueClassName: "text-lg font-bold text-sky-800",
          },
          {
            label: "Status",
            value: formatWalletStatus(wallet.status),
            valueClassName: "text-emerald-700",
          },
          ...(wallet.expiresInSeconds !== undefined
            ? [
                {
                  label: "Session",
                  value: `Expires in ${wallet.expiresInSeconds}s`,
                  valueClassName: "text-amber-700",
                },
              ]
            : []),
        ]}
      />
    </Card>
  );
}
