"use client";

import { useRouter } from "next/navigation";
import { ChevronUp, LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function ProBadge() {
  return (
    <span className="rounded-sm bg-linear-to-br from-amber-300 to-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950">
      Pro
    </span>
  );
}

export function UserMenu({
  name,
  email,
  image,
  isPro,
  collapsed,
}: {
  name: string;
  email: string;
  image?: string | null;
  isPro: boolean;
  collapsed: boolean;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className={cn(
          "group flex w-full items-center gap-3 rounded-md p-1.5 text-left hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          collapsed && "md:justify-center",
        )}
      >
        <div className="relative shrink-0">
          <UserAvatar name={name} image={image} />
          {isPro && (
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-linear-to-br from-amber-300 to-amber-500 ring-2 ring-sidebar",
                !collapsed && "md:hidden",
              )}
            />
          )}
        </div>
        <div
          className={cn(
            "min-w-0 flex-1 leading-tight",
            collapsed && "md:hidden",
          )}
        >
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium">{name}</p>
            {isPro && <ProBadge />}
          </div>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <ChevronUp
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180",
            collapsed && "md:hidden",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <UserIcon className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => signOut({ callbackUrl: "/sign-in" })}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
