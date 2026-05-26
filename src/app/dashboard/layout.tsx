import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { TopBar } from "@/components/dashboard/TopBar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getItemTypeCounts } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@devstash.io";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true, name: true, email: true },
  });

  const [itemTypes, sidebarCollections] = demoUser
    ? await Promise.all([
        getItemTypeCounts(demoUser.id),
        getSidebarCollections(demoUser.id),
      ])
    : [[], { favorites: [], recents: [] }];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar
            itemTypes={itemTypes}
            favoriteCollections={sidebarCollections.favorites}
            recentCollections={sidebarCollections.recents}
            user={
              demoUser
                ? { name: demoUser.name ?? "Demo User", email: demoUser.email }
                : null
            }
          />
          <main className="flex-1 px-4 py-4 md:px-10 md:py-8 lg:px-16">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
