import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const DEMO_EMAIL = "demo@devstash.io";

export const getDemoUser = cache(() =>
  prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true, name: true, email: true, isPro: true },
  }),
);
