"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [login, setLogin] = useState("");
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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        setError("Невірний логін або пароль");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Невірний логін або пароль");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-[#f5f0e8] px-4 py-8">
      <section className="mx-auto mt-32 max-w-[400px] rounded-2xl bg-white p-10 shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
        <header className="mb-8 text-center">
          <div className="text-3xl">🔐</div>
          <h1
            className="mt-2 text-[1.75rem] text-[#1a1f3c]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Адмін панель
          </h1>
          <p className="mt-2 text-gray-500">Введіть дані для входу</p>
        </header>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1a1f3c]" htmlFor="login">
              Логін
            </label>
            <input
              id="login"
              type="text"
              className={inputClass}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
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
      </section>
    </main>
  );
}
