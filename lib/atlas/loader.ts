import type { Study } from "./types"

export function pad(n: number, len: number) {
  return String(n).padStart(len, "0")
}

export function buildSliceUrl(study: Study, sliceIndex: number) {
  const n = sliceIndex + 1

  const prefix = study.sliceName.prefix ?? ""
  const name = prefix ? `${prefix}${pad(n, study.sliceName.pad)}` : `${pad(n, study.sliceName.pad)}`

  return `${study.basePath}/${name}.${study.slicesExt}`
}
