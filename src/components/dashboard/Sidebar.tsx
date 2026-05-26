"use client";

import Link from "next/link";
import {
  ChevronDown,
  Code,
  FileText,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Star,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { collections, currentUser, itemTypes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  sparkles: Sparkles,
  terminal: Terminal,
  "file-text": FileText,
  file: File,
  image: ImageIcon,
  link: LinkIcon,
};

const iconColorMap: Record<string, string> = {
  snippet: "text-blue-400",
  prompt: "text-pink-400",
  command: "text-orange-400",
  note: "text-sky-400",
  file: "text-zinc-400",
  image: "text-emerald-400",
  url: "text-purple-400",
};

export function Sidebar() {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={closeMobile}
        className={cn(
          "fixed inset-0 z-30 bg-black/50 md:hidden",
          isMobileOpen ? "block" : "hidden",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 top-14 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200",
          "md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64",
          "w-64",
        )}
      >
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {/* Types Section */}
          <SectionLabel label="Types" collapsed={isCollapsed} />
          <ul className="mt-1 space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? File;
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${type.id}`}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "md:justify-center",
                    )}
                    title={isCollapsed ? type.name : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        iconColorMap[type.id] ?? "text-muted-foreground",
                      )}
                    />
                    <span className={cn("flex-1 truncate", isCollapsed && "md:hidden")}>
                      {type.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs text-muted-foreground",
                        isCollapsed && "md:hidden",
                      )}
                    >
                      {type.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Collections Section */}
          <div className="mt-6">
            <SectionLabel label="Collections" collapsed={isCollapsed} />

            {favoriteCollections.length > 0 && (
              <>
                <SubLabel label="Favorites" collapsed={isCollapsed} />
                <ul className="mt-1 space-y-0.5">
                  {favoriteCollections.map((c) => (
                    <CollectionLink
                      key={c.id}
                      name={c.name}
                      itemCount={c.itemCount}
                      favorite
                      collapsed={isCollapsed}
                      onClick={closeMobile}
                    />
                  ))}
                </ul>
              </>
            )}

            {recentCollections.length > 0 && (
              <>
                <SubLabel label="All Collections" collapsed={isCollapsed} />
                <ul className="mt-1 space-y-0.5">
                  {recentCollections.map((c) => (
                    <CollectionLink
                      key={c.id}
                      name={c.name}
                      itemCount={c.itemCount}
                      collapsed={isCollapsed}
                      onClick={closeMobile}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        </nav>

        {/* User avatar */}
        <div
          className={cn(
            "flex items-center gap-3 border-t border-sidebar-border p-3",
            isCollapsed && "md:justify-center",
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className={cn("min-w-0 flex-1", isCollapsed && "md:hidden")}>
            <p className="truncate text-sm font-medium">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-2.5 text-xs font-medium text-muted-foreground",
        collapsed && "md:hidden",
      )}
    >
      <span>{label}</span>
      <ChevronDown className="size-3.5" />
    </div>
  );
}

function SubLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  return (
    <p
      className={cn(
        "mt-3 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70",
        collapsed && "md:hidden",
      )}
    >
      {label}
    </p>
  );
}

function CollectionLink({
  name,
  itemCount,
  favorite = false,
  collapsed,
  onClick,
}: {
  name: string;
  itemCount: number;
  favorite?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <li>
      <Link
        href={`/collections/${slug}`}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "md:justify-center",
        )}
        title={collapsed ? name : undefined}
      >
        <span className={cn("flex-1 truncate", collapsed && "md:hidden")}>{name}</span>
        {favorite && (
          <Star
            className={cn(
              "size-3.5 shrink-0 fill-yellow-500 text-yellow-500",
              collapsed && "md:hidden",
            )}
          />
        )}
        <span
          className={cn("text-xs text-muted-foreground", collapsed && "md:hidden")}
        >
          {itemCount}
        </span>
      </Link>
    </li>
  );
}
