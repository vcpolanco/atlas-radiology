export type AnatomyCategory =
  | 'airway'
  | 'artery'
  | 'vein'
  | 'organ'
  | 'bone'
  | 'muscle'
  | 'nerve'

export interface AnatomyProfile {
  id: AnatomyCategory
  label: string
  color: string
}

export interface AnatomyStructure {
  id: string          // corto y estable: svc, azygos, trachea
  label: string       // nombre visible
  category: AnatomyCategory
  aliases?: string[]  // opcional (búsqueda futura)
}
