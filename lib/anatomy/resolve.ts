import { ANATOMY_PROFILES } from "./profiles"
import { ANATOMY_PROFILE_MAP, type AnatomyProfileId } from "./registry"

export function getProfileById(profileId?: string) {
  if (!profileId) return null
  return ANATOMY_PROFILE_MAP[profileId as AnatomyProfileId] ?? null
}

export function getStructureFromProfile(profile: readonly any[] | null, structureId: string) {
  return profile?.find((s) => s?.id === structureId) ?? null
}

export function getStructureColor(
  profile: readonly any[] | null,
  structureId: string,
  fallback = "#999"
) {
  const s = getStructureFromProfile(profile, structureId)
  const raw = String(s?.category ?? "").trim().toLowerCase()

  // normalización (por si te llega "Vascular", "arteria", etc.)
  const cat =
    raw === "airway" || raw === "via aerea" || raw === "vía aérea" || raw === "vía aerea"
      ? "airway"
      : raw === "artery" || raw === "arteria"
      ? "artery"
      : raw === "vein" || raw === "vena"
      ? "vein"
      : raw === "organ" || raw === "organo" || raw === "órgano"
      ? "organ"
      : null

  return cat ? (ANATOMY_PROFILES as any)[cat]?.color ?? fallback : fallback
}

export function getStructureLabel(profile: readonly any[] | null, structureId: string, fallback?: string) {
  const s = getStructureFromProfile(profile, structureId)
  return s?.labelEs ?? s?.label ?? fallback ?? structureId
}


// crear el get cateogry color 
export function getCategoryColor(category: string, fallback = "#999") {
  const raw = String(category ?? "").trim().toLowerCase()

  const cat =
    raw === "airway" || raw === "via aerea" || raw === "vía aérea" || raw === "vía aerea"
      ? "airway"
      : raw === "artery" || raw === "arteria"
      ? "artery"
      : raw === "vein" || raw === "vena"
      ? "vein"
      : raw === "organ" || raw === "organo" || raw === "órgano"
      ? "organ"
      : null

  return cat ? (ANATOMY_PROFILES as any)[cat]?.color ?? fallback : fallback
}