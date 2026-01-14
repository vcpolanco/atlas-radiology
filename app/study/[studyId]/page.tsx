'use client'

// =====================================================
// [1] IMPORTS
// Imports :: module dependencies
// Imports :: dependencias del módulo
// =====================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from "next/navigation"

import { getStudyById } from "@/lib/atlas/studies"
import { buildSliceUrl } from "@/lib/atlas/loader"
// END SECTION :: [1] IMPORTS
// Fin sección :: [1] Imports

// =====================================================
// [2] TYPES
// Types :: contracts / shapes (no runtime logic)
// Tipos :: contratos / estructuras (sin lógica en runtime)
// =====================================================

// TYPE :: single annotation point (hotspot)
// TIPO :: punto de anotación (hotspot)
type Annotation = { structureId: string; x: number; y: number }

// TYPE :: annotations grouped by slice index
// TIPO :: anotaciones agrupadas por índice de corte
type AnnotationsBySlice = Record<number, Annotation[]>

// -----------------------------------------------------
// TYPES :: CALLOUTS GEOMETRY
// Tipos :: geometría de callouts
// -----------------------------------------------------
// Callout (EN): label outside the image + connector line to a point
// Callout (ES): etiqueta fuera de la imagen + línea que apunta a un punto
type Rect = {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
}

// -----------------------------------------------------
// TYPES :: CALLOUT LAYOUT
// Tipos :: layout (disposición) de callouts
// -----------------------------------------------------
// Layout manager (EN): prevents label overlap by placing labels in columns
// Layout manager (ES): evita solapes ubicando etiquetas en columnas
type CalloutItem = {
  idx: number
  x: number
  y: number
  px: number
  py: number
  isLeft: boolean
  label: string
}

type CalloutPlaced = CalloutItem & {
  endX: number
  endY: number
}
// END SECTION :: [2] TYPES
// Fin sección :: [2] Types


// =====================================================
// [3] COMPONENT :: Page
// Component :: main study viewer page
// Componente :: página principal del visor
// =====================================================
export default function Page() {

  // =====================================================
  // [3.1] PARAMS & STUDY
  // Params & Study :: reads studyId and loads study metadata
  // Params & Study :: lee studyId y carga metadata del estudio
  // =====================================================
  const { studyId } = useParams<{ studyId: string }>()
  const study = useMemo(() => getStudyById(studyId), [studyId])
  const TOTAL_SLICES = study?.slicesCount ?? 0
  // END SECTION :: [3.1] PARAMS & STUDY
  // Fin sección :: [3.1] Params & Study


  // =====================================================
  // [3.2] STATE :: RESPONSIVE FLAGS
  // State :: responsive flags (mobile/desktop)
  // Estado :: flags responsive (móvil/escritorio)
  // =====================================================
  const [isMobile, setIsMobile] = useState(false)

  // EFFECT :: matchMedia mobile detection (updates isMobile)
  // EFECTO :: detección móvil por matchMedia (actualiza isMobile)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  // END SECTION :: [3.2] STATE :: RESPONSIVE FLAGS
  // Fin sección :: [3.2] State responsive


// =====================================================
  // [3.3] REFS :: DOM REFERENCES
  // Refs :: references to DOM elements (viewer/image/file input)
  // Refs :: referencias a elementos DOM (visor/imagen/input)
  // =====================================================
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // END SECTION :: [3.3] REFS :: DOM REFERENCES
  // Fin sección :: [3.3] Refs


// =====================================================
  // [3.4] STATE :: VIEWER NAVIGATION + UI
  // State :: slice navigation and UI toggles
  // Estado :: navegación de cortes y toggles de UI
  // =====================================================
  const [slice, setSlice] = useState(0)
  const [labelsOn, setLabelsOn] = useState(true)

  // NOTE (EN): editMode will be removed for read-only atlas
  // NOTA (ES): editMode se eliminará para atlas solo-lectura
  const [editMode, setEditMode] = useState(false)
  // END SECTION :: [3.4] STATE :: VIEWER NAVIGATION + UI
  // Fin sección :: [3.4] State navigation + UI

  // =====================================================
  // [3.5] REFS :: TOUCH (MOBILE GESTURES)
  // Refs :: touch gesture tracking (for swipe)
  // Refs :: seguimiento de gestos táctiles (para swipe)
  // =====================================================
  const touchStartYRef = useRef<number | null>(null)
  const touchLastTriggerYRef = useRef<number | null>(null)
  // END SECTION :: [3.5] REFS :: TOUCH
  // Fin sección :: [3.5] Refs touch


  // =====================================================
  // [3.6] STATE :: ANNOTATIONS (DATA)
  // State :: annotation data and last loaded source
  // Estado :: datos de anotaciones y última fuente cargada
  // =====================================================

  // NOTE (EN): activeStructure will be removed in read-only mode
  // NOTA (ES): activeStructure se eliminará en modo solo lectura
  const [activeStructure, setActiveStructure] = useState<string>("aorta")

  const [annotationsBySlice, setAnnotationsBySlice] = useState<AnnotationsBySlice>({})
  const [lastLoadedFile, setLastLoadedFile] = useState("")
  // END SECTION :: [3.6] STATE :: ANNOTATIONS (DATA)
  // Fin sección :: [3.6] State annotations


  // =====================================================
  // [3.7] STATE :: CALLOUTS GEOMETRY
  // State :: viewer + image rects (used to place points/lines/labels)
  // Estado :: rects de visor + imagen (para ubicar puntos/líneas/etiquetas)
  // =====================================================
  const [geom, setGeom] = useState<{ v: Rect; i: Rect } | null>(null)
  // END SECTION :: [3.7] STATE :: CALLOUTS GEOMETRY
  // Fin sección :: [3.7] State geom



 // =====================================================
  // [3.8] MEMO :: IMAGE URL (CURRENT SLICE)
  // Memo :: current slice image URL
  // Memo :: URL de la imagen del corte actual
  // =====================================================
  const imageUrl = useMemo(() => {
    if (!study) return ""
    return buildSliceUrl(study, slice)
  }, [study, slice])
  // END SECTION :: [3.8] MEMO :: IMAGE URL (CURRENT SLICE)
  // Fin sección :: [3.8] Memo imageUrl

  


// =====================================================
  // [3.9] EFFECT :: CALLOUT GEOMETRY UPDATE
  // Effect :: recompute geometry on image load / resize
  // Efecto :: recalcula geometría al cargar imagen / redimensionar
  // - computes viewer + image rects
  // - used by lines, points and labels
  // =====================================================
  useEffect(() => {
    // fx: updateCalloutGeometry
    // function: reads DOM rects and stores relative geometry in state
    // función: lee rects del DOM y guarda geometría relativa en state
    const update = () => {
      const v = viewerRef.current
      const i = imgRef.current
      if (!v || !i) return

      const vr = v.getBoundingClientRect()
      const ir = i.getBoundingClientRect()

      setGeom({
        v: {
          left: vr.left,
          top: vr.top,
          width: vr.width,
          height: vr.height,
          right: vr.right,
          bottom: vr.bottom,
        },
        i: {
          left: ir.left,
          top: ir.top,
          width: ir.width,
          height: ir.height,
          right: ir.right,
          bottom: ir.bottom,
        },
      })
    }

    update()
    window.addEventListener("resize", update)

    const img = imgRef.current
    if (img) img.addEventListener("load", update)

    const t = window.setTimeout(update, 0)

    return () => {
      window.removeEventListener("resize", update)
      if (img) img.removeEventListener("load", update)
      window.clearTimeout(t)
    }
  }, [imageUrl])
  // END SECTION :: [3.9] EFFECT :: CALLOUT GEOMETRY UPDATE
  // Fin sección :: [3.9] Effect geom update

 
 // =====================================================
  // [3.10] MEMO :: CURRENT SLICE ANNOTATIONS
  // Memo :: annotations for the current slice index
  // Memo :: anotaciones del índice de corte actual
  // =====================================================
  const annotations = annotationsBySlice[slice] || []
  // END SECTION :: [3.10] MEMO :: CURRENT SLICE ANNOTATIONS
  // Fin sección :: [3.10] Memo annotations


  // =====================================================
  // [3.11] STORAGE :: KEYS + PARSER
  // Storage :: localStorage key + safe JSON parser
  // Storage :: clave localStorage + parser seguro de JSON
  // =====================================================
  const storageKey = `anatoslice:${studyId}:annotations`

  // fx: safeParseAnnotations
  // function: parse + validate annotations JSON (prevents crashes)
  // función: parsea + valida JSON de anotaciones (evita que se rompa la app)
  function safeParseAnnotations(json: string): AnnotationsBySlice | null {
    try {
      const data = JSON.parse(json)
      if (!data || typeof data !== "object") return null
      return data as AnnotationsBySlice
    } catch {
      return null
    }
  }
  // END SECTION :: [3.11] STORAGE :: KEYS + PARSER
  // Fin sección :: [3.11] Storage keys + parser


  // =====================================================
  // [3.12] REFS :: PRELOAD CACHE
  // Refs :: preload cache (avoids reloading same images)
  // Refs :: caché de precarga (evita recargar las mismas imágenes)
  // =====================================================
  const preloadedRef = useRef<Set<string>>(new Set())
  // END SECTION :: [3.12] REFS :: PRELOAD CACHE
  // Fin sección :: [3.12] Refs preload


  // =====================================================
  // [3.13] EFFECT :: PRELOAD NEAR SLICES
  // Effect :: preloads neighbor slices for smooth navigation
  // Efecto :: precarga cortes vecinos para navegación fluida
  // =====================================================
  useEffect(() => {
    if (!study) return
    if (TOTAL_SLICES <= 0) return

    const RANGE = 4
    const urls: string[] = []

    for (let i = slice - RANGE; i <= slice + RANGE; i++) {
      if (i < 0 || i >= study.slicesCount) continue
      urls.push(buildSliceUrl(study, i))
    }

    for (const url of urls) {
      if (preloadedRef.current.has(url)) continue
      preloadedRef.current.add(url)
      const img = new Image()
      img.src = url
    }
  }, [study, slice, TOTAL_SLICES])
  // END SECTION :: [3.13] EFFECT :: PRELOAD NEAR SLICES
  // Fin sección :: [3.13] Effect preload


  // =====================================================
  // [3.14] EFFECT :: RESET DEFAULT STRUCTURE ON STUDY CHANGE
  // Effect :: resets active structure + slice when study changes
  // Efecto :: resetea estructura activa + slice cuando cambia el estudio
  // =====================================================
  // NOTE (EN): this will be removed in read-only mode (no editing needed)
  // NOTA (ES): se removerá en modo solo-lectura (no hace falta edición)
  useEffect(() => {
    if (!study?.structures?.length) return
    setActiveStructure(study.structures[0].id)
    setSlice(0)
  }, [studyId, study])
  // END SECTION :: [3.14] EFFECT :: RESET DEFAULT STRUCTURE ON STUDY CHANGE
  // Fin sección :: [3.14] Effect reset activeStructure


  // =====================================================
  // [3.15] EFFECT :: LOAD USER ANNOTATIONS (localStorage)
  // Effect :: loads saved annotations from localStorage on study change
  // Efecto :: carga anotaciones guardadas desde localStorage al cambiar estudio
  // =====================================================
  // NOTE (EN): for read-only atlas, we will disable this and use only curated JSON
  // NOTA (ES): para atlas solo-lectura, desactivaremos esto y usaremos solo JSON curado
  useEffect(() => {
    if (!studyId) return

    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      setAnnotationsBySlice({})
      setLastLoadedFile("")
      return
    }

    const parsed = safeParseAnnotations(raw)
    if (!parsed) {
      // NOTE (EN): corrupted storage -> start clean
      // NOTA (ES): storage corrupto -> arrancar limpio
      setAnnotationsBySlice({})
      setLastLoadedFile("")
      return
    }

    setAnnotationsBySlice(parsed)
    setLastLoadedFile("Auto (localStorage)")
  }, [studyId]) // important: only when studyId changes / importante: solo cuando cambia studyId
  // END SECTION :: [3.15] EFFECT :: LOAD USER ANNOTATIONS (localStorage)
  // Fin sección :: [3.15] Effect load localStorage


  // =====================================================
  // [3.16] EFFECT :: SAVE USER ANNOTATIONS (localStorage)
  // Effect :: persists annotationsBySlice to localStorage
  // Efecto :: guarda annotationsBySlice en localStorage
  // =====================================================
  // NOTE (EN): for read-only atlas, we will disable this
  // NOTA (ES): para atlas solo-lectura, desactivaremos esto
  useEffect(() => {
    if (!studyId) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(annotationsBySlice))
    } catch {
      // NOTE (EN): storage full/failure -> do not break the app
      // NOTA (ES): storage lleno/falla -> no romper la app
    }
  }, [studyId, annotationsBySlice])
  // END SECTION :: [3.16] EFFECT :: SAVE USER ANNOTATIONS (localStorage)
  // Fin sección :: [3.16] Effect save localStorage


  // =====================================================
  // [3.17] EFFECT :: LOAD CURATED ANNOTATIONS (annotations.json)
  // Effect :: loads curated annotations from public JSON (read-only source)
  // Efecto :: carga anotaciones curadas desde JSON público (fuente solo lectura)
  // =====================================================
  // NOTE (EN): this should be the primary source for the public atlas
  // NOTA (ES): esta debería ser la fuente principal para el atlas público
  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!study) return
      try {
        const res = await fetch(`${study.basePath}/annotations.json`, { cache: "no-store" })
        if (!res.ok) throw new Error("No annotations.json")
        const data = await res.json()

        // NOTE (EN): data is Record<string, Annotation[]>
        // NOTA (ES): data es Record<string, Annotation[]>
        const normalized: AnnotationsBySlice = {}

        for (const [k, arr] of Object.entries(data ?? {})) {
          const idx = Number(k)
          if (!Number.isFinite(idx) || !Array.isArray(arr)) continue
          normalized[idx] = arr
            .filter((it) => it && typeof it === "object")
            .map((it: any) => ({
              structureId: String(it.structureId ?? "unknown"),
              x: Number(it.x),
              y: Number(it.y),
            }))
            .filter((it) => Number.isFinite(it.x) && Number.isFinite(it.y))
        }

        if (!cancelled) setAnnotationsBySlice(normalized)
      } catch {
        if (!cancelled) setAnnotationsBySlice({})
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [studyId, study])
  // END SECTION :: [3.17] EFFECT :: LOAD CURATED ANNOTATIONS (annotations.json)
  // Fin sección :: [3.17] Effect load curated annotations

  // =====================================================
  // [3.18] HANDLER :: WHEEL SLICE NAVIGATION
  // Handler :: mouse wheel changes slice index (prev/next)
  // Manejador :: la rueda del mouse cambia el índice de corte (prev/next)
  // =====================================================
  // handler: onWheel (slice scroll) -> updates slice state
  // manejador: onWheel (scroll de cortes) -> actualiza estado slice

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    if (TOTAL_SLICES <= 0) return
    setSlice((prev) =>
      Math.min(TOTAL_SLICES - 1, Math.max(0, prev + (e.deltaY > 0 ? 1 : -1)))
    )
  }
  // END SECTION :: [3.18] HANDLER :: WHEEL SLICE NAVIGATION
  // Fin sección :: [3.18] Handler onWheel


  // =====================================================
  // [3.19] GUARD :: STUDY NOT FOUND
  // Guard :: early return if study is missing
  // Guard :: retorno temprano si no existe el estudio
  // =====================================================
  if (!study) {
    return <div style={{ padding: 16 }}>Estudio no encontrado: {studyId}</div>
  }
  // END SECTION :: [3.19] GUARD :: STUDY NOT FOUND
  // Fin sección :: [3.19] Guard study missing


  // =====================================================
  // [3.20] HANDLER :: ADD ANNOTATION POINT (EDIT MODE)
  // Handler :: adds a point on click (only when editMode=true)
  // Manejador :: agrega un punto al click (solo si editMode=true)
  // =====================================================
  // handler: addPointAtClick -> converts click to image-relative coords [0..1]
  // manejador: addPointAtClick -> convierte click a coords relativas [0..1]

  function addPointAtClick(e: React.MouseEvent<HTMLDivElement>) {
    // NOTE (EN): read-only atlas -> this will be disabled (no user edits)
    // NOTA (ES): atlas solo lectura -> esto se desactiva (sin edición de usuario)
    if (!editMode) return

    const viewer = viewerRef.current
    const img = imgRef.current
    if (!viewer || !img) return

    const vRect = viewer.getBoundingClientRect()
    const iRect = img.getBoundingClientRect()

    // coords relative to IMAGE rect, not viewer
    // coordenadas relativas al rect de la IMAGEN, no del viewer
    const relX = (e.clientX - iRect.left) / iRect.width
    const relY = (e.clientY - iRect.top) / iRect.height

    // guard: ignore clicks outside the image (black margins)
    // guard: ignorar clicks fuera de la imagen (margen negro)
    if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return

    const newAnn: Annotation = { structureId: activeStructure, x: relX, y: relY }

    setAnnotationsBySlice((prev) => {
      const current = prev[slice] ?? []
      return { ...prev, [slice]: [...current, newAnn] }
    })
  }
  // END SECTION :: [3.20] HANDLER :: ADD ANNOTATION POINT (EDIT MODE)
  // Fin sección :: [3.20] Handler addPointAtClick


  // =====================================================
  // [3.21] fx :: DELETE ANNOTATION POINT (EDIT MODE)
  // Function :: removes a point by slice + index
  // Función :: elimina un punto por corte + índice
  // =====================================================
  // fx: deleteAnnotationAt (removes annotation from a slice array)
  // fx: deleteAnnotationAt (elimina anotación del array de un corte)
  function deleteAnnotationAt(sliceIndex: number, idx: number) {
    // NOTE (EN): read-only atlas -> this will be disabled (no user deletes)
    // NOTA (ES): atlas solo lectura -> esto se desactiva (sin borrado de usuario)
    setAnnotationsBySlice((prev) => {
      const current = prev[sliceIndex] ?? []
      if (!current.length) return prev
      const next = current.filter((_, i) => i !== idx)
      return { ...prev, [sliceIndex]: next }
    })
  }
  // END SECTION :: [3.21] fx :: DELETE ANNOTATION POINT (EDIT MODE)
  // Fin sección :: [3.21] fx deleteAnnotationAt


  // =====================================================
  // [3.22] fx :: STRUCTURE LABEL RESOLVER
  // Function :: maps structureId -> human label (from study.structures)
  // Función :: mapea structureId -> etiqueta legible (desde study.structures)
  // =====================================================
  // fx: structureLabel (id -> label)
  // fx: structureLabel (id -> label)
  function structureLabel(id: string) {
    return study?.structures?.find((s) => s.id === id)?.label ?? id
  }
  // END SECTION :: [3.22] fx :: STRUCTURE LABEL RESOLVER
  // Fin sección :: [3.22] fx structureLabel

  // =====================================================
  // [3.11] fx :: CALLOUT LAYOUT MANAGER
  // Function :: assigns non-overlapping Y positions for callout labels
  // Función :: asigna posiciones Y sin solapamiento para etiquetas de callouts
  // - splits left/right columns (x < 0.5 vs x >= 0.5)
  // - sorts by desired Y (top to bottom)
  // - enforces min vertical gap between labels
  // - clamps within viewer bounds (top/bottom)
  // =====================================================
  function layoutCallouts(items: CalloutItem[], viewH: number, minGapPx: number) {
    // helper: place a side (left or right)
    // helper: ubica un lado (izq o der)
    const placeSide = (side: CalloutItem[]) => {
      // sort by desired Y (top to bottom)
      // ordenar por Y deseada (arriba hacia abajo)
      const sorted = [...side].sort((a, b) => a.py - b.py)

      const placed: CalloutPlaced[] = []
      let lastY = -Infinity

      for (const it of sorted) {
        // initial desired Y
        // Y objetivo inicial
        let y = it.py

        // push down if overlaps with previous
        // empujar hacia abajo si se solapa con el anterior
        y = Math.max(y, lastY + minGapPx)

        placed.push({ ...it, endX: 0, endY: y })
        lastY = y
      }

      // clamp bottom overflow by shifting everything up
      // limitar si se pasa abajo: desplazar todo hacia arriba
      if (placed.length > 0) {
        const maxY = placed[placed.length - 1].endY
        const bottomLimit = viewH - 16
        if (maxY > bottomLimit) {
          const shiftUp = maxY - bottomLimit
          for (const p of placed) p.endY -= shiftUp
        }

        // clamp top overflow
        // limitar si se pasa arriba
        const minY = placed[0].endY
        const topLimit = 16
        if (minY < topLimit) {
          const shiftDown = topLimit - minY
          for (const p of placed) p.endY += shiftDown
        }
      }

      return placed
    }

    // split items by side
    // separar items por lado
    const left = items.filter((i) => i.isLeft)
    const right = items.filter((i) => !i.isLeft)

    const placedLeft = placeSide(left)
    const placedRight = placeSide(right)

    return [...placedLeft, ...placedRight]
  }
  // END SECTION :: [3.11] fx :: CALLOUT LAYOUT MANAGER
  // Fin sección :: [3.11] fx layoutCallouts

  // =====================================================
  // [3.12] MEMO :: CALLOUTS (COMPUTE + LAYOUT)
  // Memo :: callouts computed in px and laid out (no label overlap)
  // Memo :: callouts calculados en px y ordenados (sin solapes)
  // - builds px coords for each annotation (relative to viewer)
  // - computes side (left/right) using x < 0.5
  // - applies layoutCallouts to enforce vertical spacing
  // - assigns endX (label anchor) outside the image margins
  // =====================================================
  const callouts: CalloutPlaced[] = useMemo(() => {
    if (!geom) return []
    if (!study) return []
    if (!annotations.length) return []

    // constants for layout
    // constantes del layout
    const MIN_GAP_PX = 26 // vertical spacing between labels / separación vertical

    // build items from annotations (slice-local list)
    // construir items desde annotations (lista del corte)
    const items: CalloutItem[] = annotations.map((a, idx) => {
      const label =
        study.structures.find((s) => s.id === a.structureId)?.label ?? a.structureId

      // point in px relative to viewer (important: use imageRect within viewer)
      // punto en px relativo al viewer (clave: usar rect de imagen dentro del viewer)
      const px = (geom.i.left - geom.v.left) + a.x * geom.i.width
      const py = (geom.i.top - geom.v.top) + a.y * geom.i.height

      return {
        idx,
        x: a.x,
        y: a.y,
        px,
        py,
        isLeft: a.x < 0.5,
        label,
      }
    })

    // place without overlap (side columns)
    // ubicar sin solapes (columnas por lado)
    const placed = layoutCallouts(items, geom.v.height, MIN_GAP_PX)

    // assign endX for each side (outside image margin)
    // asignar endX por lado (afuera del margen de imagen)
    return placed.map((p) => {
      const endX = p.isLeft
        ? Math.max(10, (geom.i.left - geom.v.left) - 18)
        : Math.min(geom.v.width - 10, (geom.i.right - geom.v.left) + 18)

      // endY already computed by layoutCallouts
      // endY ya viene calculado por layoutCallouts
      return { ...p, endX, endY: p.endY }
    })
  }, [geom, study, annotations])
  // END SECTION :: [3.12] MEMO :: CALLOUTS (COMPUTE + LAYOUT)
  // Fin sección :: [3.12] Memo callouts



// ************** R E T U R N  principal ************ //


// =====================================================
// [3.13] RENDER :: RETURN (JSX)
// Render :: main UI (viewer + callouts + overlays)
// Render :: UI principal (visor + callouts + overlays)
// =====================================================
return (
  <div className="appRoot">
    {/* ===================================================== */}
    {/* [3.13.1] SECTION :: VIEWER                             */}
    {/* Sección :: Visor principal                             */}
    {/* Where: return() root -> first child                    */}
    {/* Dónde: raíz del return() -> primer hijo                */}
    {/* ===================================================== */}
    <div ref={viewerRef} onWheel={onWheel} className="viewer">
      {/* ----------------------------------------------------- */}
      {/* [3.13.1.1] SECTION :: IMAGE (slice)                    */}
      {/* Sección :: Imagen (corte)                             */}
      {/* Where: inside viewer, first child                     */}
      {/* Dónde: dentro del viewer, primer hijo                 */}
      {/* ----------------------------------------------------- */}
      <img ref={imgRef} src={imageUrl} alt="CT" draggable={false} className="viewerImg" />
      {/* END SECTION :: [3.13.1.1] IMAGE (slice) */}
      {/* Fin sección :: [3.13.1.1] Imagen */}


      {/* ===================================================== */}
      {/* [3.13.1.2] SECTION :: CALLOUTS (ordered layout)        */}
      {/* Sección :: Callouts (layout ordenado, sin solapes)     */}
      {/* Where: inside viewer, after <img />                    */}
      {/* Dónde: dentro del viewer, después de <img />           */}
      {/* Note: uses "callouts" memo (layoutCallouts)            */}
      {/* Nota: usa el memo "callouts" (layoutCallouts)          */}
      {/* ===================================================== */}
      {geom && callouts.length > 0 && (
        <>
          {/* ----------------------------------------------------- */}
          {/* [3.13.1.2.1] SVG :: connector lines                   */}
          {/* SVG :: líneas conectoras                              */}
          {/* Function (EN): dot -> label anchor                    */}
          {/* Función (ES): conecta punto -> ancla de etiqueta      */}
          {/* ----------------------------------------------------- */}
          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 8000,
              pointerEvents: "none",
            }}
          >
            {callouts.map((c) => (
              <line
                key={`ln-${c.idx}`}
                x1={c.px}
                y1={c.py}
                x2={c.endX}
                y2={c.endY}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2"
              />
            ))}
          </svg>
          {/* END SECTION :: [3.13.1.2.1] SVG :: connector lines */}
          {/* Fin sección :: [3.13.1.2.1] SVG líneas */}


          {/* ----------------------------------------------------- */}
          {/* [3.13.1.2.2] POINTS :: anatomical points              */}
          {/* Puntos :: puntos anatómicos                           */}
          {/* Note (EN): read-only overlay                          */}
          {/* Nota (ES): overlay de solo lectura                    */}
          {/* ----------------------------------------------------- */}
          {callouts.map((c) => (
            <div
              key={`pt-${c.idx}`}
              style={{
                position: "absolute",
                left: c.px,
                top: c.py,
                transform: "translate(-50%, -50%)",
                zIndex: 8500,
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#22c55e",
                border: "2px solid rgba(0,0,0,0.6)",
                pointerEvents: "none",
              }}
            />
          ))}
          {/* END SECTION :: [3.13.1.2.2] POINTS */}
          {/* Fin sección :: [3.13.1.2.2] Puntos */}


          {/* ----------------------------------------------------- */}
          {/* [3.13.1.2.3] LABELS :: external labels                */}
          {/* Etiquetas :: externas                                 */}
          {/* Note (EN): uses endY from layoutCallouts (no overlap)  */}
          {/* Nota (ES): usa endY ordenado (sin solapes)            */}
          {/* ----------------------------------------------------- */}
          {labelsOn &&
            callouts.map((c) => (
              <div
                key={`lb-${c.idx}`}
                style={{
                  position: "absolute",
                  left: c.endX,
                  top: c.endY,
                  transform: c.isLeft ? "translate(-100%, -50%)" : "translate(0%, -50%)",
                  zIndex: 9000,
                  pointerEvents: "none",
                  background: "rgba(0,0,0,0.65)",
                  color: "white",
                  fontSize: 12,
                  padding: "6px 8px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  whiteSpace: "nowrap",
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {c.label}
              </div>
            ))}
          {/* END SECTION :: [3.13.1.2.3] LABELS */}
          {/* Fin sección :: [3.13.1.2.3] Etiquetas */}
        </>
      )}
      {/* END SECTION :: [3.13.1.2] CALLOUTS (ordered layout) */}
      {/* Fin sección :: [3.13.1.2] Callouts */}


      {/* ===================================================== */}
      {/* [3.13.1.3] SECTION :: OVERLAYS (UI)                    */}
      {/* Sección :: Overlays (UI)                               */}
      {/* Where: inside viewer, after callouts                   */}
      {/* Dónde: dentro del viewer, después de callouts          */}
      {/* ===================================================== */}

      {/* Overlay: slice counter */}
      {/* Overlay: contador de cortes */}
      <div style={{ position: "absolute", top: 10, left: 10, color: "white", zIndex: 9999 }}>
        Corte {slice + 1} / {TOTAL_SLICES}
      </div>

      {/* NAV BUTTONS :: Next / Prev (fixed to viewport) */}
      {/* BOTONES :: Next / Prev (fixed al viewport) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setSlice((prev) => Math.max(0, prev - 1))
        }}
        disabled={slice <= 0}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 9999,
          background: slice <= 0 ? "#333" : "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 14px",
          borderRadius: 10,
          cursor: slice <= 0 ? "not-allowed" : "pointer",
          opacity: slice <= 0 ? 0.5 : 1,
        }}
      >
        ◀ Prev
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setSlice((prev) => Math.min(TOTAL_SLICES - 1, prev + 1))
        }}
        disabled={slice >= TOTAL_SLICES - 1}
        style={{
          position: "fixed",
          bottom: 20,
          left: 110,
          zIndex: 9999,
          background: slice >= TOTAL_SLICES - 1 ? "#333" : "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 14px",
          borderRadius: 10,
          cursor: slice >= TOTAL_SLICES - 1 ? "not-allowed" : "pointer",
          opacity: slice >= TOTAL_SLICES - 1 ? 0.5 : 1,
        }}
      >
        Next ▶
      </button>

      {/* TOGGLE :: labels visibility */}
      {/* TOGGLE :: visibilidad de etiquetas */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setLabelsOn((v) => !v)
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 9999,
          background: labelsOn ? "#16a34a" : "#444",
          color: "white",
          border: "none",
          padding: "8px 10px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Etiquetas: {labelsOn ? "ON" : "OFF"}
      </button>

      {/* PANEL :: Key slices (floating list) */}
      {/* PANEL :: Cortes clave (lista flotante) */}
      {study.keySlices && study.keySlices.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 12,
            zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            borderRadius: 12,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ color: "white", fontWeight: 700, fontSize: 12, opacity: 0.9 }}>
            Cortes clave
          </div>

          {study.keySlices.map((k) => (
            <button
              key={k}
              onClick={(e) => {
                e.stopPropagation()
                setSlice(k)
              }}
              style={{
                textAlign: "left",
                background: k === slice ? "#2563eb" : "rgba(255,255,255,0.1)",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                opacity: k === slice ? 1 : 0.9,
              }}
            >
              Corte {k + 1}
            </button>
          ))}
        </div>
      )}

      {/* END SECTION :: [3.13.1.3] OVERLAYS (UI) */}
      {/* Fin sección :: [3.13.1.3] Overlays */}
    </div>
    {/* END SECTION :: [3.13.1] VIEWER */}
    {/* Fin sección :: [3.13.1] Visor principal */}


    {/* ===================================================== */}
    {/* [3.13.2] SECTION :: STYLES (scoped JSX)                 */}
    {/* Sección :: Estilos (scoped JSX)                         */}
    {/* Where: return() -> after viewer, before closing root     */}
    {/* Dónde: return() -> después del viewer, antes del cierre  */}
    {/* ===================================================== */}
    <style jsx>{`
      /* ===================================================== */
      /* ROOT :: PAGE CONTAINER                                */
      /* Contenedor raíz de la página (visor)                  */
      /* ===================================================== */
      .appRoot {
        height: 100%;
        width: 100%;
        display: flex;
        background: #111;
        overflow: hidden;
        min-height: 0;
      }

      /* ===================================================== */
      /* VIEWER :: IMAGE CONTAINER                             */
      /* Contenedor del visor de TC                            */
      /* ===================================================== */
      .viewer {
        flex: 1;
        min-width: 0;
        min-height: 0;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #000;
        touch-action: none;
      }

      /* ===================================================== */
      /* IMAGE :: SLICE                                        */
      /* Imagen del corte (se adapta al visor)                 */
      /* ===================================================== */
      .viewerImg {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        user-select: none;
        -webkit-user-drag: none;
      }
    `}</style>
    {/* END SECTION :: [3.13.2] STYLES */}
    {/* Fin sección :: [3.13.2] Styles */}
  </div>
)
// END SECTION :: [3.13] RENDER :: RETURN (JSX)
// Fin sección :: [3.13] Render return


}