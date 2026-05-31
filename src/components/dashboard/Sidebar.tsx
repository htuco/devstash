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
import type { SidebarCollection } from "@/lib/db/collections";
import type { SidebarItemType } from "@/lib/db/items";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { getIconNameForType, getTypeBgColor } from "./TypeIcon";

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
  link: "text-purple-400",
};

const PRO_SYSTEM_TYPES = new Set(["file", "image"]);

function isProType(type: SidebarItemType): boolean {
  return !type.isSystem || PRO_SYSTEM_TYPES.has(type.name);
}

export function Sidebar({
  itemTypes,
  favoriteCollections,
  recentCollections,
  user,
}: {
  itemTypes: SidebarItemType[];
  favoriteCollections: SidebarCollection[];
  recentCollections: SidebarCollection[];
  user: { name: string; email: string; isPro: boolean } | null;
}) {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

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
              const iconName = getIconNameForType(type.name);
              const Icon = iconMap[iconName] ?? File;
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${type.name}`}
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
                        iconColorMap[type.name] ?? "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "flex-1 truncate capitalize",
                        isCollapsed && "md:hidden",
                      )}
                    >
                      {type.name}
                    </span>
                    {isProType(type) && (
                      <ProBadge
                        size="xs"
                        className={cn(isCollapsed && "md:hidden")}
                      />
                    )}
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
                      collection={c}
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
                      collection={c}
                      collapsed={isCollapsed}
                      onClick={closeMobile}
                    />
                  ))}
                </ul>
              </>
            )}

            <Link
              href="/collections"
              onClick={closeMobile}
              className={cn(
                "mt-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "md:hidden",
              )}
            >
              View all collections
            </Link>
          </div>
        </nav>

        {/* User avatar */}
        {user && (
          <div
            className={cn(
              "flex items-center gap-3 border-t border-sidebar-border p-3",
              isCollapsed && "md:justify-center",
            )}
          >
            <div className="relative shrink-0">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              {user.isPro && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-linear-to-br from-amber-300 to-amber-500 ring-2 ring-sidebar",
                    !isCollapsed && "md:hidden",
                  )}
                />
              )}
            </div>
            <div className={cn("min-w-0 flex-1", isCollapsed && "md:hidden")}>
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium">{user.name}</p>
                {user.isPro && <ProBadge />}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            {!user.isPro && (
              <Link
                href="/upgrade"
                onClick={closeMobile}
                className={cn(
                  "rounded-md border border-amber-500/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 hover:bg-amber-500/10",
                  isCollapsed && "md:hidden",
                )}
              >
                Upgrade
              </Link>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function ProBadge({
  size = "sm",
  className,
}: {
  size?: "xs" | "sm";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-sm bg-linear-to-br from-amber-300 to-amber-500 font-bold uppercase tracking-wider text-amber-950",
        size === "xs" ? "px-1 py-px text-[8px]" : "px-1.5 py-0.5 text-[9px]",
        className,
      )}
    >
      Pro
    </span>
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
  collection,
  collapsed,
  onClick,
}: {
  collection: SidebarCollection;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const slug = collection.name.toLowerCase().replace(/\s+/g, "-");
  const dotColor = getTypeBgColor(collection.primaryTypeName);

  return (
    <li>
      <Link
        href={`/collections/${slug}`}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "md:justify-center",
        )}
        title={collapsed ? collection.name : undefined}
      >
        {collection.isFavorite ? (
          <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
        ) : (
          <span
            className={cn("size-2.5 shrink-0 rounded-full", dotColor)}
            aria-hidden
          />
        )}
        <span className={cn("flex-1 truncate", collapsed && "md:hidden")}>
          {collection.name}
        </span>
        <span
          className={cn("text-xs text-muted-foreground", collapsed && "md:hidden")}
        >
          {collection.itemCount}
        </span>
      </Link>
    </li>
  );
}
