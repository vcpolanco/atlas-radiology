import type { Study } from "./types"

import { THORAX_CT_PUBLIC } from '@/lib/anatomy/profiles/thorax_ct_public'
import { ABDOMEN_CT_CORE_PROFILE } from '@/lib/anatomy/profiles/abdomen_ct_core'

// =====================================================
// [S] STUDIES :: REGISTRY (Atlas studies list)
// Estudios :: Registro (lista de estudios)
// Where (EN): lib/atlas/studies.ts -> export const STUDIES
// Dónde (ES): lib/atlas/studies.ts -> export const STUDIES
// =====================================================
export const STUDIES: Study[] = [
  // =====================================================
  // [S.1] STUDY :: Thorax CT Normal v1
  // Estudio :: TC Tórax normal v1
  // Notes (EN): read-only annotations loaded from /annotations.json
  // Notas (ES): anotaciones solo lectura desde /annotations.json
  // =====================================================
  {
    id: "torax_ct_normal_v1",
    title: "TC Tórax normal (v1)",

    // PATHS / FILE NAMING
    // Rutas / Nombre de archivos
    basePath: "/studies/torax_ct_normal_v1",
    slicesCount: 83,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 }, // slice001.jpg ... slice083.jpg

    // KEY SLICES :: Thorax CT (named)
    // CORTES CLAVE :: TC Tórax (con nombre)
     
    keySlices: [14, 21, 27, 33, 39],

    // =====================================================
    // STRUCTURES :: Thorax (with side L/R/M)
    // ESTRUCTURAS :: Tórax (con lado I/D/M)
    // =====================================================
    structures: THORAX_CT_PUBLIC.map((s) => ({
      id: s.id,
      label: s.labelEs ?? s.label ?? s.id,
      side: s.side,
      category: s.category,
    })),

    // END SECTION :: STRUCTURES :: Thorax (with side)
    // Fin sección :: Estructuras :: Tórax (con lado)
  },
  // END SECTION :: [S.1] STUDY :: Thorax CT Normal v1
  // Fin sección :: [S.1] Estudio TC Tórax normal v1

  // =====================================================
  // [S.2] STUDY :: Abdomen CT Normal v1
  // Estudio :: TC Abdomen normal v1
  // =====================================================
  {
    id: "abdomen_ct_normal_v1",
    title: "TC Abdomen normal (v1)",

    basePath: "/studies/abdomen_ct_normal_v1",
    slicesCount: 105,
    slicesExt: "jpg",
    sliceName: { prefix: "slice", pad: 3 }, // slice001.jpg ... slice105.jpg

   // =====================================================
// STRUCTURES :: Abdomen (with side L/R/M)
// ESTRUCTURAS :: Abdomen (con lado I/D/M)
// =====================================================
structures: ABDOMEN_CT_CORE_PROFILE.structures.map((s) => ({
  id: s.id,
  label: s.labelEs ?? s.id,
  side: s.side,
  category: s.category,
})),
  
},
// END SECTION :: STRUCTURES :: Abdomen (with side)
// Fin sección :: Estructuras :: Abdomen (con lado)


]


// END SECTION :: [S] STUDIES :: REGISTRY
// Fin sección :: [S] Registro de estudios

// =====================================================
// fx: getStudyById
// function: find a study by id
// función: buscar un estudio por id
// =====================================================
export function getStudyById(id: string) {
  return STUDIES.find((s) => s.id === id)
}
// END SECTION :: fx: getStudyById
// Fin sección :: fx: getStudyById
