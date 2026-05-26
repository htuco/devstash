import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
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
