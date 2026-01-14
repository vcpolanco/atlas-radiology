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
  keySlices?: number[]
  structures: { id: string; label: string }[]

  // OPTIONAL (read-only loads from /annotations.json)
  // OPCIONAL (solo lectura: se carga desde /annotations.json)
  annotationsBySlice?: SliceAnnotations
}
