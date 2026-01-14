import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Proyectos Web",
  description: "Atlas y casos de RX",
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.10)",
        color: "inherit",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {label}
    </Link>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.9)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
                Proyectos Web
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                Atlas • Casos RX
              </div>
            </Link>

            <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <NavLink href="/" label="Inicio" />
              <NavLink href="/atlas" label="Atlas" />
              <NavLink href="/casos-rx" label="Casos RX" />
            </nav>
          </div>
        </header>

        {/* Content */}
          <div
          style={{
          flex: 1,
          minHeight: 0,          // clave: permite que los hijos hagan overflow interno
          overflow: "hidden",    // evita scroll de la página
          }}
          >
          {children}
        </div>

      </body>
    </html>
  )
}
