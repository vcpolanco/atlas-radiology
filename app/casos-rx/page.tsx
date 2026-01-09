import Link from "next/link"

const casos = [
  { id: "rx-001", titulo: "Neumonía lobar", region: "Tórax" },
  { id: "rx-002", titulo: "Fractura de radio distal", region: "Miembro superior" },
]

export default function CasosRxPage() {
  return (
    <main>
      <h1 style={{ fontSize: 26, margin: "8px 0 12px" }}>Casos de RX</h1>

      <div style={{ display: "grid", gap: 10, maxWidth: 780 }}>
        {casos.map((c) => (
          <Link
            key={c.id}
            href={`/casos-rx/${c.id}`}
            style={{
              textDecoration: "none",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 14,
              padding: 14,
              color: "inherit",
              display: "block",
            }}
          >
            <div style={{ fontWeight: 800 }}>{c.titulo}</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              {c.region} • {c.id}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
