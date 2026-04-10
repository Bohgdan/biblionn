import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
