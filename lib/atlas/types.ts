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
