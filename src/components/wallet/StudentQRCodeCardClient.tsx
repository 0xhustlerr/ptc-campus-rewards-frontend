"use client";

import dynamic from "next/dynamic";

import { Card } from "@/components/shared/Card";

const StudentQRCodeCard = dynamic(
  () =>
    import("@/components/wallet/StudentQRCodeCard").then((mod) => mod.StudentQRCodeCard),
  {
    ssr: false,
    loading: () => (
      <Card title="Campus QR" subtitle="Show this at approved vendors to redeem rewards">
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-slate-500" role="status">
            Preparing secure QR…
          </p>
        </div>
      </Card>
    ),
  },
);

export function StudentQRCodeCardClient() {
  return <StudentQRCodeCard />;
}
