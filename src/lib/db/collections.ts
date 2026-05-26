import { prisma } from "@/lib/prisma";

export type CollectionTypeBreakdown = {
  typeId: string;
  typeName: string;
  count: number;
};

export type DashboardCollection = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  types: CollectionTypeBreakdown[];
  primaryTypeName: string | null;
};

export async function getRecentCollections(
  userId: string,
  limit = 6,
): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    take: limit,
    include: {
      items: {
        select: {
          typeId: true,
          type: { select: { name: true } },
        },
      },
    },
  });

  return collections.map((c) => {
    const counts = new Map<string, CollectionTypeBreakdown>();
    for (const item of c.items) {
      const existing = counts.get(item.typeId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(item.typeId, {
          typeId: item.typeId,
          typeName: item.type.name,
          count: 1,
        });
      }
    }

    const types = [...counts.values()].sort((a, b) => b.count - a.count);

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      isFavorite: c.isFavorite,
      itemCount: c.items.length,
      types,
      primaryTypeName: types[0]?.typeName ?? null,
    };
  });
}

export async function getCollectionStats(userId: string) {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
