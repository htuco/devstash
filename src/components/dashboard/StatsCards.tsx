import { FolderHeart, Folders, Heart, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
};

export function StatsCards({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}) {
  const stats: Stat[] = [
    {
      label: "Items",
      value: totalItems,
      icon: LayoutGrid,
      iconClass: "text-blue-400",
    },
    {
      label: "Collections",
      value: totalCollections,
      icon: Folders,
      iconClass: "text-purple-400",
    },
    {
      label: "Favorite Items",
      value: favoriteItems,
      icon: Heart,
      iconClass: "text-pink-400",
    },
    {
      label: "Favorite Collections",
      value: favoriteCollections,
      icon: FolderHeart,
      iconClass: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <Icon className={`size-6 ${stat.iconClass}`} />
            </div>
            <p className="mt-2 text-4xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
