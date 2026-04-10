"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-[8px] border border-[#d1c9b8] px-[14px] py-[10px] text-base focus:border-[#c9a84c] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Невірний email або пароль");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left decorative panel */}
      <div
        className="hidden md:flex"
        style={{
          flex: "0 0 40%",
          background: "linear-gradient(135deg, #1a1f3c, #2d3561)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            color: "white",
            fontSize: "2.5rem",
            margin: "0 0 0.5rem",
          }}
        >
          Biblion
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", marginBottom: "2.5rem" }}>
          Книжковий маркет України
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {["✓ Тисячі книг від українців", "✓ Безпечна угода", "✓ Швидка доставка"].map((f) => (
            <p key={f} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
              {f}
            </p>
          ))}
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
            <h1 style={{ fontFamily: "var(--font-playfair)", color: "#1a1f3c", fontSize: "2rem", margin: 0 }}>
              Вхід
            </h1>
            <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>Раді бачити вас знову</p>
          </header>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1f3c]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1f3c]" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-[8px] bg-[#1a1f3c] px-4 py-[14px] text-base uppercase tracking-[0.05em] text-white transition-all duration-200 hover:bg-[#c9a84c] hover:text-[#1a1f3c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Завантаження..." : "Увійти"}
            </button>

            {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Немає акаунту?{" "}
            <Link href="/auth/register" className="text-[#c9a84c] hover:underline">
              Зареєструватися
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
