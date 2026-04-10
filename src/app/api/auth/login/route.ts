export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== hashPassword(password)) {
    return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
  });

  response.cookies.set({
    name: "user_id",
    value: user.id,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}
