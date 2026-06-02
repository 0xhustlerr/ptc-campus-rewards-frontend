"use client";

import { ReactNode } from "react";

import { Button } from "@/components/shared/Button";

type AdminFormModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

export function AdminFormModal({
  open,
  title,
  description,
  children,
  submitLabel,
  isSubmitting,
  onSubmit,
  onClose,
}: AdminFormModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-form-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="admin-form-modal-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
