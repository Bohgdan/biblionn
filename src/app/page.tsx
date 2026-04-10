import Link from "next/link";
import BookCard from "@/components/BookCard";

type Book = {
  id: string;
  title: string;
  author?: string;
  authors?: string;
  price: number;
  condition: string;
  imageUrl?: string | null;
};

async function getBooks(): Promise<Book[]> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://biblionn.vercel.app';
  const response = await fetch(`${baseUrl}/api/books`, { cache: 'no-store' });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as Book[];
}

export default async function HomePage() {
  const books = await getBooks();

  return (
    <main>
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

      <section id="books" style={{ background: "#f5f0e8", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2.5rem",
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
                {books.length} книг в каталозі
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

          {books.length === 0 ? (
            <p className="py-10 text-center text-lg text-[#1a1f3c]">
              Поки що немає книг. Додайте першу!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {books.map((book) => (
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
