"use client";

import { useState } from "react";

import { RewardItemFormModal } from "@/components/admin/RewardItemFormModal";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  createRewardItem,
  updateRewardItem,
} from "@/lib/api/admin";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { RewardItem, RewardItemCreate, RewardItemUpdate } from "@/lib/api/types";
import { toNumber } from "@/lib/api/mappers";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import type { CatalogCategory } from "@/lib/types";

type RewardCatalogTableProps = {
  items: RewardItem[];
  onMutated: () => void;
};

export function RewardCatalogTable({ items, onMutated }: RewardCatalogTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RewardItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const openCreate = () => {
    setActionError(null);
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: RewardItem) => {
    setActionError(null);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (
    payload: RewardItemCreate | { id: string; body: RewardItemUpdate }
  ) => {
    if ("id" in payload) {
      await updateRewardItem(payload.id, payload.body);
    } else {
      await createRewardItem(payload);
    }
    onMutated();
  };

  const handleRemove = async (item: RewardItem) => {
    if (
      !window.confirm(
        `Remove "${item.name}" from the active catalog? Students and vendors will no longer see this item.`
      )
    ) {
      return;
    }
    setActionError(null);
    setBusyId(item.id);
    try {
      await updateRewardItem(item.id, { active: false });
      onMutated();
    } catch (err) {
      setActionError(getUserFacingErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Card
        title="Reward catalog"
        subtitle="Items students redeem with PTC Credits at campus vendors"
      >
        <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
          <Button type="button" className="px-3 py-1.5 text-xs" onClick={openCreate}>
            Add item
          </Button>
        </div>
        {actionError && (
          <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </p>
        )}
        {items.length === 0 ? (
          <EmptyState title="No catalog items" message="Add a reward catalog item to get started." />
        ) : (
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4 font-semibold">Item</th>
                  <th className="pb-2 pr-4 font-semibold">Category</th>
                  <th className="pb-2 pr-4 font-semibold">Price</th>
                  <th className="pb-2 pr-4 font-semibold">Inventory</th>
                  <th className="pb-2 pr-4 font-semibold">Active</th>
                  <th className="pb-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const busy = busyId === item.id;
                  const category = item.category as CatalogCategory;
                  const inventoryLabel =
                    item.inventory_count != null ? String(item.inventory_count) : "Unlimited";
                  return (
                    <tr key={item.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3 pr-4 text-slate-600">
                        {CATALOG_CATEGORY_LABELS[category] ?? item.category}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-sky-800">
                        {toNumber(item.price_tokens)} PTC
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{inventoryLabel}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge
                          label={item.active ? "Active" : "Inactive"}
                          variant={item.active ? "active" : "inactive"}
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                            onClick={() => openEdit(item)}
                          >
                            Edit
                          </Button>
                          {item.active && (
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={busy}
                              className="px-3 py-1.5 text-xs text-red-700"
                              onClick={() => handleRemove(item)}
                            >
                              {busy ? "Removing…" : "Remove"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <RewardItemFormModal
        open={modalOpen}
        item={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
