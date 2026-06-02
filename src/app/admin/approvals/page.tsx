"use client";

import { useEffect, useState } from "react";

import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { FormField, Input, Select } from "@/components/shared/FormField";
import { KeyValueList } from "@/components/shared/KeyValueList";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { getPendingRegistrations, updateUserStatus } from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type {
  AdminUserStatusUpdate,
  PendingRegistration,
  VendorType,
} from "@/lib/api/types";

type StudentProfileDraft = {
  student_number: string;
  first_name: string;
  last_name: string;
  cohort: string;
  program: string;
};

type StaffProfileDraft = {
  first_name: string;
  last_name: string;
  department: string;
};

type VendorProfileDraft = {
  vendor_name: string;
  vendor_type: VendorType;
};

const VENDOR_TYPE_OPTIONS: Array<{ value: VendorType; label: string }> = [
  { value: "food_truck", label: "Food truck" },
  { value: "school_store", label: "School store" },
  { value: "campus_perk", label: "Campus perk" },
];

const emptyStudentProfile = (): StudentProfileDraft => ({
  student_number: "",
  first_name: "",
  last_name: "",
  cohort: "",
  program: "",
});

const emptyStaffProfile = (): StaffProfileDraft => ({
  first_name: "",
  last_name: "",
  department: "",
});

const emptyVendorProfile = (): VendorProfileDraft => ({
  vendor_name: "",
  vendor_type: "food_truck",
});

function formatRegisteredAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatVendorType(type: VendorType): string {
  return VENDOR_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

function registrationSummary(registration: PendingRegistration): string | null {
  if (registration.role === "student") {
    const profile = registration.student_profile;
    if (!profile) return "Profile incomplete";
    return `${profile.first_name} ${profile.last_name} · ${profile.student_number}`;
  }
  if (registration.role === "staff") {
    const profile = registration.staff_profile;
    if (!profile) return "Profile incomplete";
    const name = `${profile.first_name} ${profile.last_name}`;
    return profile.department ? `${name} · ${profile.department}` : name;
  }
  if (registration.role === "vendor") {
    const profile = registration.vendor_profile;
    if (!profile) return "Profile incomplete";
    return `${profile.name} · ${formatVendorType(profile.vendor_type)}`;
  }
  return null;
}

function hasCompleteProfile(registration: PendingRegistration): boolean {
  if (registration.role === "student") return Boolean(registration.student_profile);
  if (registration.role === "staff") return Boolean(registration.staff_profile);
  if (registration.role === "vendor") return Boolean(registration.vendor_profile);
  return true;
}

export default function AdminApprovalsPage() {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [studentDrafts, setStudentDrafts] = useState<Record<string, StudentProfileDraft>>({});
  const [staffDrafts, setStaffDrafts] = useState<Record<string, StaffProfileDraft>>({});
  const [vendorDrafts, setVendorDrafts] = useState<Record<string, VendorProfileDraft>>({});
  const { data, isLoading, error, refresh } = useAsyncQuery(() => getPendingRegistrations());

  useEffect(() => {
    if (!data) return;
    setStudentDrafts((prev) => {
      const next = { ...prev };
      for (const registration of data) {
        const profile = registration.student_profile;
        if (profile && !next[registration.id]) {
          next[registration.id] = {
            student_number: profile.student_number,
            first_name: profile.first_name,
            last_name: profile.last_name,
            cohort: profile.cohort ?? "",
            program: profile.program ?? "",
          };
        }
      }
      return next;
    });
    setStaffDrafts((prev) => {
      const next = { ...prev };
      for (const registration of data) {
        const profile = registration.staff_profile;
        if (profile && !next[registration.id]) {
          next[registration.id] = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            department: profile.department ?? "",
          };
        }
      }
      return next;
    });
    setVendorDrafts((prev) => {
      const next = { ...prev };
      for (const registration of data) {
        const profile = registration.vendor_profile;
        if (profile && !next[registration.id]) {
          next[registration.id] = {
            vendor_name: profile.name,
            vendor_type: profile.vendor_type,
          };
        }
      }
      return next;
    });
  }, [data]);

  const getStudentDraft = (userId: string): StudentProfileDraft =>
    studentDrafts[userId] ?? emptyStudentProfile();

  const getStaffDraft = (userId: string): StaffProfileDraft =>
    staffDrafts[userId] ?? emptyStaffProfile();

  const getVendorDraft = (userId: string): VendorProfileDraft =>
    vendorDrafts[userId] ?? emptyVendorProfile();

  const setStudentField = (
    userId: string,
    field: keyof StudentProfileDraft,
    value: string,
  ) => {
    setStudentDrafts((prev) => ({
      ...prev,
      [userId]: { ...getStudentDraft(userId), [field]: value },
    }));
  };

  const setStaffField = (
    userId: string,
    field: keyof StaffProfileDraft,
    value: string,
  ) => {
    setStaffDrafts((prev) => ({
      ...prev,
      [userId]: { ...getStaffDraft(userId), [field]: value },
    }));
  };

  const setVendorField = (
    userId: string,
    field: keyof VendorProfileDraft,
    value: string,
  ) => {
    setVendorDrafts((prev) => ({
      ...prev,
      [userId]: { ...getVendorDraft(userId), [field]: value } as VendorProfileDraft,
    }));
  };

  const toggleExpanded = (userId: string) => {
    setExpandedUserId((current) => (current === userId ? null : userId));
  };

  const handleAction = async (registration: PendingRegistration, nextStatus: "active" | "suspended") => {
    setActionError(null);
    setUpdatingUserId(registration.id);
    try {
      const body: AdminUserStatusUpdate = { status: nextStatus };
      if (
        registration.role === "student" &&
        nextStatus === "active" &&
        !registration.student_profile
      ) {
        const draft = getStudentDraft(registration.id);
        body.student_number = draft.student_number.trim();
        body.first_name = draft.first_name.trim();
        body.last_name = draft.last_name.trim();
        body.cohort = draft.cohort.trim() ? draft.cohort.trim() : null;
        body.program = draft.program.trim() ? draft.program.trim() : null;
      }
      if (
        registration.role === "staff" &&
        nextStatus === "active" &&
        !registration.staff_profile
      ) {
        const draft = getStaffDraft(registration.id);
        body.first_name = draft.first_name.trim();
        body.last_name = draft.last_name.trim();
        body.department = draft.department.trim() ? draft.department.trim() : null;
      }
      if (
        registration.role === "vendor" &&
        nextStatus === "active" &&
        !registration.vendor_profile
      ) {
        const draft = getVendorDraft(registration.id);
        body.vendor_name = draft.vendor_name.trim();
        body.vendor_type = draft.vendor_type;
      }
      await updateUserStatus(registration.id, body);
      setExpandedUserId(null);
      refresh();
    } catch (err) {
      setActionError(getUserFacingErrorMessage(err));
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Registration approvals"
        description="Approve or reject pending user registrations"
      />
      {actionError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </p>
      )}
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading pending registrations…"
        errorTitle="Unable to load pending registrations"
      >
        {data && data.length === 0 && (
          <EmptyState
            title="No pending registrations"
            message="New registrations requiring approval will appear here."
          />
        )}
        {data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((registration) => {
              const busy = updatingUserId === registration.id;
              const expanded = expandedUserId === registration.id;
              const summary = registrationSummary(registration);
              const profileComplete = hasCompleteProfile(registration);
              const studentProfile = registration.student_profile;
              const staffProfile = registration.staff_profile;
              const vendorProfile = registration.vendor_profile;
              const studentDraft = getStudentDraft(registration.id);
              const staffDraft = getStaffDraft(registration.id);
              const vendorDraft = getVendorDraft(registration.id);

              const detailItems = [
                { label: "Email", value: registration.email },
                { label: "Phone", value: registration.phone ?? "—" },
                { label: "Registered", value: formatRegisteredAt(registration.created_at) },
                ...(studentProfile
                  ? [
                      {
                        label: "Student number",
                        value: studentProfile.student_number,
                        valueClassName: "font-mono text-xs",
                      },
                      {
                        label: "Name",
                        value: `${studentProfile.first_name} ${studentProfile.last_name}`,
                      },
                      { label: "Cohort", value: studentProfile.cohort ?? "—" },
                      { label: "Program", value: studentProfile.program ?? "—" },
                    ]
                  : []),
                ...(staffProfile
                  ? [
                      {
                        label: "Name",
                        value: `${staffProfile.first_name} ${staffProfile.last_name}`,
                      },
                      { label: "Department", value: staffProfile.department ?? "—" },
                    ]
                  : []),
                ...(vendorProfile
                  ? [
                      { label: "Business name", value: vendorProfile.name },
                      {
                        label: "Vendor type",
                        value: formatVendorType(vendorProfile.vendor_type),
                      },
                    ]
                  : []),
              ];

              return (
                <div
                  key={registration.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => toggleExpanded(registration.id)}
                      aria-expanded={expanded}
                    >
                      <p className="font-medium text-slate-900">{registration.email}</p>
                      <p className="text-sm capitalize text-slate-600">
                        {registration.role} · {registration.status}
                      </p>
                      {summary && (
                        <p
                          className={`mt-1 text-sm ${
                            profileComplete ? "font-medium text-sky-800" : "text-amber-700"
                          }`}
                        >
                          {summary}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {expanded ? "Hide details" : "View details"}
                      </p>
                    </button>
                    <div className="flex gap-2">
                      <Button
                        disabled={busy}
                        className="px-3 py-1.5 text-xs"
                        onClick={() => handleAction(registration, "active")}
                      >
                        {busy ? "Working…" : "Approve"}
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={busy}
                        className="px-3 py-1.5 text-xs"
                        onClick={() => handleAction(registration, "suspended")}
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                      <KeyValueList items={detailItems} />

                      {registration.role === "student" && !studentProfile && (
                        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                          <p className="text-xs text-slate-500 sm:col-span-2">
                            Student profile required before approval (not provided at sign-up)
                          </p>
                          <FormField label="Student number" htmlFor={`sn-${registration.id}`}>
                            <Input
                              id={`sn-${registration.id}`}
                              value={studentDraft.student_number}
                              onChange={(e) =>
                                setStudentField(registration.id, "student_number", e.target.value)
                              }
                              placeholder="PTC-12345"
                            />
                          </FormField>
                          <FormField label="First name" htmlFor={`fn-${registration.id}`}>
                            <Input
                              id={`fn-${registration.id}`}
                              value={studentDraft.first_name}
                              onChange={(e) =>
                                setStudentField(registration.id, "first_name", e.target.value)
                              }
                            />
                          </FormField>
                          <FormField label="Last name" htmlFor={`ln-${registration.id}`}>
                            <Input
                              id={`ln-${registration.id}`}
                              value={studentDraft.last_name}
                              onChange={(e) =>
                                setStudentField(registration.id, "last_name", e.target.value)
                              }
                            />
                          </FormField>
                          <FormField label="Cohort (optional)" htmlFor={`cohort-${registration.id}`}>
                            <Input
                              id={`cohort-${registration.id}`}
                              value={studentDraft.cohort}
                              onChange={(e) =>
                                setStudentField(registration.id, "cohort", e.target.value)
                              }
                            />
                          </FormField>
                          <FormField label="Program (optional)" htmlFor={`program-${registration.id}`}>
                            <Input
                              id={`program-${registration.id}`}
                              value={studentDraft.program}
                              onChange={(e) =>
                                setStudentField(registration.id, "program", e.target.value)
                              }
                            />
                          </FormField>
                        </div>
                      )}

                      {registration.role === "staff" && !staffProfile && (
                        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                          <p className="text-xs text-slate-500 sm:col-span-2">
                            Staff profile required before approval (not provided at sign-up)
                          </p>
                          <FormField label="First name" htmlFor={`sfn-${registration.id}`}>
                            <Input
                              id={`sfn-${registration.id}`}
                              value={staffDraft.first_name}
                              onChange={(e) =>
                                setStaffField(registration.id, "first_name", e.target.value)
                              }
                            />
                          </FormField>
                          <FormField label="Last name" htmlFor={`sln-${registration.id}`}>
                            <Input
                              id={`sln-${registration.id}`}
                              value={staffDraft.last_name}
                              onChange={(e) =>
                                setStaffField(registration.id, "last_name", e.target.value)
                              }
                            />
                          </FormField>
                          <FormField
                            label="Department (optional)"
                            htmlFor={`sdept-${registration.id}`}
                            className="sm:col-span-2"
                          >
                            <Input
                              id={`sdept-${registration.id}`}
                              value={staffDraft.department}
                              onChange={(e) =>
                                setStaffField(registration.id, "department", e.target.value)
                              }
                            />
                          </FormField>
                        </div>
                      )}

                      {registration.role === "vendor" && !vendorProfile && (
                        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                          <p className="text-xs text-slate-500 sm:col-span-2">
                            Vendor profile required before approval (not provided at sign-up)
                          </p>
                          <FormField label="Business name" htmlFor={`vn-${registration.id}`}>
                            <Input
                              id={`vn-${registration.id}`}
                              value={vendorDraft.vendor_name}
                              onChange={(e) =>
                                setVendorField(registration.id, "vendor_name", e.target.value)
                              }
                              placeholder="Campus Food Truck"
                            />
                          </FormField>
                          <FormField label="Vendor type" htmlFor={`vt-${registration.id}`}>
                            <Select
                              id={`vt-${registration.id}`}
                              value={vendorDraft.vendor_type}
                              onChange={(e) =>
                                setVendorField(
                                  registration.id,
                                  "vendor_type",
                                  e.target.value,
                                )
                              }
                            >
                              {VENDOR_TYPE_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </Select>
                          </FormField>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
