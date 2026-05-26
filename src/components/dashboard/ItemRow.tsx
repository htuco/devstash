import Link from "next/link";
import { Pin, Star } from "lucide-react";
import { itemTypes, type Item } from "@/lib/mock-data";
import { TypeIcon } from "./TypeIcon";

export function ItemRow({ item }: { item: Item }) {
  const type = itemTypes.find((t) => t.id === item.typeId);
  const dateLabel = new Date(item.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/items/${item.id}`}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/40"
    >
      {type && (
        <div className="mt-0.5">
          <TypeIcon typeId={type.id} iconName={type.icon} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-medium">{item.title}</h3>
          {item.isPinned && <Pin className="size-3.5 shrink-0 text-muted-foreground" />}
          {item.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
          )}
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {item.description}
        </p>

        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">{dateLabel}</span>
    </Link>
  );
}
