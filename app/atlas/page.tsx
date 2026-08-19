'use client'

import Link from "next/link"
import { STUDIES } from "@/lib/atlas/studies"

// =====================================================
// PAGE :: Atlas (CardLink list of studies)
// Página :: Atlas (lista de estudios con CardLink)
// Where (EN): app/atlas/page.tsx
// Dónde (ES): app/atlas/page.tsx
// Purpose (EN): show studies as clickable cards (no "Open" button)
// Propósito (ES): mostrar estudios como cards clickeables (sin botón "Abrir")
// =====================================================
export default function AtlasPage() {
  console.log("ATLAS PAGE CARGADA", STUDIES.map((s) => s.id))
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* ----------------------------------------------------- */}
      {/* SECTION :: HEADER                                     */}
      {/* Sección :: Encabezado                                 */}
      {/* ----------------------------------------------------- */}
      <div style={{ padding: "4px 0 6px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.2 }}>Atlas</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
          Seleccioná un estudio para abrir el visor.
        </div>
      </div>
      {/* END SECTION :: HEADER */}
      {/* Fin sección :: Encabezado */}

      {/* ----------------------------------------------------- */}
      {/* SECTION :: STUDY CARDS (CardLink)                     */}
      {/* Sección :: Cards de estudios (CardLink)               */}
      {/* ----------------------------------------------------- */}
      <div style={{ display: "grid", gap: 12 }}>
        {STUDIES
           .filter((s) => !s.id.toLowerCase().includes("rx"))
           .map((s) => (
          <Link
            key={s.id}
            href={`/study/${s.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.10)",
              padding: 14,
              background: "white",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
            }}
            // NOTE: inline hover handling via onMouse events (no CSS file needed)
            // NOTA: hover inline con eventos (sin CSS aparte)
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 22px rgba(0,0,0,0.08)"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,0,0,0.16)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)"
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,0,0,0.10)"
            }}
          >
            {/* LEFT :: Title + meta */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 850, fontSize: 16, lineHeight: 1.2 }}>{s.title}</div>

              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span>
                  {s.slicesCount} cortes
                </span>
                <span>
                  {s.slicesExt.toUpperCase()}
                </span>
                <span>
                  {s.structures?.length ?? 0} estructuras
                </span>
              </div>
            </div>

            {/* RIGHT :: Chevron (visual hint, not a button) */}
            <div
              aria-hidden
              style={{
                fontSize: 18,
                opacity: 0.55,
                flexShrink: 0,
                paddingLeft: 8,
              }}
            >
              →
            </div>
          </Link>
        ))}
      </div>
      {/* END SECTION :: STUDY CARDS (CardLink) */}
      {/* Fin sección :: Cards de estudios (CardLink) */}
    </div>
  )
}
// END SECTION :: PAGE :: Atlas (CardLink list of studies)
// Fin sección :: Página :: Atlas (lista de estudios con CardLink)
