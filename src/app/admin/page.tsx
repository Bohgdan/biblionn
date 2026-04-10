"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type Book = {
  id: string;
  title: string;
  author?: string;
  authors?: string;
  price: number;
  condition: string;
  contactEmail?: string | null;
  createdAt: string;
};

function getConditionStyles(condition: string) {
  if (condition === "Нова") return { backgroundColor: "#dcfce7", color: "#166534" };
  if (condition === "Як нова") return { backgroundColor: "#dbeafe", color: "#1e40af" };
  if (condition === "Добрий") return { backgroundColor: "#fef9c3", color: "#854d0e" };
  if (condition === "Задовільний") return { backgroundColor: "#fee2e2", color: "#991b1b" };
  return { backgroundColor: "#f3f4f6", color: "#374151" };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

function isTodayBook(iso: string) {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return new Date(iso).getTime() >= midnight;
}

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadBooks() {
    try {
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Book[];
      setBooks(data);
    } catch {
      /* no-op */
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === books.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(books.map((b) => b.id)));
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("Видалити цю книгу?")) return;
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    await loadBooks();
  }

  async function deleteBulk() {
    if (!window.confirm(`Видалити ${selected.size} книг?`)) return;
    setIsDeleting(true);
    await Promise.all([...selected].map((id) => fetch(`/api/books/${id}`, { method: "DELETE" })));
    setSelected(new Set());
    setIsDeleting(false);
    await loadBooks();
  }

  const total = books.length;
  const todayCount = books.filter((b) => isTodayBook(b.createdAt)).length;
  const totalPrice = books.reduce((s, b) => s + b.price, 0);

  const statCard = "rounded-xl bg-white px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.07)]";

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-8">
      <div className="mx-auto w-full max-w-[1100px]">

        {/* HEADER */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[2rem] text-[#1a1f3c]" style={{ fontFamily: "var(--font-playfair)" }}>
              Адмін панель
            </h1>
            <p className="text-[0.9rem] text-gray-500">Управління книгами</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-[20px] bg-[#c9a84c] px-3 py-1 font-semibold text-[#1a1f3c]">
              Всього книг: {total}
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={statCard}>
            <p className="text-xs uppercase tracking-wide text-gray-500">Всього книг</p>
            <p className="mt-1 text-[2rem] font-bold text-[#1a1f3c]">{total}</p>
          </div>
          <div className={statCard}>
            <p className="text-xs uppercase tracking-wide text-gray-500">Нових сьогодні</p>
            <p className="mt-1 text-[2rem] font-bold text-[#1a1f3c]">{todayCount}</p>
          </div>
          <div className={statCard}>
            <p className="text-xs uppercase tracking-wide text-gray-500">Загальна вартість</p>
            <p className="mt-1 text-[2rem] font-bold text-[#1a1f3c]">{totalPrice.toLocaleString("uk-UA")} грн</p>
          </div>
        </div>

        {/* TABLE */}
        <section className="overflow-hidden rounded-xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
          {books.length === 0 ? (
            <p className="px-4 py-10 text-center text-gray-500">Немає книг</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#1a1f3c] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selected.size === books.length && books.length > 0}
                        onChange={toggleAll}
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">#</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Назва</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Автор</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Ціна</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Стан</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Email</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Дата</th>
                    <th className="px-3 py-3 text-left text-[0.75rem] uppercase tracking-[0.05em]">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => {
                    const author = book.author ?? book.authors ?? "—";
                    const badge = getConditionStyles(book.condition);
                    const isChecked = selected.has(book.id);
                    return (
                      <tr
                        key={book.id}
                        className={`${isChecked ? "bg-amber-50" : index % 2 === 0 ? "bg-white" : "bg-[#faf8f4]"}`}
                        style={{ borderBottom: "1px solid #f0ebe0" }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(book.id)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-gray-400">{index + 1}</td>
                        <td className="px-3 py-3 font-medium text-[#1a1f3c]">{book.title}</td>
                        <td className="px-3 py-3 text-gray-600">{author}</td>
                        <td className="px-3 py-3 font-semibold text-[#c9a84c]">{book.price} грн</td>
                        <td className="px-3 py-3">
                          <span
                            className="inline-block rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold"
                            style={badge}
                          >
                            {book.condition}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-600">{book.contactEmail ?? "—"}</td>
                        <td className="px-3 py-3 text-gray-500">{formatDate(book.createdAt)}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/books/${book.id}`}
                              className="rounded-md border border-[#1a1f3c] px-2.5 py-1 text-[0.8rem] text-[#1a1f3c] transition-colors hover:bg-[#1a1f3c] hover:text-white"
                            >
                              👁 Переглянути
                            </Link>
                            <button
                              type="button"
                              onClick={() => deleteBook(book.id)}
                              className="rounded-md border border-red-600 px-2.5 py-1 text-[0.8rem] text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                            >
                              🗑 Видалити
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* BULK DELETE BAR */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-8 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
          <span className="font-medium text-[#1a1f3c]">Вибрано: {selected.size} книг</span>
          <button
            type="button"
            disabled={isDeleting}
            onClick={deleteBulk}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Видаляємо..." : "Видалити вибрані"}
          </button>
        </div>
      )}
    </main>
  );
}
