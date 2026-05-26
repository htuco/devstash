export type ItemType = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  itemTypeIds: string[];
  isFavorite: boolean;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  typeId: string;
  collectionId: string;
  tags: string[];
  language?: string;
  content?: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro: boolean;
};

export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  isPro: false,
};

export const itemTypes: ItemType[] = [
  { id: "snippet", name: "Snippets", icon: "code", count: 24 },
  { id: "prompt", name: "Prompts", icon: "sparkles", count: 18 },
  { id: "command", name: "Commands", icon: "terminal", count: 15 },
  { id: "note", name: "Notes", icon: "file-text", count: 12 },
  { id: "file", name: "Files", icon: "file", count: 5 },
  { id: "image", name: "Images", icon: "image", count: 3 },
  { id: "url", name: "Links", icon: "link", count: 8 },
];

export const collections: Collection[] = [
  {
    id: "react-patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    itemTypeIds: ["snippet", "note", "url"],
    isFavorite: true,
  },
  {
    id: "python-snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    itemTypeIds: ["snippet", "file"],
    isFavorite: false,
  },
  {
    id: "context-files",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    itemTypeIds: ["file", "note"],
    isFavorite: true,
  },
  {
    id: "interview-prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    itemTypeIds: ["note", "snippet", "url", "prompt"],
    isFavorite: false,
  },
  {
    id: "git-commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    itemTypeIds: ["command", "note"],
    isFavorite: true,
  },
  {
    id: "ai-prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    itemTypeIds: ["prompt", "snippet", "note"],
    isFavorite: false,
  },
];

export const items: Item[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "snippet",
    collectionId: "react-patterns",
    tags: ["react", "auth", "hooks"],
    language: "typescript",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "snippet",
    collectionId: "react-patterns",
    tags: ["api", "error-handling", "fetch"],
    language: "typescript",
    content: `export async function fetchWithRetry(url: string, options?: RequestInit) {
  // implementation
}`,
    isFavorite: false,
    isPinned: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "item_3",
    title: "Explain this code",
    description: "Prompt to explain code line by line",
    typeId: "prompt",
    collectionId: "ai-prompts",
    tags: ["explain", "learning"],
    content: "Explain the following code line by line, including any non-obvious behavior...",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "item_4",
    title: "Reset local branch to remote",
    description: "Discard all local changes and match remote",
    typeId: "command",
    collectionId: "git-commands",
    tags: ["git", "reset"],
    content: "git fetch origin && git reset --hard origin/main",
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
  },
  {
    id: "item_5",
    title: "Next.js App Router Notes",
    description: "Key concepts and gotchas for the App Router",
    typeId: "note",
    collectionId: "react-patterns",
    tags: ["nextjs", "app-router"],
    content: "## Server Components by default...",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: "item_6",
    title: "Tailwind v4 Docs",
    description: "Official Tailwind CSS v4 documentation",
    typeId: "url",
    collectionId: "react-patterns",
    tags: ["tailwind", "docs"],
    content: "https://tailwindcss.com/docs",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
];
