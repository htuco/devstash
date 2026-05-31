import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const initials = parts.map((p) => p[0]).join("");
  return initials.slice(0, 2).toUpperCase();
}

export function UserAvatar({
  name,
  image,
  className,
}: {
  name: string | null | undefined;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-8", className)}>
      {image && <AvatarImage src={image} alt={name ?? "User avatar"} />}
      <AvatarFallback className="text-sm font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
