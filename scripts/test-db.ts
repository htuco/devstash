import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting to database...\n");

  const [users, itemTypes, collections, items, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);

  console.log("Row counts");
  console.log("----------");
  console.log(`  users:        ${users}`);
  console.log(`  item types:   ${itemTypes}`);
  console.log(`  collections:  ${collections}`);
  console.log(`  items:        ${items}`);
  console.log(`  tags:         ${tags}`);

  console.log("\nSystem item types");
  console.log("-----------------");
  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  for (const t of systemTypes) {
    console.log(`  ${t.name.padEnd(10)} ${t.icon?.padEnd(12) ?? ""} ${t.color ?? ""}`);
  }

  console.log("\nUsers");
  console.log("-----");
  const allUsers = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      isPro: true,
      emailVerified: true,
      _count: { select: { items: true, collections: true } },
    },
  });
  for (const u of allUsers) {
    const verified = u.emailVerified ? "verified" : "unverified";
    console.log(
      `  ${u.email} (${u.name ?? "—"}) [${verified}] pro=${u.isPro} items=${u._count.items} collections=${u._count.collections}`,
    );
  }

  console.log("\nCollections");
  console.log("-----------");
  const cols = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { items: true } },
      user: { select: { email: true } },
    },
  });
  for (const c of cols) {
    console.log(`  ${c.name.padEnd(22)} items=${c._count.items}  (${c.user.email})`);
  }
}

main()
  .catch((err) => {
    console.error("Database test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
