import { ANATOMY_PROFILES } from "./profiles"
import { ANATOMY_PROFILE_MAP, type AnatomyProfileId } from "./registry"

export function getProfileById(profileId?: string) {
  if (!profileId) return null
  return ANATOMY_PROFILE_MAP[profileId as AnatomyProfileId] ?? null
}

export function getStructureFromProfile(profile: readonly any[] | null, structureId: string) {
  return profile?.find((s) => s?.id === structureId) ?? null
}

export function getStructureColor(profile: readonly any[] | null, structureId: string, fallback = "#22c55e") {
  const s = getStructureFromProfile(profile, structureId)
  const cat = s?.category
  return cat ? (ANATOMY_PROFILES as any)[cat]?.color ?? fallback : fallback
}

export function getStructureLabel(profile: readonly any[] | null, structureId: string, fallback?: string) {
  const s = getStructureFromProfile(profile, structureId)
  return s?.labelEs ?? s?.label ?? fallback ?? structureId
}


// crear el get cateogry color 
export function getCategoryColor(
  category: keyof typeof ANATOMY_PROFILES,
  fallback = "#999"
) {
  return ANATOMY_PROFILES[category]?.color ?? fallback
}
