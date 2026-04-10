"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const features = [
  "Тисячі книг від українців",
  "Безпечна угода",
  "Швидка доставка",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e8e2d9",
  borderRadius: "10px",
  padding: "12px 16px",
  background: "#fafaf9",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
};

function focusInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#c9a84c";
  e.currentTarget.style.background = "white";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.12)";
}
function blurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#e8e2d9";
  e.currentTarget.style.background = "#fafaf9";
  e.currentTarget.style.boxShadow = "none";
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Щось пішло не так");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Щось пішло не так");
    } finally {
      setIsLoading(false);
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#1a1f3c",
    fontWeight: 600,
  };

  return (
    <main style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left decorative panel */}
      <div
        className="hidden md:flex"
        style={{
          flex: "0 0 42%",
          background: "linear-gradient(135deg, #0f1428 0%, #1a1f3c 40%, #1e2d5c 70%, #1a1f3c 100%)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating book decorations */}
        <span style={{ position: "absolute", top: "8%", left: "10%", fontSize: "4rem", opacity: 0.08, transform: "rotate(-15deg)" }}>📚</span>
        <span style={{ position: "absolute", bottom: "12%", right: "8%", fontSize: "4rem", opacity: 0.08, transform: "rotate(12deg)" }}>📖</span>
        <span style={{ position: "absolute", top: "55%", left: "5%", fontSize: "3rem", opacity: 0.06, transform: "rotate(-8deg)" }}>📕</span>
        <span style={{ position: "absolute", top: "20%", right: "12%", fontSize: "3rem", opacity: 0.07, transform: "rotate(20deg)" }}>📗</span>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              color: "white",
              fontSize: "2.5rem",
              margin: "0 0 0.5rem",
              fontWeight: 700,
            }}
          >
            Biblion
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
            Книжковий маркет України
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", alignItems: "flex-start" }}>
            {features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.2)",
                    color: "#c9a84c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <section style={{ width: "100%", maxWidth: "400px" }}>
          <header style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#1a1f3c",
                fontSize: "2rem",
                margin: "0 0 0.25rem",
              }}
            >
              Реєстрація
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>Створіть свій акаунт</p>
          </header>

          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={onSubmit}>
            <div>
              <label style={labelStyle} htmlFor="name">Ім&apos;я</label>
              <input
                id="name"
                type="text"
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#9ca3af" }}>мінімум 6 символів</p>
            </div>

            <div>
              <label style={labelStyle} htmlFor="confirmPassword">Підтвердити пароль</label>
              <input
                id="confirmPassword"
                type="password"
                style={inputStyle}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #1a1f3c, #2d3561)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "0.95rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #c9a84c, #b8963e)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1f3c";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #1a1f3c, #2d3561)";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }
              }}
            >
              {isLoading ? "Завантаження..." : "Зареєструватися"}
            </button>

            {error ? (
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#dc2626", margin: 0 }}>
                {error}
              </p>
            ) : null}
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
            Вже є акаунт?{" "}
            <Link href="/auth/login" style={{ color: "#c9a84c", textDecoration: "none" }}
              className="hover:underline">
              Увійти
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
