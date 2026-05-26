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
  link: "text-purple-400",
};

const borderColorMap: Record<string, string> = {
  snippet: "border-l-blue-400",
  prompt: "border-l-pink-400",
  command: "border-l-orange-400",
  note: "border-l-sky-400",
  file: "border-l-zinc-400",
  image: "border-l-emerald-400",
  url: "border-l-purple-400",
  link: "border-l-purple-400",
};

const iconNameByTypeName: Record<string, string> = {
  snippet: "code",
  prompt: "sparkles",
  command: "terminal",
  note: "file-text",
  file: "file",
  image: "image",
  link: "link",
  url: "link",
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

export function getTypeBorderColor(typeName: string | null | undefined) {
  if (!typeName) return "border-l-border";
  return borderColorMap[typeName] ?? "border-l-border";
}

export function getIconNameForType(typeName: string) {
  return iconNameByTypeName[typeName] ?? "file";
}

const bgColorMap: Record<string, string> = {
  snippet: "bg-blue-400",
  prompt: "bg-pink-400",
  command: "bg-orange-400",
  note: "bg-sky-400",
  file: "bg-zinc-400",
  image: "bg-emerald-400",
  url: "bg-purple-400",
  link: "bg-purple-400",
};

export function getTypeBgColor(typeName: string | null | undefined) {
  if (!typeName) return "bg-muted-foreground/40";
  return bgColorMap[typeName] ?? "bg-muted-foreground/40";
}
