"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type Book = {
  id: string;
  title: string;
  authors: string;
  price: number;
  condition: string;
  imageUrl?: string | null;
  contactEmail?: string | null;
  createdAt?: string;
};

export default function MyBooksPage() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { user: AuthUser | null };
        setUser(data.user);

        if (data.user) {
          await fetchBooks(data.user.email);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, []);

  async function fetchBooks(email: string) {
    try {
      const res = await fetch("/api/books", { cache: "no-store" });
      if (res.ok) {
        const all = (await res.json()) as Book[];
        setBooks(all.filter((b) => b.contactEmail === email));
      }
    } catch {
      setBooks([]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити цю книгу?")) return;
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (user) await fetchBooks(user.email);
    } catch {
      alert("Помилка видалення");
    }
  }

  if (loading || user === undefined) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f5f0e8]">
        <p className="text-[#6b7280]">Завантаження...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f5f0e8] px-4 text-center">
        <p className="text-xl text-[#1a1f3c]" style={{ fontFamily: '"Playfair Display", serif' }}>
          Увійдіть щоб побачити свої книги
        </p>
        <Link
          href="/auth/login"
          className="rounded-lg bg-[#1a1f3c] px-6 py-3 text-white transition-colors hover:bg-[#c9a84c] hover:text-[#1a1f3c]"
        >
          Увійти
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-10">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8">
          <h1
            className="text-[2rem] text-[#1a1f3c]"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Мої книги
          </h1>
          <div className="mt-2 h-[3px] w-[60px] bg-[#c9a84c]" />
          <p className="mt-2 text-[0.9rem] text-[#6b7280]">
            {books.length === 0 ? "У вас поки немає оголошень" : `${books.length} оголошень`}
          </p>
        </header>

        {books.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="text-5xl">📚</div>
            <p className="text-lg text-[#1a1f3c]">У вас поки немає доданих книг</p>
            <Link
              href="/add"
              className="rounded-lg bg-[#c9a84c] px-6 py-3 font-semibold text-[#1a1f3c] transition-colors hover:bg-[#1a1f3c] hover:text-white"
            >
              Додати книгу
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {books.map((book) => (
              <div key={book.id} className="flex flex-col gap-2">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.authors}
                  price={book.price}
                  condition={book.condition}
                  imageUrl={book.imageUrl}
                />
                <button
                  type="button"
                  onClick={() => void handleDelete(book.id)}
                  className="w-full rounded-lg border border-red-500 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                >
                  🗑 Видалити
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
