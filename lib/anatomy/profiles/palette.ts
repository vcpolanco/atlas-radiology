import type { AnatomyProfile } from "../types"

/*
ANATOSLICE OFFICIAL COLOR PALETTE

airway  = #77ECE3   cyan
artery  = #E92727   red
vein    = #1B37D4   blue
organ   = #0F6113   green
*/

export const CATEGORY_COLORS = {
  airway: "#77ECE3",
  artery: "#E92727",
  vein: "#1B37D4",
  organ: "#0F6113",
} as const

export type AnatomyCategory = keyof typeof CATEGORY_COLORS


export const ANATOMY_PROFILES: Record<string, AnatomyProfile> = {
  airway: {
    id: "airway",
    label: "Vía aérea",
    color: CATEGORY_COLORS.airway,
  },

  artery: {
    id: "artery",
    label: "Arteria",
    color: CATEGORY_COLORS.artery,
  },

  vein: {
    id: "vein",
    label: "Vena",
    color: CATEGORY_COLORS.vein,
  },

  organ: {
    id: "organ",
    label: "Órgano",
    color: CATEGORY_COLORS.organ,
  },
}
export function getCategoryColor(category: AnatomyCategory) {
  return CATEGORY_COLORS[category]
}

export const CATEGORY_LABELS = {
  airway: "Vía aérea",
  artery: "Arteria",
  vein: "Vena",
  organ: "Órgano",
} as const