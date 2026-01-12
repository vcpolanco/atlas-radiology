export type Structure = { id: string; label: string }

export type Annotation = { structureId: string; x: number; y: number }
export type SliceAnnotations = Record<number, Annotation[]>

export type Study = {
  id: string
  title: string
  basePath: string
  slicesCount: number
  slicesExt: "jpg" | "png" | "webp"
  sliceName: { prefix: string; pad: number }
  structures: Structure[]
  annotationsBySlice: SliceAnnotations
  keySlices?: number[]
}
