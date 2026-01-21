// =====================================================
// TYPES :: Annotations
// TIPOS :: Anotaciones
// =====================================================

export type Annotation = { structureId: string; x: number; y: number }
// Record<sliceIndex, Annotation[]>
// sliceIndex is 0-based (0 -> slice001.jpg)
// sliceIndex es 0-based (0 -> slice001.jpg)
export type SliceAnnotations = Record<number, Annotation[]>
// END SECTION :: TYPES :: Annotations
// Fin sección :: Tipos :: Anotaciones


// =====================================================
// TYPES :: KeySlice (named slice)
// TIPOS :: Corte clave (corte con nombre)
// Purpose (EN): allow "key slices" to have anatomy labels
// Propósito (ES): permitir que los cortes clave tengan nombre anatómico
// =====================================================
export type KeySlice = number | { idx: number; label?: string }
// END SECTION :: TYPES :: KeySlice
// Fin sección :: Tipos :: Corte clave


// =====================================================
// TYPES :: Side (L/R/M)
// TIPOS :: Lado (I/D/M)
// Purpose (EN): encode anatomical laterality for labels
// Propósito (ES): codificar lateralidad anatómica para etiquetas
// =====================================================
export type Side = "L" | "R" | "M" // Left / Right / Midline
// END SECTION :: TYPES :: Side
// Fin sección :: Tipos :: Lado


// =====================================================
// TYPES :: Structure (anatomy item)
// TIPOS :: Estructura (ítem anatómico)
// Purpose (EN): allow optional laterality metadata
// Propósito (ES): permitir metadatos opcionales de lateralidad
// =====================================================
export type Structure = {
  id: string
  label: string
  side?: Side // optional / opcional
}
// END SECTION :: TYPES :: Structure
// Fin sección :: Tipos :: Estructura


// =====================================================
// TYPES :: Study
// TIPOS :: Estudio
// =====================================================

export type Study = {
  id: string
  title: string
  basePath: string
  slicesCount: number
  slicesExt: string
  sliceName: { prefix?: string; pad: number }
  
  // KEY SLICES (named navigation points)
  // CORTES CLAVE (puntos de navegación con nombre)
  keySlices?: KeySlice[]

  structures: Structure[]

  // OPTIONAL (read-only loads from /annotations.json)
  // OPCIONAL (solo lectura: se carga desde /annotations.json)
  annotationsBySlice?: SliceAnnotations
}
// END SECTION :: TYPES :: Study
// Fin sección :: Tipos :: Estudio