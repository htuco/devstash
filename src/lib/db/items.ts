import { prisma } from "@/lib/prisma";

export type DashboardItem = {
  id: string;
  title: string;
  description: string | null;
  typeName: string;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  tags: string[];
};

const itemSelect = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  type: { select: { name: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ItemRow = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: { name: string };
  tags: { tag: { name: string } }[];
};

function toDashboardItem(row: ItemRow): DashboardItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    typeName: row.type.name,
    isFavorite: row.isFavorite,
    isPinned: row.isPinned,
    updatedAt: row.updatedAt,
    tags: row.tags.map((t) => t.tag.name),
  };
}

export async function getPinnedItems(userId: string): Promise<DashboardItem[]> {
  const rows = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: itemSelect,
  });
  return rows.map(toDashboardItem);
}

export async function getRecentItems(
  userId: string,
  limit = 10,
): Promise<DashboardItem[]> {
  const rows = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: itemSelect,
  });
  return rows.map(toDashboardItem);
}

export async function getItemStats(userId: string) {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}

export type SidebarItemType = {
  id: string;
  name: string;
  icon: string | null;
  count: number;
  isSystem: boolean;
};

const SYSTEM_TYPE_ORDER = [
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
];

export async function getItemTypeCounts(
  userId: string,
): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: {
      OR: [{ isSystem: true }, { userId }],
    },
    select: {
      id: true,
      name: true,
      icon: true,
      isSystem: true,
      _count: { select: { items: { where: { userId } } } },
    },
  });

  return types
    .map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      count: t._count.items,
      isSystem: t.isSystem,
    }))
    .sort((a, b) => {
      const ai = SYSTEM_TYPE_ORDER.indexOf(a.name);
      const bi = SYSTEM_TYPE_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}
