"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BookCard from "@/components/BookCard";

type Book = {
  id: string;
  title: string;
  author?: string;
  authors?: string;
  price: number;
  condition: string;
  imageUrl?: string | null;
  createdAt?: string;
};

const CONDITIONS = ["Всі стани", "Нова", "Як нова", "Добрий", "Задовільний"];

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("Всі стани");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Book[];
          setBooks(data);
        }
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    void fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((b) => {
        const name = b.title.toLowerCase();
        const auth = (b.author ?? b.authors ?? "").toLowerCase();
        return name.includes(q) || auth.includes(q);
      });
    }

    if (conditionFilter !== "Всі стани") {
      result = result.filter((b) => b.condition === conditionFilter);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    } else if (sort === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "expensive") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [books, search, conditionFilter, sort]);

  const selectStyle: React.CSSProperties = {
    border: "1px solid #d1c9b8",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "0.95rem",
    background: "white",
    color: "#1a1f3c",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="flex min-h-[80vh] items-center justify-center px-8 py-16 text-center"
        style={{
          background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 50%, #1a1f3c 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-8 py-16">
          <div className="mb-3 text-[0.7rem] tracking-[8px] text-[#c9a84c]">● ● ●</div>
          <h1
            className="mb-4 font-bold leading-tight text-white"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Знайди свою наступну книгу
          </h1>
          <p className="mb-10 text-[1.2rem] text-[rgba(255,255,255,0.7)]">
            Купуй та продавай книги серед своїх
          </p>
          <a
            href="#books"
            className="inline-block cursor-pointer rounded-[50px] border-0 bg-[#c9a84c] px-10 py-4 text-base font-bold tracking-[0.05em] text-[#1a1f3c] transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-[#1a1f3c]"
          >
            Переглянути каталог
          </a>
        </div>
      </section>

      {/* Books section */}
      <section id="books" style={{ background: "#f5f0e8", padding: "5rem 2rem 4rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Search / Filter bar */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(26,31,60,0.08)",
              padding: "1rem 1.5rem",
              marginBottom: "2.5rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search input with icon */}
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Пошук за назвою або автором..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #d1c9b8",
                  borderRadius: "8px",
                  padding: "10px 14px 10px 2.5rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#c9a84c";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(201,168,76,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d1c9b8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Condition filter */}
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              style={{ ...selectStyle, width: "160px" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c9a84c";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(201,168,76,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1c9b8";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ ...selectStyle, width: "210px" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c9a84c";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(201,168,76,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1c9b8";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <option value="newest">Новіші спочатку</option>
              <option value="cheapest">Дешевші спочатку</option>
              <option value="expensive">Дорожчі спочатку</option>
            </select>
          </div>

          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#1a1f3c",
                  fontSize: "2rem",
                  margin: 0,
                }}
              >
                Усі книги
              </h2>
              <div style={{ width: "60px", height: "3px", background: "#c9a84c", marginTop: "8px" }} />
              <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "4px" }}>
                {loading ? "Завантаження..." : `${filteredBooks.length} книг знайдено`}
              </p>
            </div>
            <Link
              href="/add"
              style={{
                background: "#c9a84c",
                color: "#1a1f3c",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              className="hover:bg-[#1a1f3c] hover:text-white"
            >
              Додати книгу +
            </Link>
          </div>

          {/* Grid or empty states */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #ede8df",
                  }}
                >
                  <div
                    style={{
                      height: "220px",
                      background: "linear-gradient(90deg, #e8e3d8 25%, #f0ebe0 50%, #e8e3d8 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                  <div style={{ padding: "1rem" }}>
                    <div style={{ height: "16px", background: "#e8e3d8", borderRadius: "4px", marginBottom: "8px" }} />
                    <div style={{ height: "12px", background: "#e8e3d8", borderRadius: "4px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <p className="py-10 text-center text-lg text-[#1a1f3c]">
              {books.length === 0
                ? "Поки що немає книг. Додайте першу!"
                : "Нічого не знайдено. Спробуйте інший пошук."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author ?? book.authors ?? "Невідомий автор"}
                  price={book.price}
                  condition={book.condition}
                  imageUrl={book.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
