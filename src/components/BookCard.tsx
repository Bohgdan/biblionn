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
  if (condition === "Нова") return "#166534";
  if (condition === "Як нова") return "#1e40af";
  if (condition === "Добрий") return "#854d0e";
  if (condition === "Задовільний") return "#991b1b";
  return "#374151";
}

export default function BookCard({ id, title, author, price, condition, imageUrl }: BookCardProps) {
  const badgeColor = getConditionBadge(condition);

  return (
    <div
      className="group"
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: "240px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #1a1f3c, #2d3561)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="group-hover:scale-[1.04]"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              display: "block",
            }}
          />
        ) : (
          <span style={{ fontSize: "3.5rem" }}>📖</span>
        )}

        {/* Condition badge — top left */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.85)",
            color: badgeColor,
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "20px",
            lineHeight: 1.4,
          }}
        >
          {condition}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            color: "#1a1f3c",
            fontSize: "1rem",
            fontWeight: 600,
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
          <span style={{ color: "#c9a84c", fontWeight: 800, fontSize: "1.25rem" }}>
            ₴{price}
          </span>

          <Link
            href={`/books/${id}`}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#f0ece4",
              color: "#1a1f3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            className="hover:!bg-[#1a1f3c] hover:!text-white"
          >
            →
          </Link>
        </div>
      </div>
    </div>
  );
}
