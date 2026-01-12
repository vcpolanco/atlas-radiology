import type { Study } from "./types"

export const STUDIES: Study[] = [
  {
    id: "torax_ct_normal_v1",
    title: "TC Tórax Normal (v1)",
    basePath: "/studies/torax_ct_normal_v1",
    slicesCount: 83,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 },
    structures: [],
    annotationsBySlice: {},
  },
]

export function getStudyById(id: string) {
  return STUDIES.find((s) => s.id === id)
}
