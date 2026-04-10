import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminLogin = process.env.ADMIN_LOGIN ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "biblion2024";

  const { login, password } = (await req.json()) as {
    login?: string;
    password?: string;
  };

  if (login === adminLogin && password === adminPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "admin_auth",
      value: "true",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: "Невірний логін або пароль" },
    { status: 401 }
  );
}
