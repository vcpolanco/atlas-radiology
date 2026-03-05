"use client"

import * as React from "react"
import type { Structure } from "@/lib/atlas/types"
import type { AnatomyCategory } from "@/lib/anatomy/types"

type Props = {
  structures: Structure[]
  selectedStructureId?: string
  onSelect: (structureId: string) => void
  categoriesOrder?: AnatomyCategory[]
  categoryLabels?: Partial<Record<AnatomyCategory, string>>
}

const DEFAULT_CATEGORY_LABELS: Partial<Record<AnatomyCategory, string>> = {
  airway: "Vía aérea",
  artery: "Arterias",
  vein: "Venas",
  organ: "Órganos",
}

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

export function StructurePicker({
  structures,
  selectedStructureId,
  onSelect,
  categoriesOrder = ["airway", "artery", "vein", "organ"] as AnatomyCategory[],
  categoryLabels = DEFAULT_CATEGORY_LABELS,
}: Props) {
  const [q, setQ] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState<AnatomyCategory | "all">("all")

  const filtered = React.useMemo(() => {
    const nq = norm(q.trim())
    let list = structures

    if (activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory)
    }
    if (!nq) return list

    return list.filter((s) => {
      const label = norm(s.label || "")
      const id = norm(s.id || "")
      return label.includes(nq) || id.includes(nq)
    })
  }, [structures, q, activeCategory])

  const grouped = React.useMemo(() => {
    const byCat: Record<string, Structure[]> = {}
    for (const s of filtered) {
      const c = (s.category || "other") as string
      if (!byCat[c]) byCat[c] = []
      byCat[c].push(s)
    }
    Object.values(byCat).forEach((arr) =>
      arr.sort((a, b) => (a.label || "").localeCompare(b.label || ""))
    )
    return byCat
  }, [filtered])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      const isTyping = tag === "INPUT" || tag === "TEXTAREA"

      if (e.key === "Escape") {
        setQ("")
        setActiveCategory("all")
        return
      }
      if (isTyping) return

      if (e.key === "1") setActiveCategory("airway")
      if (e.key === "2") setActiveCategory("artery")
      if (e.key === "3") setActiveCategory("vein")
      if (e.key === "4") setActiveCategory("organ")
      if (e.key === "0") setActiveCategory("all")

      if (e.key === "Enter") {
        const first = filtered[0]
        if (first?.id) onSelect(first.id)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [filtered, onSelect])

  const CategoryChip = ({ id, label }: { id: AnatomyCategory | "all"; label: string }) => {
    const active = activeCategory === id
    return (
      <button
        type="button"
        onClick={() => setActiveCategory(id)}
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.18)",
          background: active ? "rgba(255,255,255,0.14)" : "transparent",
          cursor: "pointer",
          fontSize: 12,
          color: "white",
        }}
        title={
          id === "all"
            ? "0 = Todas"
            : id === "airway"
              ? "1 = Vía aérea"
              : id === "artery"
                ? "2 = Arterias"
                : id === "vein"
                  ? "3 = Venas"
                  : "4 = Órganos"
        }
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {/* Search */}
      <div style={{ display: "grid", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar estructura… (Esc limpia)"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            outline: "none",
            fontSize: 14,
          }}
        />

        <style jsx>{`
          input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
        `}</style>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <CategoryChip id="all" label="Todas" />
          {categoriesOrder.map((c) => (
            <CategoryChip key={c} id={c} label={categoryLabels[c] ?? c} />
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: "grid", gap: 10 }}>
        {categoriesOrder.map((cat) => {
          const arr = grouped[cat] || []
          if (activeCategory !== "all" && activeCategory !== cat) return null
          if (arr.length === 0) return null

          return (
            <div key={cat} style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                {categoryLabels[cat] ?? cat} ({arr.length})
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                {arr.map((s) => {
                  const active = s.id === selectedStructureId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelect(s.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 10px",
                        borderRadius: 12,
                        border: active
                          ? "1px solid rgba(59,130,246,0.9)"
                          : "1px solid rgba(255,255,255,0.12)",
                        background: active
                          ? "rgba(59,130,246,0.22)"
                          : "rgba(0,0,0,0.20)",
                        cursor: "pointer",
                        color: "white",
                      }}
                      title={s.id}
                    >
                      <div style={{ fontSize: 14, lineHeight: 1.2, color: "white" }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                        {s.side ? `Lado: ${s.side} · ` : ""}
                        {s.category ? `Cat: ${s.category}` : ""}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            Sin resultados. Probá otro término.
          </div>
        )}
      </div>
    </div>
  )
}
