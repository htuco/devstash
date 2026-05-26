import { Clock, Pin } from "lucide-react";
import { ItemRow } from "@/components/dashboard/ItemRow";
import { RecentCollections } from "@/components/dashboard/RecentCollections";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { collections, items } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalItems = items.length;
  const totalCollections = collections.length;
  const favoriteItems = items.filter((i) => i.isFavorite).length;
  const favoriteCollections = collections.filter((c) => c.isFavorite).length;

  const recentCollections = [...collections]
    .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))
    .slice(0, 6);

  const pinnedItems = items.filter((i) => i.isPinned);

  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your developer knowledge hub
        </p>
      </header>

      <StatsCards
        totalItems={totalItems}
        totalCollections={totalCollections}
        favoriteItems={favoriteItems}
        favoriteCollections={favoriteCollections}
      />

      <RecentCollections collections={recentCollections} />

      {pinnedItems.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Pin className="size-4 text-muted-foreground" />
            Pinned
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="size-4 text-muted-foreground" />
          Recent
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
