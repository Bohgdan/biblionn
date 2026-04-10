import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1a1f3c", color: "white", padding: "3rem 2rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Three columns */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {/* Col 1 — Brand */}
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "0.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#c9a84c",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                Biblion
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>
              Книжковий маркет для українців
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div style={{ flex: "1 1 160px" }}>
            <p
              style={{
                color: "white",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Маркет
            </p>
            {[
              { href: "/", label: "Каталог" },
              { href: "/add", label: "Додати книгу" },
              { href: "/", label: "Як це працює" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.85rem",
                  display: "block",
                  marginBottom: "0.5rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                className="hover:text-[#c9a84c]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Contacts */}
          <div style={{ flex: "1 1 200px" }}>
            <p
              style={{
                color: "white",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Контакти
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
              biblion.market@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", margin: 0 }}>
            © 2026 Biblion. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
