"use client"

import { use, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const CASES = {
  "rx-001": {
    title: "Neumonía lobar",
    region: "Tórax",
    image: "/casos-rx/rx-001/image.jpg",
    overlay: {
      label: "Consolidación en lóbulo inferior derecho",
points: [
  [
    64,
    48.4
  ],
  [
    71.6,
    45.4
  ],
  [
    76.1,
    40.4
  ],
  [
    77.9,
    38.3
  ],
  [
    80,
    50.6
  ],
  [
    81.4,
    64
  ],
  [
    80,
    71.7
  ],
  [
    79.6,
    73.7
  ],
  [
    75.5,
    69.6
  ],
  [
    69.7,
    68.3
  ],
  [
    65.7,
    68.2
  ],
  [
    63.4,
    69.4
  ],
  [
    60.9,
    70.3
  ],
  [
    58.3,
    72
  ],
  [
    56.8,
    73.4
  ],
  [
    55.6,
    70.4
  ],
  [
    55.5,
    64.7
  ],
  [
    55.1,
    60.9
  ],
  [
    55.1,
    58.9
  ],
  [
    57.8,
    53.5
  ],
  [
    60.9,
    50.9
  ]
]
    },
    findings: [
      "Opacidad alveolar focal de distribución lobar.",
      "Presencia de broncograma aéreo.",
      "Sin signos evidentes de neumotórax.",
      "Silueta cardiomediastínica conservada.",
    ],
    diagnosis: "Hallazgos compatibles con neumonía lobar.",
    teachingPoints: [
      "La consolidación lobar suele respetar límites anatómicos.",
      "El broncograma aéreo orienta a ocupación alveolar.",
      "Comparar siempre con una RX normal facilita reconocer la pérdida de aireación.",
    ],
  },
}

type Point = [number, number]

export default function CasoRxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const isAuthor = searchParams.get("author") === "1"

  const caso = CASES[id as keyof typeof CASES]
  const imageWrapRef = useRef<HTMLDivElement | null>(null)

  const [showOverlay, setShowOverlay] = useState(false)
  const [points, setPoints] = useState<Point[]>(caso?.overlay.points as Point[] ?? [])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  const polygonPoints = useMemo(
    () => points.map(([x, y]) => `${x},${y}`).join(" "),
    [points]
  )

  if (!caso) {
    return (
      <main className="casePage">
        <h1>Caso no encontrado</h1>
        <Link href="/casos-rx">Volver a casos RX</Link>
      </main>
    )
  }

  function addPolygonPoint(e: React.MouseEvent<HTMLDivElement>) {
    if (!isAuthor) return

    const el = imageWrapRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (x < 0 || x > 100 || y < 0 || y > 100) return

    setPoints((prev) => [
      ...prev,
      [Number(x.toFixed(1)), Number(y.toFixed(1))],
    ])

    setShowOverlay(true)
  }

  function movePoint(
  e: React.MouseEvent<HTMLDivElement>
) {
  if (draggingIndex === null) return

  const el = imageWrapRef.current
  if (!el) return

  const rect = el.getBoundingClientRect()

  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  setPoints((prev) =>
    prev.map((p, i) =>
      i === draggingIndex
        ? [
            Number(Math.max(0, Math.min(100, x)).toFixed(1)),
            Number(Math.max(0, Math.min(100, y)).toFixed(1)),
          ]
        : p
    )
  )
}

function stopDragging() {
  setDraggingIndex(null)
}
  const exportText = `points: ${JSON.stringify(points, null, 2)}`

  return (
    <main className="casePage">
      <Link href="/casos-rx" className="backLink">
        ← Volver a casos RX
      </Link>

      <div className="headerRow">
        <div>
          <h1>{caso.title}</h1>
          <div className="meta">
            {caso.region} • {id}
            {isAuthor ? " • Modo autor" : ""}
          </div>
        </div>

        <Link href="/study/rx_chest_normal_v1" className="normalLink">
          RX normal →
        </Link>
      </div>

      <div className="layout">
        <section className="imageColumn">
          <div className="imageCard">
            <div
  ref={imageWrapRef}
  onClick={addPolygonPoint}
  onMouseMove={movePoint}
  onMouseUp={stopDragging}
  onMouseLeave={stopDragging}
  className={isAuthor ? "imageWrap author" : "imageWrap"}
>
              <img src={caso.image} alt={caso.title} />

              {(showOverlay || isAuthor) && points.length >= 2 && (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="overlaySvg"
                >
                  <polygon
                    points={polygonPoints}
                    fill="rgba(236, 72, 153, 0.28)"
                    stroke="rgba(236, 72, 153, 0.95)"
                    strokeWidth="0.4"
                  />
                </svg>
              )}

              {isAuthor &&
                points.map(([x, y], idx) => (
                 <div
                      key={`${x}-${y}-${idx}`}
                      className="authorPoint"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setDraggingIndex(idx)
                      }}
                    >
                    {idx + 1}
                  </div>
                ))}

              {showOverlay && !isAuthor && (
                <div className="overlayLabel">{caso.overlay.label}</div>
              )}
            </div>
          </div>

          <div className="actions">
            <button
              onClick={() => setShowOverlay((v) => !v)}
              className={showOverlay ? "pinkBtn" : "darkBtn"}
            >
              {showOverlay ? "Ocultar hallazgo" : "Mostrar hallazgo"}
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={() => setPoints((p) => p.slice(0, -1))}
                  className="lightBtn"
                >
                  Deshacer punto
                </button>

                <button onClick={() => setPoints([])} className="lightBtn">
                  Limpiar
                </button>
              </>
            )}
          </div>

          {isAuthor && (
            <textarea
              readOnly
              value={exportText}
              className="exportBox"
              onFocus={(e) => e.currentTarget.select()}
            />
          )}
        </section>

        <aside className="infoColumn">
          <Card title="Hallazgos" items={caso.findings} />
          <Card title="Diagnóstico" text={caso.diagnosis} />
          <Card title="Puntos docentes" items={caso.teachingPoints} />
        </aside>
      </div>

      <style jsx>{`
        .casePage {
          height: 100dvh;
          overflow-y: auto;
          padding: 16px 18px 28px;
          max-width: 1320px;
          margin: 0 auto;
          background: #f8fafc;
        }

        .backLink {
          font-size: 14px;
        }

        .headerRow {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin: 10px 0 14px;
        }

        h1 {
          font-size: clamp(22px, 2.2vw, 30px);
          margin: 0 0 4px;
        }

        .meta {
          opacity: 0.72;
          font-size: 14px;
        }

        .normalLink {
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 999px;
          padding: 9px 13px;
          color: inherit;
          background: white;
          font-weight: 800;
          white-space: nowrap;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.75fr);
          gap: 18px;
          align-items: start;
        }

        .imageCard {
          background: #000;
          border-radius: 18px;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }

        .imageWrap {
          position: relative;
          width: 100%;
          max-height: calc(100dvh - 250px);
          overflow: hidden;
          background: #000;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .imageWrap.author {
          cursor: crosshair;
        }

        .imageWrap img {
          max-width: 100%;
          max-height: calc(100dvh - 250px);
          width: auto;
          height: auto;
          display: block;
        }

        .overlaySvg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .overlayLabel {
          position: absolute;
          left: 50%;
          top: 76%;
          transform: translateX(-50%);
          background: rgba(236, 72, 153, 0.92);
          color: white;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
        }

        .authorPoint {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ec4899;
  color: white;
  border: 2px solid white;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);

  cursor: grab;
  pointer-events: auto;
}

        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        button {
          border-radius: 999px;
          padding: 9px 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .darkBtn {
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #111827;
          color: white;
        }

        .pinkBtn {
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #ec4899;
          color: white;
        }

        .lightBtn {
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: white;
          color: #111827;
        }

        .exportBox {
          width: 100%;
          min-height: 120px;
          margin-top: 10px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 12px;
          font-family: monospace;
          font-size: 12px;
        }

        .infoColumn {
          display: grid;
          gap: 12px;
        }

        @media (max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .imageWrap,
          .imageWrap img {
            max-height: none;
          }
        }

        @media (max-width: 640px) {
          .casePage {
            padding: 12px;
          }

          .headerRow {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  )
}

function Card({
  title,
  items,
  text,
}: {
  title: string
  items?: string[]
  text?: string
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 16,
        padding: 16,
        background: "white",
      }}
    >
      <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>{title}</h2>

      {text && <p style={{ margin: 0 }}>{text}</p>}

      {items && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map((item) => (
            <li key={item} style={{ marginBottom: 6 }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}