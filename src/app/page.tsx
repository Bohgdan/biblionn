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

const inputStyle: React.CSSProperties = {
  border: "1px solid #e8e2d9",
  borderRadius: "10px",
  padding: "12px 16px",
  background: "#fafaf9",
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  color: "#1a1f3c",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
};

function FocusInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#c9a84c";
  e.currentTarget.style.background = "white";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.12)";
}

function BlurInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#e8e2d9";
  e.currentTarget.style.background = "#fafaf9";
  e.currentTarget.style.boxShadow = "none";
}

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
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } else if (sort === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "expensive") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [books, search, conditionFilter, sort]);

  return (
    <main>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 50%, #1a1f3c 100%)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem 5rem",
        }}
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "8px", color: "#c9a84c", marginBottom: "1rem" }}>
            ● ● ●
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Знайди свою наступну книгу
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", marginBottom: "2.5rem" }}>
            Купуй та продавай книги серед своїх
          </p>
          <a
            href="#books"
            style={{
              display: "inline-block",
              background: "#c9a84c",
              color: "#1a1f3c",
              padding: "16px 40px",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.05em",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "white";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#c9a84c";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            Переглянути каталог
          </a>
        </div>
      </section>

      {/* Books section */}
      <section id="books" style={{ background: "#f5f0e8", padding: "0 2rem 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Floating search / filter card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(26,31,60,0.08)",
              padding: "1.25rem 1.5rem",
              margin: "-3rem auto 3rem",
              maxWidth: "960px",
              position: "relative",
              zIndex: 10,
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search input */}
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Пошук за назвою або автором..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "2.75rem" }}
                onFocus={FocusInput}
                onBlur={BlurInput}
              />
            </div>

            {/* Condition filter */}
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              style={{ ...inputStyle, width: "160px", cursor: "pointer" }}
              onFocus={FocusInput}
              onBlur={BlurInput}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ ...inputStyle, width: "210px", cursor: "pointer" }}
              onFocus={FocusInput}
              onBlur={BlurInput}
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
                  fontSize: "1.75rem",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Усі книги
              </h2>
              <div style={{ width: "40px", height: "3px", background: "#c9a84c", marginTop: "8px" }} />
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "6px" }}>
                {loading ? "Завантаження..." : `${filteredBooks.length} книг знайдено`}
              </p>
            </div>

            <Link
              href="/add"
              style={{
                background: "#c9a84c",
                color: "#1a1f3c",
                padding: "10px 22px",
                borderRadius: "24px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#1a1f3c";
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#c9a84c";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1a1f3c";
              }}
            >
              Додати книгу +
            </Link>
          </div>

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      height: "240px",
                      background: "linear-gradient(90deg, #ede8df 25%, #f5f0e8 50%, #ede8df 75%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                  <div style={{ padding: "1rem" }}>
                    <div style={{ height: "16px", background: "#ede8df", borderRadius: "4px", marginBottom: "8px" }} />
                    <div style={{ height: "12px", background: "#ede8df", borderRadius: "4px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <p style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.1rem", color: "#6b7280" }}>
              {books.length === 0
                ? "Поки що немає книг. Додайте першу!"
                : "Нічого не знайдено. Спробуйте інший пошук."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
