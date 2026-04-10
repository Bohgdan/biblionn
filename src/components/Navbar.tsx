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
    void loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        height: "64px",
      }}
      className="sticky top-0 z-50 bg-[#1a1f3c]/95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
    >
      <nav
        className="mx-auto flex h-full w-full max-w-7xl items-center px-6 lg:px-8"
        style={{ gap: "1.5rem" }}
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center shrink-0" style={{ textDecoration: "none" }}>
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#c9a84c",
              marginRight: "7px",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Biblion
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center" style={{ gap: "1.25rem" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-anim${isActive ? " active" : ""}`}
                style={{
                  fontSize: "0.9rem",
                  letterSpacing: "0.02em",
                  color: isActive ? "#c9a84c" : "rgba(255,255,255,0.75)",
                  fontWeight: isActive ? 600 : 400,
                  padding: "0.35rem 0",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* My books — only when logged in */}
          {user ? (
            <Link
              href="/my-books"
              className={`nav-link-anim${pathname === "/my-books" ? " active" : ""}`}
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
                color: pathname === "/my-books" ? "#c9a84c" : "rgba(255,255,255,0.75)",
                fontWeight: pathname === "/my-books" ? 600 : 400,
                padding: "0.35rem 0",
                textDecoration: "none",
              }}
            >
              Мої книги
            </Link>
          ) : null}
        </div>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />

        {/* Auth section */}
        <div className="flex items-center" style={{ gap: "8px" }}>
          {!user ? (
            <>
              <Link
                href="/auth/login"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "24px",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                className="transition-all hover:border-white hover:bg-white/[0.08]"
              >
                Увійти
              </Link>
              <Link
                href="/auth/register"
                style={{
                  background: "#c9a84c",
                  color: "#1a1f3c",
                  padding: "8px 20px",
                  borderRadius: "24px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                className="transition-all hover:bg-white"
              >
                Реєстрація
              </Link>
            </>
          ) : (
            <div className="flex items-center" style={{ gap: "10px" }}>
              <div className="flex items-center" style={{ gap: "8px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#c9a84c",
                    color: "#1a1f3c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
                  {user.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void handleLogout()}
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "24px",
                  fontSize: "0.85rem",
                  background: "transparent",
                }}
                className="transition-all hover:border-white hover:bg-white/[0.08]"
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
