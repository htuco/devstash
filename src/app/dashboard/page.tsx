import { Clock, Pin } from "lucide-react";
import { ItemRow } from "@/components/dashboard/ItemRow";
import { RecentCollections } from "@/components/dashboard/RecentCollections";
import { StatsCards } from "@/components/dashboard/StatsCards";
import {
  getCollectionStats,
  getRecentCollections,
} from "@/lib/db/collections";
import {
  getItemStats,
  getPinnedItems,
  getRecentItems,
} from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@devstash.io";

export default async function DashboardPage() {
  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });

  const [recentCollections, collectionStats, pinnedItems, recentItems, itemStats] =
    demoUser
      ? await Promise.all([
          getRecentCollections(demoUser.id),
          getCollectionStats(demoUser.id),
          getPinnedItems(demoUser.id),
          getRecentItems(demoUser.id),
          getItemStats(demoUser.id),
        ])
      : [[], { total: 0, favorites: 0 }, [], [], { total: 0, favorites: 0 }];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your developer knowledge hub
        </p>
      </header>

      <StatsCards
        totalItems={itemStats.total}
        totalCollections={collectionStats.total}
        favoriteItems={itemStats.favorites}
        favoriteCollections={collectionStats.favorites}
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
