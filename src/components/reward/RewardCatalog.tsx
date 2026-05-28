import { RewardItemCard } from "@/components/reward/RewardItemCard";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/FeedbackStates";
import { CATALOG_CATEGORY_LABELS } from "@/lib/constants";
import { CatalogCategory, CatalogRewardItem } from "@/lib/types";

type RewardCatalogProps = {
  items: CatalogRewardItem[];
  balance: number;
  filterCategory?: CatalogCategory;
};

export function RewardCatalog({ items, balance, filterCategory }: RewardCatalogProps) {
  const filtered = filterCategory
    ? items.filter((item) => item.category === filterCategory)
    : items;

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No rewards in this category"
        message="Check back soon for new campus redemption options."
      />
    );
  }

  const grouped = filtered.reduce<Record<CatalogCategory, CatalogRewardItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<CatalogCategory, CatalogRewardItem[]>,
  );

  const categories = filterCategory
    ? [filterCategory]
    : (Object.keys(grouped) as CatalogCategory[]);

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category} title={CATALOG_CATEGORY_LABELS[category]}>
          <ul className="space-y-3">
            {grouped[category].map((item) => (
              <li key={item.id}>
                <RewardItemCard item={item} balance={balance} />
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
