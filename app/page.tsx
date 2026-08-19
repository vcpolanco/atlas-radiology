import Link from "next/link"

function CardLink({
  href,
  title,
  desc,
}: {
  href: string
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 18,
        padding: 18,
        display: "block",
        color: "inherit",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ opacity: 0.8, lineHeight: 1.35 }}>{desc}</div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 30, margin: "8px 0 6px" }}>Panel principal</h1>
      <p style={{ opacity: 0.8, margin: "0 0 18px" }}>
        Elegí un módulo para empezar.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        <CardLink
          href="/atlas"
          title="Atlas"
          desc="Visor principal tipo atlas (cortes, etiquetas, navegación)."
        />
        
      </div>
    </main>
  )
}
