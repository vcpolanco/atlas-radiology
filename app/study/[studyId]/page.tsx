'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function Page() {
  const TOTAL_SLICES = 105

  const viewerRef = useRef(null)
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)

  const [slice, setSlice] = useState(50)
  const [labelsOn, setLabelsOn] = useState(true)
  const [editMode, setEditMode] = useState(false)

  const [activeStructure, setActiveStructure] = useState('aorta') // aorta | vcI | porta
  const [annotationsBySlice, setAnnotationsBySlice] = useState({})
  const [lastLoadedFile, setLastLoadedFile] = useState('')

  const imageUrl = useMemo(() => {
    return `/studies/abdomen_ct_normal_v1/slices/${String(slice).padStart(4, '0')}.jpg`
  }, [slice])

  const annotations = annotationsBySlice[slice] || []

  useEffect(() => {
    const preload = (idx) => {
      if (idx < 0 || idx >= TOTAL_SLICES) return
      const img = new Image()
      img.src = `/studies/abdomen_ct_normal_v1/slices/${String(idx).padStart(4, '0')}.jpg`
    }
    preload(slice - 1)
    preload(slice + 1)
  }, [slice])

  function onWheel(e) {
    e.preventDefault()
    setSlice((prev) =>
      Math.min(TOTAL_SLICES - 1, Math.max(0, prev + (e.deltaY > 0 ? 1 : -1)))
    )
  }

  function structureLabel(id) {
    if (id === 'aorta') return 'Aorta'
    if (id === 'vcI') return 'VCI'
    if (id === 'porta') return 'Porta'
    return id
  }

  function structureColor(id) {
    if (id === 'aorta') return '#7dd3fc'
    if (id === 'vcI') return '#ffd54a'
    if (id === 'porta') return '#f472b6'
    return '#bbb'
  }

  function addPointAtClick(e) {
    if (!editMode) return
    const img = imgRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    if (x < 0 || x > 1 || y < 0 || y > 1) return

    setAnnotationsBySlice((prev) => {
      const copy = { ...prev }
      const list = copy[slice] ? [...copy[slice]] : []
      list.push({ structureId: activeStructure, x, y })
      copy[slice] = list
      return copy
    })
  }

  function deleteAnnotationAt(sliceIndex, annIndex) {
    setAnnotationsBySlice((prev) => {
      const copy = { ...prev }
      const list = copy[sliceIndex] ? [...copy[sliceIndex]] : []
      list.splice(annIndex, 1)
      copy[sliceIndex] = list
      return copy
    })
  }

  function downloadJson(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  function importAnnotationsFromFile(file) {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = String(reader.result || '')
        const parsed = JSON.parse(text)

        const maybeAnnotations = parsed.annotationsBySlice ? parsed.annotationsBySlice : parsed
        if (!maybeAnnotations || typeof maybeAnnotations !== 'object') {
          alert('JSON inválido: no se encontró annotationsBySlice ni un objeto de cortes.')
          return
        }

        const normalized = {}
        Object.keys(maybeAnnotations).forEach((k) => {
          const sliceIndex = Number(k)
          if (Number.isNaN(sliceIndex)) return

          const arr = maybeAnnotations[k]
          if (!Array.isArray(arr)) return

          normalized[sliceIndex] = arr
            .filter((it) => it && typeof it === 'object')
            .map((it) => ({
              structureId: String(it.structureId || 'unknown'),
              x: Number(it.x),
              y: Number(it.y)
            }))
            .filter((it) => Number.isFinite(it.x) && Number.isFinite(it.y))
        })

        setAnnotationsBySlice(normalized)
        setLastLoadedFile(file.name || 'anotaciones.json')
        alert('Anotaciones importadas correctamente.')
      } catch (err) {
        alert('No pude leer el JSON. Verificá que sea un archivo exportado por la app.')
      }
    }

    reader.readAsText(file)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', background: '#111', overflow: 'hidden' }}>
      {/* VISOR */}
      <div
        ref={viewerRef}
        onWheel={onWheel}
        onClick={addPointAtClick}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="TC Abdomen"
          draggable={false}
          style={{ maxHeight: '96vh', maxWidth: '100%' }}
        />

        <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
          Corte {slice + 1} / {TOTAL_SLICES}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setLabelsOn((v) => !v)
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: labelsOn ? '#16a34a' : '#444',
            color: 'white',
            border: 'none',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Etiquetas: {labelsOn ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setEditMode((v) => !v)
          }}
          style={{
            position: 'absolute',
            top: 52,
            right: 10,
            background: editMode ? '#c53030' : '#333',
            color: 'white',
            border: 'none',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Edit: {editMode ? 'ON' : 'OFF'}
        </button>

        {/* HOTSPOTS (alineados a la imagen, no al contenedor) */}
        {labelsOn &&
          annotations.map((a, idx) => {
            const viewer = viewerRef.current
            const img = imgRef.current
            if (!viewer || !img) return null

            const vRect = viewer.getBoundingClientRect()
            const iRect = img.getBoundingClientRect()

            const pxLeft = iRect.left - vRect.left + a.x * iRect.width
            const pxTop = iRect.top - vRect.top + a.y * iRect.height

            return (
              <div
                key={idx}
                title={`${structureLabel(a.structureId)} (click derecho para borrar)`}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  deleteAnnotationAt(slice, idx)
                }}
                style={{
                  position: 'absolute',
                  left: pxLeft,
                  top: pxTop,
                  transform: 'translate(-50%, -50%)',
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: structureColor(a.structureId),
                  boxShadow: '0 0 0 3px rgba(0,0,0,0.6)',
                  cursor: 'pointer'
                }}
              />
            )
          })}
      </div>

      {/* PANEL DERECHO */}
      <div
        style={{
          width: 360,
          background: '#0b0b0b',
          color: 'white',
          padding: 16,
          overflowY: 'auto',
          borderLeft: '1px solid #222'
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>Editor</div>

        <div style={{ marginTop: 8, color: '#aaa', fontSize: 13, lineHeight: 1.4 }}>
          Edit ON → click en la imagen → agrega punto.
          <br />
          Click derecho en un punto → borrar.
        </div>

        <div style={{ marginTop: 12, color: '#aaa', fontSize: 13 }}>
          Estructura activa:
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          {['aorta', 'vcI', 'porta'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveStructure(id)}
              style={{
                flex: 1,
                background: activeStructure === id ? '#16a34a' : '#333',
                color: 'white',
                border: 'none',
                padding: '8px 10px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              {structureLabel(id)}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 10, color: '#aaa', fontSize: 13 }}>
          Corte actual: <b>{slice + 1}</b> — Puntos: <b>{annotations.length}</b>
        </div>

        <button
          onClick={() => {
            const filename = `abdomen_ct_normal_v1_annotations_${String(new Date().toISOString()).slice(0, 10)}.json`
            downloadJson(annotationsBySlice, filename)
          }}
          style={{
            marginTop: 14,
            width: '100%',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Descargar anotaciones (JSON)
        </button>

        <button
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click()
          }}
          style={{
            marginTop: 10,
            width: '100%',
            background: '#f59e0b',
            color: 'black',
            border: 'none',
            padding: '10px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          Importar anotaciones (JSON)
        </button>

        {lastLoadedFile ? (
          <div style={{ marginTop: 8, color: '#aaa', fontSize: 12 }}>
            Cargado: <b>{lastLoadedFile}</b>
          </div>
        ) : null}

        <button
          onClick={() => {
            if (confirm('¿Borrar todas las anotaciones cargadas?')) {
              setAnnotationsBySlice({})
              setLastLoadedFile('')
            }
          }}
          style={{
            marginTop: 10,
            width: '100%',
            background: '#333',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Limpiar anotaciones
        </button>

        {/* INPUT OCULTO PARA IMPORT */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0]
            if (!file) return
            importAnnotationsFromFile(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
