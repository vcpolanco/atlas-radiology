import Link from "next/link"

export default function AtlasPage() {
  // por ahora hardcodeado; después lo sacamos de un JSON o API
  const studies = [
    { id: "demo", title: "Demo study" },
    // { id: "123", title: "Abdomen TC" },
  ]

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, margin: "8px 0 12px" }}>Atlas</h1>

      <div style={{ display: "grid", gap: 12, maxWidth: 780 }}>
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Abrir por ID</div>
          <p style={{ opacity: 0.8, margin: 0 }}>
            Abrí el visor entrando a <code>/study/&lt;studyId&gt;</code>.
          </p>
          <p style={{ opacity: 0.8, margin: "8px 0 0" }}>
            Ejemplo:{" "}
            <Link href="/study/demo" style={{ textDecoration: "underline" }}>
              /study/demo
            </Link>
          </p>
        </div>

        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Studies</div>
          <div style={{ display: "grid", gap: 8 }}>
            {studies.map((s) => (
              <Link
                key={s.id}
                href={`/study/${s.id}`}
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 12,
                  padding: 12,
                  color: "inherit",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 700 }}>{s.title}</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>{s.id}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
