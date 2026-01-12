import type { Study } from "./types"

export function pad(n: number, len: number) {
  return String(n).padStart(len, "0")
}

export function buildSliceUrl(study: Study, sliceIndex: number) {
  const n = sliceIndex + 1
  return `${study.basePath}/${study.sliceName.prefix}${pad(
    n,
    study.sliceName.pad
  )}.${study.slicesExt}`
}
