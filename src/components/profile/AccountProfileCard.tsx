"use client";

import { Card } from "@/components/shared/Card";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ROLE_LABELS } from "@/lib/constants";
import type { User, UserStatus, VendorType } from "@/lib/api/types";

const VENDOR_TYPE_LABELS: Record<VendorType, string> = {
  food_truck: "Food Truck",
  school_store: "School Store",
  campus_perk: "Campus Perk",
};

function statusVariant(status: UserStatus): "active" | "inactive" | "pending" | "danger" {
  if (status === "active") return "active";
  if (status === "pending") return "pending";
  if (status === "suspended") return "danger";
  return "inactive";
}

function displayName(user: User): string {
  if (user.staff_profile) {
    return `${user.staff_profile.first_name} ${user.staff_profile.last_name}`.trim();
  }
  if (user.student_profile) {
    return `${user.student_profile.first_name} ${user.student_profile.last_name}`.trim();
  }
  if (user.vendor_profile?.name) {
    return user.vendor_profile.name;
  }
  const localPart = user.email.split("@")[0] ?? "User";
  return localPart.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type AccountProfileCardProps = {
  user: User;
};

export function AccountProfileCard({ user }: AccountProfileCardProps) {
  const name = displayName(user);

  const roleSpecificItems: Array<{ label: string; value: string; valueClassName?: string }> = [];

  if (user.student_profile) {
    roleSpecificItems.push(
      { label: "Student number", value: user.student_profile.student_number },
      { label: "Program", value: user.student_profile.program ?? "—" },
      { label: "Cohort", value: user.student_profile.cohort ?? "—" },
    );
  }
  if (user.staff_profile) {
    roleSpecificItems.push(
      { label: "Department", value: user.staff_profile.department ?? "—" },
    );
  }
  if (user.vendor_profile) {
    roleSpecificItems.push(
      { label: "Vendor", value: user.vendor_profile.name },
      {
        label: "Type",
        value: VENDOR_TYPE_LABELS[user.vendor_profile.vendor_type] ?? user.vendor_profile.vendor_type,
      },
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-800">
          {initials(name)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <KeyValueList
          items={[
            { label: "Role", value: ROLE_LABELS[user.role] },
            {
              label: "Account status",
              value: (
                <StatusBadge label={user.status} variant={statusVariant(user.status)} />
              ),
            },
            { label: "Phone", value: user.phone ?? "—" },
            ...roleSpecificItems,
          ]}
        />
      </div>
    </Card>
  );
}
