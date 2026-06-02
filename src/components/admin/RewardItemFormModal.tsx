"use client";

import { useEffect, useState } from "react";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { FormField, Input, Select } from "@/components/shared/FormField";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { RewardCategory, RewardItem, RewardItemCreate, RewardItemUpdate } from "@/lib/api/types";
import type { CatalogCategory } from "@/lib/types";

type RewardItemFormModalProps = {
  open: boolean;
  item: RewardItem | null;
  onClose: () => void;
  onSave: (payload: RewardItemCreate | { id: string; body: RewardItemUpdate }) => Promise<void>;
};

type FormState = {
  name: string;
  category: RewardCategory;
  priceTokens: string;
  inventoryCount: string;
  active: boolean;
};

const CATEGORIES = Object.keys(CATALOG_CATEGORY_LABELS) as CatalogCategory[];

function emptyForm(): FormState {
  return {
    name: "",
    category: "food_truck",
    priceTokens: "1",
    inventoryCount: "",
    active: true,
  };
}

function fromItem(item: RewardItem): FormState {
  return {
    name: item.name,
    category: item.category,
    priceTokens: item.price_tokens,
    inventoryCount: item.inventory_count != null ? String(item.inventory_count) : "",
    active: item.active,
  };
}

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number.parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : null;
}

export function RewardItemFormModal({ open, item, onClose, onSave }: RewardItemFormModalProps) {
  const isEdit = item !== null;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(item ? fromItem(item) : emptyForm());
  }, [open, item]);

  const handleSubmit = async () => {
    setError(null);
    const name = form.name.trim();
    const priceTokens = form.priceTokens.trim();
    if (!name) {
      setError("Item name is required.");
      return;
    }
    if (!priceTokens || Number.isNaN(Number(priceTokens))) {
      setError("Enter a valid price in PTC.");
      return;
    }

    const inventoryCount = parseOptionalInt(form.inventoryCount);

    if (!isEdit) {
      const body: RewardItemCreate = {
        name,
        category: form.category,
        price_tokens: priceTokens,
        inventory_count: inventoryCount,
        active: form.active,
      };
      setIsSubmitting(true);
      try {
        await onSave(body);
        onClose();
      } catch (err) {
        setError(getUserFacingErrorMessage(err, "Unable to save catalog item."));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const body: RewardItemUpdate = {
      name,
      category: form.category,
      price_tokens: priceTokens,
      inventory_count: inventoryCount,
      active: form.active,
    };
    setIsSubmitting(true);
    try {
      await onSave({ id: item.id, body });
      onClose();
    } catch (err) {
      setError(getUserFacingErrorMessage(err, "Unable to save catalog item."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit catalog item" : "Add catalog item"}
      description={
        isEdit
          ? "Update redemption pricing, category, and availability."
          : "Add an item students can redeem with PTC Credits."
      }
      submitLabel={isEdit ? "Save changes" : "Add item"}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <FormField label="Item name" htmlFor="item-name">
        <Input
          id="item-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </FormField>
      <FormField label="Category" htmlFor="item-category">
        <Select
          id="item-category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as RewardCategory }))}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATALOG_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Price (PTC)" htmlFor="item-price">
        <Input
          id="item-price"
          type="number"
          min="0"
          step="0.01"
          value={form.priceTokens}
          onChange={(e) => setForm((f) => ({ ...f, priceTokens: e.target.value }))}
          required
        />
      </FormField>
      <FormField label="Inventory" htmlFor="item-inventory" hint="Leave blank for unlimited stock">
        <Input
          id="item-inventory"
          type="number"
          min="0"
          step="1"
          value={form.inventoryCount}
          onChange={(e) => setForm((f) => ({ ...f, inventoryCount: e.target.value }))}
        />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          className="rounded border-slate-300"
        />
        Active (visible in student and vendor catalogs)
      </label>
    </AdminFormModal>
  );
}
