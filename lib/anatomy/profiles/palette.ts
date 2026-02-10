import type { AnatomyProfile } from "../types"

export const ANATOMY_PROFILES: Record<string, AnatomyProfile> = {
  airway: { id: "airway", label: "Vía aérea", color: "#77ece3" },
  artery: { id: "artery", label: "Arteria", color: "#e92727" },
  vein:   { id: "vein",   label: "Vena",     color: "#1b37d4" },
  organ:  { id: "organ",  label: "Órgano",   color: "#0f6113" },
}
