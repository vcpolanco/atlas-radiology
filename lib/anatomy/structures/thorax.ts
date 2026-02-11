import type { AnatomyCategory, AnatomyStructure } from "../types"

// =====================================================
// [A.2] ANATOMY :: thorax structures (canonical)
// =====================================================
// Notes:
// - IDs cortos y estables (svc, azygos, trachea, etc.)
// - category usa AnatomyCategory (airway/artery/vein/organ/...)
// - labelEs es el texto principal para UI en español
// =====================================================

export type ThoraxStructure = AnatomyStructure & {
  labelEs: string
  side?: "L" | "R" | "M"
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
} as const

// END SECTION :: [A.2] ANATOMY :: thorax structures
