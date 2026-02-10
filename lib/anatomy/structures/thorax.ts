import type { AnatomyCategory } from "../types"

// =====================================================
// [A.2] ANATOMY :: thorax structures (canonical)
// =====================================================
export type AnatomySide = 'L' | 'R' | 'M'

export type ThoraxStructure = {
  id: string
  label: string
  labelEs?: string
  side?: "L" | "R" | "M"
  category: AnatomyCategory
}

export const THORAX_STRUCTURES: Record<string, ThoraxStructure> = {
  aorta: {
    id: "aorta",
    label: "Aorta",
    labelEs: "Aorta",
    category: "artery",
  },

  trachea: {
    id: "trachea",
    label: "Trachea",
    labelEs: "Tráquea",
    category: "airway",
  },

  esophagus: {
    id: "esophagus",
    label: "Esophagus",
    labelEs: "Esófago",
    category: "organ",
  },

  svc: {
    id: "svc",
    label: "Superior vena cava",
    labelEs: "Vena cava superior",
    category: "vein",
  },

  pulmonary_artery: {
    id: "pulmonary_artery",
    label: "Pulmonary artery",
    labelEs: "Arteria pulmonar",
    category: "artery",
  },

  azygos: {
    id: "azygos",
    label: "Azygos vein",
    labelEs: "Vena ácigos",
    category: "vein",
  },
}
// END SECTION :: [A.2] ANATOMY :: thorax structures
