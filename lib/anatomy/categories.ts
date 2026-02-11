// =====================================================
// [A.1] ANATOMY :: categories
// =====================================================
import type { AnatomyCategory } from "./types"

export const ANATOMY_CATEGORIES: Record<
  AnatomyCategory,
  { labelEs: string; color: string }
> = {
  airway: { labelEs: 'Vía aérea', color: '#77ece3' },
  artery: { labelEs: 'Arterias', color: '#e92727' },
  vein: { labelEs: 'Venas', color: '#1b37d4' },
  organ: { labelEs: 'Otros', color: '#0f6113' },

  // si existen en tu union, ponelos con fallback neutro
  bone: { labelEs: 'Hueso', color: '#999999' },
  muscle: { labelEs: 'Músculo', color: '#999999' },
  nerve: { labelEs: 'Nervio', color: '#999999' },
} as const

// END SECTION :: [A.1] ANATOMY :: categories
