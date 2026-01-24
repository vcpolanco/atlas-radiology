'use client'

/* =====================================================
   [1] IMPORTS
   ===================================================== */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { downloadJson } from '@/lib/atlas/downloadJson'
import { TORAX_TC_LABELS_ES } from '@/lib/atlas/labels/torax_tc_es'

import { getStudyById } from '@/lib/atlas/studies'
import { buildSliceUrl } from '@/lib/atlas/loader'
/* END [1] IMPORTS */


/* =====================================================
   [2] TYPES
   ===================================================== */

/* [2.1] Annotation point */
type Annotation = { structureId: string; x: number; y: number }

/* [2.2] Annotations by slice index (string key) */
type AnnotationsBySlice = Record<string, Annotation[] | undefined>

/* [2.3] Geometry helpers */
type Rect = {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
}

/* [2.4] Callouts (layout items) */
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
/* END [2] TYPES */


/* =====================================================
   [3] COMPONENT :: Page
   ===================================================== */
export default function Page() {
  /* =====================================================
     [3.1] PARAMS & STUDY
     ===================================================== */
  const { studyId } = useParams<{ studyId: string }>()
  const study = useMemo(() => getStudyById(studyId), [studyId])
  const TOTAL_SLICES = study?.slicesCount ?? 0
  /* END [3.1] PARAMS & STUDY */


  /* =====================================================
     [3.2] MODE :: AUTHOR (?author=1)
     ===================================================== */
    const searchParams = useSearchParams()
    const isAuthor = searchParams.get('author') === '1'
  /* END [3.2] MODE :: AUTHOR */


  /* =====================================================
     [3.3] STATE :: CORE UI
     ===================================================== */
  const [slice, setSlice] = useState(0)
  const [labelsOn, setLabelsOn] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  /* END [3.3] STATE :: CORE UI */


  /* =====================================================
     [3.4] STATE :: ANNOTATIONS / AUTHOR
     ===================================================== */
  const [activeStructure, setActiveStructure] = useState<string>('aorta')
  const [annotationsBySlice, setAnnotationsBySlice] = useState<AnnotationsBySlice>({})
  const [lastLoadedFile, setLastLoadedFile] = useState('')

  /* [3.4.x] STATE :: CALLOUTS GEOMETRY */
  const [geom, setGeom] = useState<{ v: Rect; i: Rect } | null>(null)
  /* END [3.4.x] STATE :: CALLOUTS GEOMETRY */
  /* END [3.4] STATE :: ANNOTATIONS / AUTHOR */


  /* =====================================================
     [3.5] REFS :: DOM + TOUCH + PRELOAD
     ===================================================== */
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const touchStartYRef = useRef<number | null>(null)
  const touchLastTriggerYRef = useRef<number | null>(null)

  const preloadedRef = useRef<Set<string>>(new Set())
  /* END [3.5] REFS :: DOM + TOUCH + PRELOAD */


  /* =====================================================
     [3.6] MEMOS :: DERIVED
     ===================================================== */
  const imageUrl = useMemo(() => {
    if (!study) return ''
    return buildSliceUrl(study, slice)
  }, [study, slice])

  const annotations = annotationsBySlice[String(slice)] ?? []
  /* END [3.6] MEMOS :: DERIVED */


  /* =====================================================
     [3.6.x] HELPERS :: safeParseAnnotations
     ===================================================== */
  function safeParseAnnotations(json: string): AnnotationsBySlice | null {
    try {
      const data = JSON.parse(json)

      // Caso 1: wrapper con annotationsBySlice
      if (data && typeof data === 'object' && (data as any).annotationsBySlice) {
        return (data as any).annotationsBySlice as AnnotationsBySlice
      }

      // Caso 2: plano (Record<string, Annotation[]>)
      if (data && typeof data === 'object') {
        return data as AnnotationsBySlice
      }

      return null
    } catch {
      return null
    }
  }
  /* END [3.6.x] HELPERS :: safeParseAnnotations */


  /* =====================================================
     [3.6.x] HELPERS :: labels
     ===================================================== */
  const structureLabel = (structureId: string) =>
    TORAX_TC_LABELS_ES[structureId] ?? structureId

  const KEY_SLICE_LABELS_ES: Record<number, string> = {
    14: 'Arco aórtico',
    21: 'Carina',
    27: 'Hilios',
    33: 'Corazón (medio)',
    39: 'VCI / Bases',
  }
  /* END [3.6.x] HELPERS :: labels */


  /* =====================================================
     [3.7] EFFECT :: mounted flag
     ===================================================== */
  useEffect(() => {
    setMounted(true)
  }, [])
  /* END [3.7] EFFECT :: mounted flag */


  /* =====================================================
     [3.8] EFFECT :: detect mobile (resize < 768)
     ===================================================== */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  /* END [3.8] EFFECT :: detect mobile */


  /* =====================================================
     [3.9] EFFECT :: auto-close sidebar on mobile (on slice change)
     ===================================================== */
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [slice, isMobile])
  /* END [3.9] EFFECT :: auto-close sidebar */



/* =====================================================
   [3.9.1] HELPER :: contained image rect (object-fit: contain)
   Purpose (EN): get the real displayed image box inside the <img> element
   Propósito (ES): obtener la caja real de la imagen dentro del <img> (con contain)
   Where: Page() -> helpers -> used by geometry + author clicks + callouts
   ===================================================== */
  function getContainedImageRectPx(imgEl: HTMLImageElement, imgRect: DOMRect) {
    const natW = imgEl.naturalWidth || 0
    const natH = imgEl.naturalHeight || 0

    // Fallback: if not loaded, assume full element rect
    if (!natW || !natH) {
      return { left: imgRect.left, top: imgRect.top, width: imgRect.width, height: imgRect.height }
    }

    const containerW = imgRect.width
    const containerH = imgRect.height
    const imgAspect = natW / natH
    const containerAspect = containerW / containerH

    let drawW = containerW
    let drawH = containerH
    let offsetX = 0
    let offsetY = 0

    // object-fit: contain => fit by limiting dimension
    if (imgAspect > containerAspect) {
      // image is wider -> full width, letterbox top/bottom
      drawW = containerW
      drawH = containerW / imgAspect
      offsetY = (containerH - drawH) / 2
    } else {
      // image is taller -> full height, letterbox left/right
      drawH = containerH
      drawW = containerH * imgAspect
      offsetX = (containerW - drawW) / 2
    }

    return {
      left: imgRect.left + offsetX,
      top: imgRect.top + offsetY,
      width: drawW,
      height: drawH,
    }
  }
  /* END [3.9.x] HELPER :: contained image rect */



  /* =====================================================
   [3.10] EFFECT :: callout geometry (viewer + image rects)
   Purpose (EN): recompute viewer/image rects after image load + layout reflow
   Propósito (ES): recalcular rects de viewer/imagen tras load + reflow de layout
   Where: Page() -> effects -> geometry used by callouts/dots/labels
   ===================================================== */

  useEffect(() => {
    const update = () => {
      const v = viewerRef.current
      const i = imgRef.current
      if (!v || !i) return

      const vr = v.getBoundingClientRect()
      const ir = i.getBoundingClientRect()
      const cr = getContainedImageRectPx(i, ir)
      
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
          left: cr.left,
          top: cr.top,
          width: cr.width,
          height: cr.height,
          right: cr.left + cr.width,
          bottom: cr.top + cr.height,
        },
      })
    }

    // Initial + reflow-safe update (double RAF)
    // Actualización inicial + segura ante reflow (doble RAF)
    const raf1 = window.requestAnimationFrame(() => {
      update()
      window.requestAnimationFrame(update)
    })

    window.addEventListener('resize', update)

    const img = imgRef.current
    if (img) img.addEventListener('load', update)

    return () => {
      window.cancelAnimationFrame(raf1)
      window.removeEventListener('resize', update)
      if (img) img.removeEventListener('load', update)
    }
  }, [imageUrl, isMobile])

  /* END [3.10] EFFECT :: callout geometry */



  /* =====================================================
     [3.11] EFFECT :: preload neighbor slices
     ===================================================== */
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
  /* END [3.11] EFFECT :: preload */


  /* =====================================================
     [3.12] EFFECT :: reset defaults on study change
     ===================================================== */
  useEffect(() => {
    if (!study?.structures?.length) return
    setActiveStructure(study.structures[0].id)
    setSlice(0)
  }, [studyId, study])
  /* END [3.12] EFFECT :: reset defaults */


  /* =====================================================
     [3.13] EFFECT :: localStorage load/save (AUTHOR ONLY)
     ===================================================== */
  const storageKey = `anatoslice:${studyId}:annotations`

  useEffect(() => {
    if (!studyId) return
    if (!isAuthor) return

    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      setAnnotationsBySlice({})
      setLastLoadedFile('')
      return
    }

    const parsed = safeParseAnnotations(raw)
    if (!parsed) {
      setAnnotationsBySlice({})
      setLastLoadedFile('')
      return
    }

    setAnnotationsBySlice(parsed)
    setLastLoadedFile('Auto (localStorage)')
  }, [studyId, isAuthor]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!studyId) return
    if (!isAuthor) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(annotationsBySlice))
    } catch {
      // no-op
    }
  }, [studyId, isAuthor, annotationsBySlice])
  /* END [3.13] EFFECT :: localStorage load/save */


  /* =====================================================
     [3.14] EFFECT :: load curated annotations.json (PUBLIC)
     ===================================================== */
  useEffect(() => {
    if (!study) return
    if (isAuthor) return

    const s = study // snapshot: evita "study possibly undefined" dentro del async
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`${s.basePath}/annotations.json?v=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('No annotations.json')

        const text = await res.text()
        const parsed = safeParseAnnotations(text)
        if (!parsed) return

        const normalized: AnnotationsBySlice = {}

        for (const [k, arr] of Object.entries(parsed)) {
          const idx = Number(k)
          if (!Number.isFinite(idx) || !Array.isArray(arr)) continue

          normalized[String(idx)] = arr
            .filter((it) => it && typeof it === 'object')
            .map((it: any) => ({
              structureId: String(it.structureId ?? 'unknown'),
              x: Number(it.x),
              y: Number(it.y),
            }))
            .filter((it) => Number.isFinite(it.x) && Number.isFinite(it.y))
        }

        if (!cancelled) setAnnotationsBySlice(normalized)
        if (!cancelled) setLastLoadedFile('Curated (public annotations.json)')
      } catch {
        if (!cancelled) setAnnotationsBySlice({})
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [study, isAuthor]) // eslint-disable-line react-hooks/exhaustive-deps
  /* END [3.14] EFFECT :: load curated annotations.json */


  /* =====================================================
     [3.15] GUARD :: study not found
     ===================================================== */
  if (!study) {
    return <div style={{ padding: 16 }}>Estudio no encontrado: {studyId}</div>
  }
  /* END [3.15] GUARD :: study not found */


  /* =====================================================
     [3.18] HANDLER :: wheel slice navigation
     ===================================================== */
  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    if (TOTAL_SLICES <= 0) return

    setSlice((prev) =>
      Math.min(TOTAL_SLICES - 1, Math.max(0, prev + (e.deltaY > 0 ? 1 : -1)))
    )
  }
  /* END [3.18] HANDLER :: wheel slice navigation */


  /* =====================================================
     [3.20] fx :: upsertAnnotationAtSlice (AUTHOR)
     ===================================================== */
  function upsertAnnotationAtSlice(sliceIndex: number, ann: Annotation) {
    setAnnotationsBySlice((prev) => {
      const current = prev[String(sliceIndex)] ?? []
      const withoutSame = current.filter((a) => a.structureId !== ann.structureId)
      return { ...prev, [String(sliceIndex)]: [...withoutSame, ann] }
    })
  }
  /* END [3.20] fx :: upsertAnnotationAtSlice (AUTHOR) */


  /* =====================================================
     [3.21] fx :: deleteAnnotationAt (AUTHOR)
     ===================================================== */
  function deleteAnnotationAt(sliceIndex: number, idx: number) {
    setAnnotationsBySlice((prev) => {
      const current = prev[String(sliceIndex)] ?? []
      if (!current.length) return prev
      const next = current.filter((_, i) => i !== idx)
      return { ...prev, [String(sliceIndex)]: next }
    })
  }
  /* END [3.21] fx :: deleteAnnotationAt (AUTHOR) */


  /* =====================================================
     [3.22] HANDLER :: addPointAtClick (AUTHOR)
     ===================================================== */
  function addPointAtClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isAuthor) return

    const img = imgRef.current
    if (!img) return

    const iRect = img.getBoundingClientRect()
    const cRect = getContainedImageRectPx(img, iRect)

    const relX = (e.clientX - cRect.left) / cRect.width
    const relY = (e.clientY - cRect.top) / cRect.height

    if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return

    const ann: Annotation = { structureId: activeStructure, x: relX, y: relY }
    upsertAnnotationAtSlice(slice, ann)
  }
  /* END [3.22] HANDLER :: addPointAtClick (AUTHOR) */


  /* =====================================================
     [3.23] HANDLER :: exportAnnotationsJson (AUTHOR)
     ===================================================== */
  function exportAnnotationsJson() {
    if (!study) return
    const s = study
    
    const normalized: Record<string, Annotation[]> = {}

    for (const [k, arr] of Object.entries(annotationsBySlice ?? {})) {
      if (!Array.isArray(arr)) continue

      normalized[String(k)] = arr
        .filter((it) => it && typeof it === 'object')
        .map((it: any) => ({
          structureId: String(it.structureId ?? 'unknown'),
          x: Number(it.x),
          y: Number(it.y),
        }))
        .filter((it) => Number.isFinite(it.x) && Number.isFinite(it.y))
    }

    const payload = {
      version: 1,
      studyId: s.id,
      createdAt: new Date().toISOString(),
      annotationsBySlice: normalized,
    }

    downloadJson(payload, 'annotations.json')
  }
  /* END [3.23] HANDLER :: exportAnnotationsJson (AUTHOR) */


  /* =====================================================
     [3.24] fx :: layoutCallouts
     ===================================================== */
  function layoutCallouts(items: CalloutItem[], viewH: number, minGapPx: number) {
    const placeSide = (side: CalloutItem[]) => {
      const sorted = [...side].sort((a, b) => a.py - b.py)

      const placed: CalloutPlaced[] = []
      let lastY = -Infinity

      for (const it of sorted) {
        let y = it.py
        y = Math.max(y, lastY + minGapPx)
        placed.push({ ...it, endX: 0, endY: y })
        lastY = y
      }

      if (placed.length > 0) {
        const maxY = placed[placed.length - 1].endY
        const bottomLimit = viewH - 16
        if (maxY > bottomLimit) {
          const shiftUp = maxY - bottomLimit
          for (const p of placed) p.endY -= shiftUp
        }

        const minY = placed[0].endY
        const topLimit = 16
        if (minY < topLimit) {
          const shiftDown = topLimit - minY
          for (const p of placed) p.endY += shiftDown
        }
      }

      return placed
    }

    const left = items.filter((i) => i.isLeft)
    const right = items.filter((i) => !i.isLeft)

    return [...placeSide(left), ...placeSide(right)]
  }
  /* END [3.24] fx :: layoutCallouts */


  /* =====================================================
     [3.25] MEMO :: callouts (px + layout)
     ===================================================== */
  const callouts: CalloutPlaced[] = useMemo(() => {
    if (!geom) return []
    if (!annotations.length) return []

    const MIN_GAP_PX = 26

    const items: CalloutItem[] = annotations.map((a, idx) => {
      const s = study.structures.find((it) => it.id === a.structureId)

      const label = s?.label ?? structureLabel (a.structureId)

      const px = geom.i.left - geom.v.left + a.x * geom.i.width
      const py = geom.i.top - geom.v.top + a.y * geom.i.height

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

    const placed = layoutCallouts(items, geom.v.height, MIN_GAP_PX)

    const COL_PAD = 12
    return placed.map((p) => {
      const endX = p.isLeft ? COL_PAD : Math.max(COL_PAD, geom.v.width - COL_PAD)
      return { ...p, endX, endY: p.endY }
    })
  }, [geom, study, annotations]) // eslint-disable-line react-hooks/exhaustive-deps
  /* END [3.25] MEMO :: callouts (px + layout) */


  /* =====================================================
     [3.26] STYLE HELPERS
     ===================================================== */
  const SIDEBAR_W_DESKTOP = 320
  const SIDEBAR_W_MOBILE = 180
  const sidebarW = isMobile ? SIDEBAR_W_MOBILE : SIDEBAR_W_DESKTOP

  const sideBtnStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.35)',
    color: 'white',
    cursor: 'pointer',
    padding: isMobile ? '10px 12px' : '14px 16px',
    fontSize: isMobile ? 13 : 15,
    marginBottom: isMobile ? 6 : 10,
    lineHeight: 1.2,
    transition: 'background 0.15s ease, transform 0.05s ease',
  }

  const calloutLabelStyle: React.CSSProperties = {
    pointerEvents: 'none',
    background: 'rgba(0, 0, 0, 0.90)',
    color: 'white',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.15)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transform: 'translate(0, -50%)',
    fontSize: isMobile ? 11 : 14,
    padding: isMobile ? '4px 7px' : '6px 8px',
    maxWidth: isMobile ? 160 : 260,
  }

  const calloutDotStyle: React.CSSProperties = {
    width: isMobile ? 7 : 10,
    height: isMobile ? 7 : 10,
    borderRadius: 999,
    background: '#22c55e',
    border: isMobile
      ? '1.5px solid rgba(0,0,0,0.6)'
      : '2px solid rgba(0,0,0,0.6)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
  }

  const sidePanelStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: sidebarOpen ? sidebarW : 0,
    maxWidth: sidebarOpen ? sidebarW : 0,
    minWidth: 0,
    overflow: 'hidden',
    padding: sidebarOpen ? 12 : 0,
    borderRight: sidebarOpen ? '1px solid rgba(0,0,0,0.12)' : 'none',
    transition: 'width 180ms ease, max-width 180ms ease, padding 180ms ease',
    boxSizing: 'border-box',
  }
  /* END [3.26] STYLE HELPERS */


  /* =====================================================
    [3.27] UI FLAGS :: minimal mode
    ===================================================== */
  const SHOW_LEFT_PANEL_PUBLIC = false // visor minimalista
  const showLeftPanel = mounted && (isAuthor ? true : SHOW_LEFT_PANEL_PUBLIC)
  /* END [3.27] UI FLAGS :: minimal mode */



/* ============= R E T U R N principal ==================*/



  /* =====================================================
     [3.30] JSX :: return
     ===================================================== */
  return (
    <div className="appRoot">

      {/* =====================================================
    [3.30.1] JSX :: sidePanel (optional)
    Where: return() -> inside <div className="appRoot">
   ===================================================== */}
    {showLeftPanel && (
      <aside
        className="sidePanel"
        style={{
          ...sidePanelStyle,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
      >
        {/* SidePanel content */}
        <div className="keySlicesList">
          {study.keySlices?.map((k) => {
            const idx = typeof k === 'number' ? k : k.idx
            const fallbackLabel = typeof k === 'number' ? undefined : k.label

            return (
              <button
                key={`slice-${idx}`}
                onClick={() => setSlice(idx)}
                className={`sidePanelItem ${idx === slice ? 'active' : ''}`}
                style={{
                  ...sideBtnStyle,
                  background:
                    idx === slice ? 'rgba(59,130,246,0.85)' : sideBtnStyle.background,
                }}
              >
                {KEY_SLICE_LABELS_ES[idx] ?? fallbackLabel ?? `Slice ${idx}`}
              </button>
            )
          })}
        </div>
      </aside>
    )}
    {/* END [3.30.1] JSX :: sidePanel (optional) */}


      {/* =====================================================
         [3.30.2] JSX :: viewer
         ===================================================== */}
      <main
        ref={viewerRef}
        onWheel={onWheel}
        onClick={isAuthor ? addPointAtClick : undefined}
        className="viewer"
      >
        {/* [3.30.2.1] Viewer :: toggle sidebar   POR AHORA SILENCIADO */}
        
        {showLeftPanel && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSidebarOpen((v) => !v)
          }}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 99999,
            padding: isMobile ? '8px 10px' : '8px 12px',
            fontSize: isMobile ? 12 : 13,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(0,0,0,0.55)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {sidebarOpen ? 'Ocultar' : 'Slices'}
        </button>
        )}


        {/* [3.30.2.2] Viewer :: slice counter */}
        <div
          style={{
            position: 'absolute',
            top: 44,
            left: 10,
            color: 'white',
            zIndex: 9999,
            fontSize: 12,
            opacity: 0.9,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '6px 8px',
          }}
        >
          Corte {slice + 1} / {TOTAL_SLICES}
        </div>

        {/* [3.30.2.3] Viewer :: image */}
        <img ref={imgRef} src={imageUrl} alt="CT" draggable={false} className="viewerImg" />

        {/* =====================================================
           [3.30.2.4] Viewer :: callouts
           ===================================================== */}
        {geom && callouts.length > 0 && (
          <>
            {/* [3.30.2.4.1] SVG lines */}
            <svg
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 8000,
                pointerEvents: 'none',
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

            {/* [3.30.2.4.2] dots */}
            {callouts.map((c) => (
              <div
                key={`pt-${c.idx}`}
                style={{
                  position: 'absolute',
                  left: c.px,
                  top: c.py,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 8500,
                  pointerEvents: 'none',
                  ...calloutDotStyle,
                }}
              />
            ))}

            {/* [3.30.2.4.3] labels */}
            {labelsOn &&
              callouts.map((c) => (
                <div
                  key={`lb-${c.idx}`}
                  style={{
                    position: 'absolute',
                    top: c.endY,
                    zIndex: 9000,
                    ...calloutLabelStyle,
                    left: c.isLeft ? c.endX : undefined,
                    right: c.isLeft ? undefined : isMobile ? 8 : 12,
                    textAlign: c.isLeft ? 'left' : 'right',
                  }}
                >
                  {c.label}
                </div>
              ))}
          </>
        )}
        {/* END [3.30.2.4] Viewer :: callouts */}

        {/* [3.30.2.5] Viewer :: labels toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setLabelsOn((v) => !v)
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 9999,
            background: labelsOn ? '#16a34a' : '#444',
            color: 'white',
            border: 'none',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Etiquetas: {labelsOn ? 'ON' : 'OFF'}
        </button>

        {/* [3.30.2.6] Viewer :: prev/next */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSlice((prev) => Math.max(0, prev - 1))
          }}
          disabled={slice <= 0}
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 9999,
            background: slice <= 0 ? '#333' : '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 14px',
            borderRadius: 10,
            cursor: slice <= 0 ? 'not-allowed' : 'pointer',
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
            position: 'fixed',
            bottom: 20,
            left: 110,
            zIndex: 9999,
            background: slice >= TOTAL_SLICES - 1 ? '#333' : '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 14px',
            borderRadius: 10,
            cursor: slice >= TOTAL_SLICES - 1 ? 'not-allowed' : 'pointer',
            opacity: slice >= TOTAL_SLICES - 1 ? 0.5 : 1,
          }}
        >
          Next ▶
        </button>

        {/* =====================================================
           [3.30.2.7] Viewer :: author tools (overlay)
           ===================================================== */}
        {mounted && isAuthor && (
          <div
            style={{
              position: 'absolute',
              top: 86,
              left: 12,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: 10,
              color: 'white',
              width: 280,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
              Active structure:
            </div>

            <select
              value={activeStructure}
              onChange={(e) => setActiveStructure(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(0,0,0,0.35)',
                color: 'white',
                outline: 'none',
              }}
            >
              {study.structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={exportAnnotationsJson}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(0,0,0,0.35)',
                  color: 'white',
                }}
              >
                Exportar annotations.json
              </button>

              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
                Pegalo en public/studies/{study.id}/annotations.json
              </div>
            </div>

            {/* Nota: deleteAnnotationAt está disponible si querés habilitar borrado por click derecho más adelante */}
          </div>
        )}
        {/* END [3.30.2.7] Viewer :: author tools */}
      </main>
      {/* END [3.30.2] JSX :: viewer */}

      {/* =====================================================
         [3.30.3] JSX :: scoped styles (CSS only)
         ===================================================== */}
      <style jsx>{`
        /* ===================================================== */
        /* [3.30.3] LAYOUT :: root                               */
        /* ===================================================== */
        .appRoot {
          height: 100%;
          display: flex;
          flex-direction: row;
          background: #000;
          overflow: hidden;
          min-height: 0;
        }

        /* ===================================================== */
        /* [3.30.3] SIDE PANEL (width is controlled inline)      */
        /* ===================================================== */
        .sidePanel {
          flex: 0 0 auto;
          background: rgba(10, 10, 10, 0.95);
          border-right: 1px solid #222;
          overflow-y: auto;
          color: white;
          min-height: 0;
          min-width: 0;
          box-sizing: border-box;
        }

        /* ===================================================== */
        /* [3.30.3] KEY SLICES LIST                              */
        /* ===================================================== */
        .keySlicesList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidePanelItem {
          width: 100%;
          display: block;
          text-align: left;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
        }

        .sidePanelItem:hover {
          background: rgba(0, 0, 0, 0.92);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }

        .sidePanelItem.active {
          background: rgba(37, 99, 235, 0.95);
          border-color: rgba(37, 99, 235, 1);
        }

        /* ===================================================== */
        /* [3.30.3] VIEWER                                       */
        /* ===================================================== */
        .viewer {
          flex: 1;
          min-width: 0;
          min-height: 0;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        .viewerImg {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>
      {/* END [3.30.3] JSX :: scoped styles */}
    </div>
  )
  /* END [3.30] JSX :: return */
}
