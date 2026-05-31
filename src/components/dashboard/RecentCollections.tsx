import Link from "next/link";
import { MoreHorizontal, Star } from "lucide-react";
import type { DashboardCollection } from "@/lib/db/collections";
import { cn } from "@/lib/utils";
import {
  TypeIcon,
  getIconNameForType,
  getTypeBorderColor,
} from "./TypeIcon";

export function RecentCollections({
  collections,
}: {
  collections: DashboardCollection[];
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ collection }: { collection: DashboardCollection }) {
  const borderColor = getTypeBorderColor(collection.primaryTypeName);

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "group flex flex-col rounded-lg border border-border border-l-4 bg-card p-4 transition-colors hover:bg-accent/40",
        borderColor,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-medium">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {collection.itemCount}{" "}
            {collection.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <MoreHorizontal className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {collection.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {collection.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        {collection.types.map((t) => (
          <TypeIcon
            key={t.typeId}
            typeId={t.typeName}
            iconName={getIconNameForType(t.typeName)}
          />
        ))}
      </div>
    </Link>
  );
}
