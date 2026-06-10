import type { Study } from "./types"

import { THORAX_CT_PUBLIC } from "@/lib/anatomy/profiles/thorax_ct_public"
import { ABDOMEN_CT_CORE_PROFILE } from "@/lib/anatomy/profiles/abdomen_ct_core"
import { BRAIN_MRI_CORE_PROFILE } from "@/lib/anatomy/profiles/brain_mri_core"

export const STUDIES: Study[] = [
  {
    id: "torax_ct_normal_v1",
    title: "TC Tórax normal (v1)",
    basePath: "/studies/torax_ct_normal_v1",
    slicesCount: 83,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 },
    keySlices: [14, 21, 27, 33, 39],
    structures: THORAX_CT_PUBLIC.map((s) => ({
      id: s.id,
      label: s.labelEs ?? s.label ?? s.id,
      side: s.side,
      category: s.category,
    })),
  },
  {
    id: "abdomen_ct_normal_v1",
    title: "TC Abdomen y pelvis normal (v1)",
    basePath: "/studies/abdomen_ct_normal_v1",
    slicesCount: 105,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 },
    structures: ABDOMEN_CT_CORE_PROFILE.structures.map((s) => ({
      id: s.id,
      label: s.labelEs ?? s.id,
      side: s.side,
      category: s.category,
    })),
  },
  {
    id: "brain_mri_normal_v1",
    title: "RM Cerebro normal - T2 axial (v1)",
    basePath: "/studies/brain_mri_normal_v1",
    slicesCount: 30,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 },
    structures: BRAIN_MRI_CORE_PROFILE.structures.map((s) => ({
      id: s.id,
      label: s.labelEs ?? s.id,
      side: s.side,
      category: s.category,
    })),
  },
]

export function getStudyById(id: string) {
  return STUDIES.find((s) => s.id === id)
}