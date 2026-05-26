import {
  Code,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function TypeIcon({
  typeId,
  iconName,
  className,
}: {
  typeId: string;
  iconName: string;
  className?: string;
}) {
  const Icon = iconMap[iconName] ?? File;
  return (
    <Icon
      className={cn(
        "size-4 shrink-0",
        iconColorMap[typeId] ?? "text-muted-foreground",
        className,
      )}
    />
  );
}

export function getTypeColor(typeId: string) {
  return iconColorMap[typeId] ?? "text-muted-foreground";
}
