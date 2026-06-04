"use client";

import { FormEvent, useState } from "react";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { FormField, Input } from "@/components/shared/FormField";
import { changePassword } from "@/lib/api/auth";
import { getUserFacingErrorMessage } from "@/lib/api/errors";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully.");
    } catch (err) {
      setFormError(getUserFacingErrorMessage(err, "Unable to update password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Security" subtitle="Update your sign-in password">
      {successMessage && (
        <div className="mb-4">
          <AlertBanner variant="success" message={successMessage} />
        </div>
      )}
      {formError && (
        <div className="mb-4">
          <AlertBanner variant="error" message={formError} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Current password" htmlFor="current_password">
          <Input
            id="current_password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </FormField>
        <FormField label="New password" htmlFor="new_password" hint="At least 8 characters">
          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </FormField>
        <FormField label="Confirm new password" htmlFor="confirm_new_password">
          <Input
            id="confirm_new_password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </FormField>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
