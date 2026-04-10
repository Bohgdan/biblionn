"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Каталог" },
  { href: "/add", label: "Додати книгу" },
  { href: "/admin", label: "Адмін" },
];

type AuthUser = {
  name: string;
  email: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { user: AuthUser | null };
        setUser(data.user);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      className="sticky top-0 z-50 bg-[#1a1f3c] shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
    >
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            📚 Biblion
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium sm:text-base">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ padding: "0.5rem 0", transition: "color 0.15s" }}
                className={`border-b-2 ${
                  isActive
                    ? "border-[#c9a84c] text-[#c9a84c]"
                    : "border-transparent text-white hover:text-[#c9a84c]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* My books link — visible when logged in */}
        {user ? (
          <Link
            href="/my-books"
            style={{ padding: "0.5rem 0", transition: "color 0.15s" }}
            className={`border-b-2 text-sm font-medium sm:text-base ${
              pathname === "/my-books"
                ? "border-[#c9a84c] text-[#c9a84c]"
                : "border-transparent text-white hover:text-[#c9a84c]"
            }`}
          >
            Мої книги
          </Link>
        ) : null}

        {/* Auth section — pushed to the right */}
        <div className="ml-auto flex items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="rounded-[20px] border border-white/30 px-4 py-1.5 text-[0.9rem] text-white transition-colors hover:bg-white/10"
              >
                Увійти
              </Link>
              <Link
                href="/auth/register"
                className="rounded-[20px] bg-[#c9a84c] px-4 py-1.5 text-[0.9rem] font-semibold text-[#1a1f3c] transition-colors hover:bg-white"
              >
                Реєстрація
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#c9a84c",
                    color: "#1a1f3c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-[0.9rem] text-white">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[20px] border border-white/30 px-4 py-1.5 text-[0.85rem] text-white transition-colors hover:bg-white/10"
              >
                Вийти
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
