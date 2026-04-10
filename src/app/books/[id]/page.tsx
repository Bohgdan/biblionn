import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author?: string;
  authors?: string;
  price: number;
  condition: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  imageUrl?: string | null;
};

function getConditionStyles(condition: string) {
  if (condition === "Нова") return { background: "#dcfce7", color: "#166534" };
  if (condition === "Як нова") return { background: "#dbeafe", color: "#1e40af" };
  if (condition === "Добрий") return { background: "#fef9c3", color: "#854d0e" };
  if (condition === "Задовільний") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f3f4f6", color: "#374151" };
}

async function getBook(id: string): Promise<Book | null> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://biblionn.vercel.app";
  const response = await fetch(`${baseUrl}/api/books/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as Book;
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    return (
      <main style={{ background: "#f5f0e8", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "2rem", color: "#1a1f3c", marginBottom: "1rem" }}>
          Книгу не знайдено
        </h1>
        <Link href="/" style={{ color: "#1a1f3c", textDecoration: "underline" }}>
          Повернутися до каталогу
        </Link>
      </main>
    );
  }

  const author = book.author ?? book.authors ?? "Невідомий автор";
  const badgeStyles = getConditionStyles(book.condition);
  const titleShort = book.title.length > 28 ? book.title.slice(0, 28) + "…" : book.title;

  return (
    <main style={{ background: "#f5f0e8", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }} className="hover:text-[#1a1f3c]">
            Головна
          </Link>
          <span>→</span>
          <Link href="/#books" style={{ color: "#6b7280", textDecoration: "none" }} className="hover:text-[#1a1f3c]">
            Каталог
          </Link>
          <span>→</span>
          <span style={{ color: "#1a1f3c", fontWeight: 500 }}>{titleShort}</span>
        </nav>

        {/* Main card */}
        <article
          style={{
            background: "white",
            borderRadius: "var(--radius-lg, 20px)",
            boxShadow: "var(--shadow-lg, 0 8px 32px rgba(26,31,60,0.14))",
            padding: "2.5rem",
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Left column */}
          <section style={{ flex: "0 0 280px", minWidth: "220px" }}>
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "380px",
                position: "relative",
              }}
            >
              {book.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "380px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      display: "block",
                    }}
                    className="hover:scale-[1.02]"
                  />
                  {/* Photo watermark */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.4)",
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    Фото
                  </span>
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "380px",
                    background: "linear-gradient(145deg, #1a1f3c, #2d3561)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "5rem",
                  }}
                >
                  📖
                </div>
              )}
            </div>

            {/* Condition badge */}
            <div
              style={{
                marginTop: "1rem",
                display: "inline-block",
                borderRadius: "20px",
                padding: "5px 14px",
                fontSize: "0.8rem",
                fontWeight: 600,
                backgroundColor: badgeStyles.background,
                color: badgeStyles.color,
              }}
            >
              {book.condition}
            </div>
          </section>

          {/* Right column */}
          <section style={{ flex: 1, minWidth: "260px" }}>
            <h1
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "2rem",
                color: "#1a1f3c",
                marginBottom: "0.25rem",
                lineHeight: 1.2,
              }}
            >
              {book.title}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: "1.5rem" }}>
              Автор: {author}
            </p>

            <div style={{ borderTop: "1px solid #e5e0d8" }} />

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", margin: "1.25rem 0" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#c9a84c", lineHeight: 1 }}>
                {book.price}
              </span>
              <span style={{ fontSize: "1.1rem", color: "#9ca3af", fontWeight: 500 }}>грн</span>
            </div>

            {/* Description */}
            {book.description ? (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#1a1f3c",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  Про книгу
                </p>
                <p style={{ color: "#374151", lineHeight: 1.75, fontSize: "0.95rem" }}>
                  {book.description}
                </p>
              </div>
            ) : null}

            {/* Contact section */}
            <div
              style={{
                background: "#f9f7f3",
                borderRadius: "12px",
                padding: "1.25rem",
                marginTop: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#1a1f3c",
                  marginBottom: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                📞 Зв&apos;язатися з продавцем
              </h2>

              {book.contactEmail || book.contactPhone ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {book.contactEmail ? (
                    <a
                      href={`mailto:${book.contactEmail}`}
                      style={{
                        display: "block",
                        border: "1px solid #e8e2d9",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        background: "white",
                        color: "#1a1f3c",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "border-color 0.2s",
                      }}
                      className="hover:border-[#c9a84c]"
                    >
                      ✉ {book.contactEmail}
                    </a>
                  ) : null}
                  {book.contactPhone ? (
                    <a
                      href={`tel:${book.contactPhone}`}
                      style={{
                        display: "block",
                        border: "1px solid #e8e2d9",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        background: "white",
                        color: "#1a1f3c",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "border-color 0.2s",
                      }}
                      className="hover:border-[#c9a84c]"
                    >
                      📱 {book.contactPhone}
                    </a>
                  ) : null}
                  {book.contactEmail ? (
                    <a
                      href={`mailto:${book.contactEmail}`}
                      style={{
                        display: "block",
                        marginTop: "0.5rem",
                        background: "linear-gradient(135deg, #1a1f3c, #2d3561)",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        textAlign: "center",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        transition: "all 0.2s",
                      }}
                      className="hover:brightness-110"
                    >
                      Написати повідомлення
                    </a>
                  ) : null}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.9rem" }}>
                  Контактні дані не вказані
                </p>
              )}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
