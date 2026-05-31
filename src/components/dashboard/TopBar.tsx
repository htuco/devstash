"use client";

import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./sidebar-context";

export function TopBar() {
  const { toggleCollapsed, toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        onClick={() => {
          if (window.innerWidth < 768) {
            toggleMobile();
          } else {
            toggleCollapsed();
          }
        }}
      >
        <Menu className="size-4" />
      </Button>
      <div className="flex items-center gap-2 pr-2">
        <span className="font-semibold tracking-tight">DevStash</span>
      </div>
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items, collections, tags…"
          className="pl-9"
        />
      </div>
      <div className="ml-auto">
        <Button size="sm">
          <Plus className="size-4" />
          New item
        </Button>
      </div>
    </header>
  );
}
