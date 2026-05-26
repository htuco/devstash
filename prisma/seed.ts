import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@devstash.io";

const SYSTEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

type TypeName = (typeof SYSTEM_TYPES)[number]["name"];

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: "Demo User",
      password: passwordHash,
      emailVerified: new Date(),
      isPro: false,
    },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      password: passwordHash,
      emailVerified: new Date(),
      isPro: false,
    },
  });
  console.log(`  user: ${user.email}`);

  // System types have userId=null; @@unique([userId, name]) doesn't enforce
  // uniqueness across NULLs in Postgres, so look up by (userId: null, name)
  // and create only when missing.
  const typeIds = {} as Record<TypeName, string>;
  for (const t of SYSTEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, name: t.name, isSystem: true },
    });
    const type = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: t.icon, color: t.color, isSystem: true },
        })
      : await prisma.itemType.create({
          data: { name: t.name, icon: t.icon, color: t.color, isSystem: true },
        });
    typeIds[t.name] = type.id;
  }
  console.log(`  item types: ${SYSTEM_TYPES.length}`);

  // Clear existing demo collections + items so reruns are deterministic
  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });

  const collections = await seedCollections(user.id, typeIds);
  console.log(`  collections: ${collections.length}`);

  const total = await prisma.item.count({ where: { userId: user.id } });
  console.log(`  items: ${total}`);
  console.log("Done.");
}

async function seedCollections(
  userId: string,
  typeIds: Record<TypeName, string>,
) {
  const created: { name: string; itemCount: number }[] = [];

  // ----- React Patterns -----
  const reactPatterns = await prisma.collection.create({
    data: {
      userId,
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
    },
  });
  await prisma.item.createMany({
    data: [
      {
        userId,
        typeId: typeIds.snippet,
        collectionId: reactPatterns.id,
        title: "useDebounce hook",
        contentType: "text",
        language: "typescript",
        description: "Debounce a rapidly-changing value",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`,
      },
      {
        userId,
        typeId: typeIds.snippet,
        collectionId: reactPatterns.id,
        title: "Theme context provider",
        contentType: "text",
        language: "typescript",
        description: "Compound provider + hook pattern for theme state",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
      },
      {
        userId,
        typeId: typeIds.snippet,
        collectionId: reactPatterns.id,
        title: "cn() classname utility",
        contentType: "text",
        language: "typescript",
        description: "Merge Tailwind classes with conflict resolution",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  });
  created.push({ name: reactPatterns.name, itemCount: 3 });

  // ----- AI Workflows -----
  const aiWorkflows = await prisma.collection.create({
    data: {
      userId,
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
    },
  });
  await prisma.item.createMany({
    data: [
      {
        userId,
        typeId: typeIds.prompt,
        collectionId: aiWorkflows.id,
        title: "Code review prompt",
        contentType: "text",
        description: "Thorough review focused on correctness and clarity",
        content: `You are a senior engineer reviewing a pull request. For the diff below:

1. Identify correctness bugs and edge cases first.
2. Flag security concerns (input validation, auth, secrets).
3. Note clarity issues (naming, dead code, missing types).
4. Suggest concrete fixes — show code, not just descriptions.

Ignore stylistic preferences already handled by formatters.

Diff:
{{DIFF}}`,
      },
      {
        userId,
        typeId: typeIds.prompt,
        collectionId: aiWorkflows.id,
        title: "Documentation generator",
        contentType: "text",
        description: "Generate TSDoc/JSDoc for a function or module",
        content: `Generate concise documentation for the following code.

- Write a one-line summary first.
- Document parameters, return type, and thrown errors.
- Add an @example block only if the usage is non-obvious.
- Do not restate what the types already say.

Code:
{{CODE}}`,
      },
      {
        userId,
        typeId: typeIds.prompt,
        collectionId: aiWorkflows.id,
        title: "Refactor assistant",
        contentType: "text",
        description: "Refactor without changing behavior",
        content: `Refactor the code below. Constraints:

- Preserve external behavior exactly. No API changes.
- Reduce nesting, extract helpers when it improves clarity.
- Prefer pure functions where possible.
- Show the diff and explain each non-trivial change in one line.

Code:
{{CODE}}`,
      },
    ],
  });
  created.push({ name: aiWorkflows.name, itemCount: 3 });

  // ----- DevOps -----
  const devops = await prisma.collection.create({
    data: {
      userId,
      name: "DevOps",
      description: "Infrastructure and deployment resources",
    },
  });
  await prisma.item.createMany({
    data: [
      {
        userId,
        typeId: typeIds.snippet,
        collectionId: devops.id,
        title: "Multi-stage Node Dockerfile",
        contentType: "text",
        language: "dockerfile",
        description: "Small production image with separate build and runtime stages",
        content: `# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]`,
      },
      {
        userId,
        typeId: typeIds.command,
        collectionId: devops.id,
        title: "Deploy to Vercel production",
        contentType: "text",
        language: "bash",
        description: "Build locally and promote to production",
        content: `vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod`,
      },
      {
        userId,
        typeId: typeIds.link,
        collectionId: devops.id,
        title: "Vercel deployment docs",
        contentType: "text",
        url: "https://vercel.com/docs/deployments",
        description: "Official Vercel deployment guide",
      },
      {
        userId,
        typeId: typeIds.link,
        collectionId: devops.id,
        title: "GitHub Actions docs",
        contentType: "text",
        url: "https://docs.github.com/en/actions",
        description: "GitHub Actions CI/CD documentation",
      },
    ],
  });
  created.push({ name: devops.name, itemCount: 4 });

  // ----- Terminal Commands -----
  const terminal = await prisma.collection.create({
    data: {
      userId,
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
    },
  });
  await prisma.item.createMany({
    data: [
      {
        userId,
        typeId: typeIds.command,
        collectionId: terminal.id,
        title: "Undo last commit (keep changes staged)",
        contentType: "text",
        language: "bash",
        description: "Move HEAD back one commit but preserve the changes",
        content: `git reset --soft HEAD~1`,
      },
      {
        userId,
        typeId: typeIds.command,
        collectionId: terminal.id,
        title: "Remove all stopped Docker containers",
        contentType: "text",
        language: "bash",
        description: "Free up disk by pruning stopped containers and dangling images",
        content: `docker container prune -f && docker image prune -f`,
      },
      {
        userId,
        typeId: typeIds.command,
        collectionId: terminal.id,
        title: "Kill process on port 3000",
        contentType: "text",
        language: "bash",
        description: "Find and terminate whatever is hogging the dev server port",
        content: `lsof -ti:3000 | xargs kill -9`,
      },
      {
        userId,
        typeId: typeIds.command,
        collectionId: terminal.id,
        title: "List outdated npm packages",
        contentType: "text",
        language: "bash",
        description: "See which dependencies have newer versions available",
        content: `npm outdated`,
      },
    ],
  });
  created.push({ name: terminal.name, itemCount: 4 });

  // ----- Design Resources -----
  const design = await prisma.collection.create({
    data: {
      userId,
      name: "Design Resources",
      description: "UI/UX resources and references",
    },
  });
  await prisma.item.createMany({
    data: [
      {
        userId,
        typeId: typeIds.link,
        collectionId: design.id,
        title: "Tailwind CSS docs",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS reference",
      },
      {
        userId,
        typeId: typeIds.link,
        collectionId: design.id,
        title: "shadcn/ui",
        contentType: "text",
        url: "https://ui.shadcn.com",
        description: "Copy-paste component library built on Radix and Tailwind",
      },
      {
        userId,
        typeId: typeIds.link,
        collectionId: design.id,
        title: "Radix UI Primitives",
        contentType: "text",
        url: "https://www.radix-ui.com/primitives",
        description: "Accessible, unstyled component primitives",
      },
      {
        userId,
        typeId: typeIds.link,
        collectionId: design.id,
        title: "Lucide icons",
        contentType: "text",
        url: "https://lucide.dev/icons",
        description: "Open-source icon set used across the app",
      },
    ],
  });
  created.push({ name: design.name, itemCount: 4 });

  return created;
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
