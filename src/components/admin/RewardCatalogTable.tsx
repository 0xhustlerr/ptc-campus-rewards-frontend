import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import { CatalogRewardItem } from "@/lib/types";

const columns: ColumnDef<CatalogRewardItem>[] = [
  { id: "item", header: "Item", cell: (i) => <span className="font-medium">{i.name}</span> },
  {
    id: "category",
    header: "Category",
    cell: (i) => CATALOG_CATEGORY_LABELS[i.category],
  },
  {
    id: "price",
    header: "Price",
    cell: (i) => <span className="font-semibold text-sky-800">{i.creditsCost} PTC</span>,
  },
  { id: "vendor", header: "Vendor", cell: (i) => <span className="text-slate-600">{i.vendor}</span> },
  {
    id: "active",
    header: "Active",
    cell: (i) => (
      <StatusBadge
        label={i.available ? "Active" : "Inactive"}
        variant={i.available ? "active" : "inactive"}
      />
    ),
  },
];

type RewardCatalogTableProps = {
  items: CatalogRewardItem[];
};

export function RewardCatalogTable({ items }: RewardCatalogTableProps) {
  return (
    <DataTable
      title="Reward catalog"
      columns={columns}
      data={items}
      getRowKey={(i) => i.id}
      emptyTitle="No catalog items"
      emptyMessage="Reward catalog items will appear here."
      minWidth={560}
    />
  );
}
