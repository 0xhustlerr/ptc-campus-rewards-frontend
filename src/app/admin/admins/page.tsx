"use client";

import { useState } from "react";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { Button } from "@/components/shared/Button";
import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { FormField, Input } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { createAdminAccount, getAdminAccounts } from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { AdminAccount, UserStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/formatters";

function statusVariant(status: UserStatus): "active" | "inactive" | "pending" | "danger" {
  if (status === "active") return "active";
  if (status === "pending") return "pending";
  if (status === "suspended") return "danger";
  return "inactive";
}

const columns: ColumnDef<AdminAccount>[] = [
  {
    id: "email",
    header: "Email",
    cell: (account) => (
      <>
        <p className="font-medium text-slate-900">{account.email}</p>
        {account.phone && <p className="text-xs text-slate-500">{account.phone}</p>}
      </>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (account) => (
      <StatusBadge label={account.status} variant={statusVariant(account.status)} />
    ),
  },
  {
    id: "created",
    header: "Created",
    cell: (account) => <span className="text-slate-600">{formatDate(account.created_at)}</span>,
  },
];

export default function AdminAccountsPage() {
  const { data, isLoading, error, refresh } = useAsyncQuery(() => getAdminAccounts());
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setFormError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    setFormError(null);

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminAccount({
        email: email.trim(),
        password,
        phone: phone.trim() ? phone.trim() : null,
      });
      setSuccessMessage(
        "Administrator created. Share the sign-in credentials through a secure channel.",
      );
      closeModal();
      await refresh();
    } catch (err) {
      setFormError(getUserFacingErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Administrators"
          description="Create and view campus admin accounts"
        />
        <Button type="button" onClick={() => setModalOpen(true)} className="shrink-0">
          Add administrator
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4">
          <AlertBanner variant="success" message={successMessage} />
        </div>
      )}

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading administrators…"
        errorTitle="Unable to load administrators"
      >
        {data && (
          <DataTable
            columns={columns}
            data={data}
            getRowKey={(row) => row.id}
            emptyTitle="No administrators yet"
            emptyMessage="Create an admin account or bootstrap one via the ops CLI."
          />
        )}
      </AsyncBoundary>

      <AdminFormModal
        open={modalOpen}
        title="Add administrator"
        description="The new admin can sign in immediately. Share credentials securely."
        submitLabel="Create administrator"
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
        onClose={closeModal}
      >
        {formError && <AlertBanner variant="error" message={formError} />}

        <FormField label="Email" htmlFor="admin_email">
          <Input
            id="admin_email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ptc.edu"
          />
        </FormField>

        <FormField label="Password" htmlFor="admin_password" hint="At least 8 characters">
          <Input
            id="admin_password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <FormField label="Confirm password" htmlFor="admin_confirm_password">
          <Input
            id="admin_confirm_password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormField>

        <FormField label="Phone (optional)" htmlFor="admin_phone">
          <Input
            id="admin_phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 0100"
          />
        </FormField>
      </AdminFormModal>
    </>
  );
}
