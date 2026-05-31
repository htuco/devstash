import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { TopBar } from "@/components/dashboard/TopBar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getItemTypeCounts } from "@/lib/db/items";
import { getDemoUser } from "@/lib/server/demo-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, demoUser] = await Promise.all([auth(), getDemoUser()]);

  const [itemTypes, sidebarCollections] = demoUser
    ? await Promise.all([
        getItemTypeCounts(demoUser.id),
        getSidebarCollections(demoUser.id),
      ])
    : [[], { favorites: [], recents: [] }];

  const sessionUser = session?.user;
  const sidebarUser = sessionUser
    ? {
        name: sessionUser.name ?? sessionUser.email ?? "Account",
        email: sessionUser.email ?? "",
        image: sessionUser.image,
        isPro: demoUser?.isPro ?? false,
      }
    : null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar
            itemTypes={itemTypes}
            favoriteCollections={sidebarCollections.favorites}
            recentCollections={sidebarCollections.recents}
            user={sidebarUser}
          />
          <main className="flex-1 px-4 py-4 md:px-10 md:py-8 lg:px-16">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
