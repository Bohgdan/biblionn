import Link from "next/link";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  imageUrl?: string | null;
};

function getConditionBadge(condition: string) {
  if (condition === "Нова") return { bg: "#dcfce7", color: "#166534" };
  if (condition === "Як нова") return { bg: "#dbeafe", color: "#1e40af" };
  if (condition === "Добрий") return { bg: "#fef9c3", color: "#854d0e" };
  if (condition === "Задовільний") return { bg: "#fee2e2", color: "#991b1b" };
  return { bg: "#f3f4f6", color: "#374151" };
}

export default function BookCard({ id, title, author, price, condition, imageUrl }: BookCardProps) {
  const badge = getConditionBadge(condition);

  return (
    <Link
      href={`/books/${id}`}
      className="group block cursor-pointer"
      style={{ textDecoration: "none" }}
    >
      <article
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #ede8df",
          overflow: "hidden",
          transition: "all 0.25s ease",
        }}
        className="group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(26,31,60,0.12)]"
      >
        {/* Cover */}
        <div
          style={{
            height: "220px",
            background: "linear-gradient(145deg, #1a1f3c, #2d3561)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "4rem" }}>📖</span>
          )}

          {/* Condition badge */}
          <span
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
            }}
          >
            {condition}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#1a1f3c",
              fontSize: "1rem",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "0.25rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              marginBottom: "0.75rem",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {author}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "1.2rem" }}>
              ₴{price}
            </span>
            <span
              className="group-hover:bg-[#c9a84c] group-hover:text-[#1a1f3c]"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#1a1f3c",
                color: "white",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
