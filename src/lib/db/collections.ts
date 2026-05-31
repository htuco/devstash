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

async function getTypeBreakdownByCollection(
  userId: string,
  collectionIds: string[],
): Promise<Map<string, CollectionTypeBreakdown[]>> {
  const result = new Map<string, CollectionTypeBreakdown[]>();
  if (collectionIds.length === 0) return result;

  const [grouped, types] = await Promise.all([
    prisma.item.groupBy({
      by: ["collectionId", "typeId"],
      where: { userId, collectionId: { in: collectionIds } },
      _count: { _all: true },
    }),
    prisma.itemType.findMany({
      where: { items: { some: { userId, collectionId: { in: collectionIds } } } },
      select: { id: true, name: true },
    }),
  ]);

  const typeNameById = new Map(types.map((t) => [t.id, t.name]));

  for (const row of grouped) {
    if (!row.collectionId) continue;
    const entry: CollectionTypeBreakdown = {
      typeId: row.typeId,
      typeName: typeNameById.get(row.typeId) ?? "unknown",
      count: row._count._all,
    };
    const list = result.get(row.collectionId);
    if (list) {
      list.push(entry);
    } else {
      result.set(row.collectionId, [entry]);
    }
  }

  for (const list of result.values()) {
    list.sort((a, b) => b.count - a.count);
  }

  return result;
}

export async function getRecentCollections(
  userId: string,
  limit = 6,
): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      _count: { select: { items: true } },
    },
  });

  const breakdown = await getTypeBreakdownByCollection(
    userId,
    collections.map((c) => c.id),
  );

  return collections.map((c) => {
    const types = breakdown.get(c.id) ?? [];
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      isFavorite: c.isFavorite,
      itemCount: c._count.items,
      types,
      primaryTypeName: types[0]?.typeName ?? null,
    };
  });
}

export type SidebarCollection = {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  primaryTypeName: string | null;
};

export async function getSidebarCollections(
  userId: string,
): Promise<{ favorites: SidebarCollection[]; recents: SidebarCollection[] }> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      isFavorite: true,
      _count: { select: { items: true } },
    },
  });

  const breakdown = await getTypeBreakdownByCollection(
    userId,
    collections.map((c) => c.id),
  );

  const mapped: SidebarCollection[] = collections.map((c) => ({
    id: c.id,
    name: c.name,
    itemCount: c._count.items,
    isFavorite: c.isFavorite,
    primaryTypeName: breakdown.get(c.id)?.[0]?.typeName ?? null,
  }));

  return {
    favorites: mapped.filter((c) => c.isFavorite),
    recents: mapped.filter((c) => !c.isFavorite),
  };
}

export async function getCollectionStats(userId: string) {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
