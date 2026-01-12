import Link from "next/link"
import { STUDIES } from "@/lib/atlas/studies"

export default function AtlasPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Atlas</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {STUDIES.map((s) => (
          <div
            key={s.id}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 14,
              padding: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{s.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{s.id}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {s.slicesCount} slices · {s.slicesExt.toUpperCase()}
              </div>
            </div>

            <Link
              href={`/study/${s.id}`}
              style={{
                textDecoration: "none",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                fontWeight: 700,
              }}
            >
              Abrir
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
