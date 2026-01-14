import type { Study } from "./types"

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



    // UI HELPERS
    // Ayudas de UI
    keySlices: [10, 12, 18, 25, 33, 45, 60],

    // STRUCTURES (labels to display)
    // Estructuras (etiquetas a mostrar)
    structures: [
      { id: "aorta", label: "Aorta" },
      { id: "trachea", label: "Tráquea" },
      { id: "esophagus", label: "Esófago" },
      { id: "svc", label: "Vena cava superior" },
      { id: "pulmonary_artery", label: "Arteria pulmonar" },
      { id: "azygos", label: "Vena ácigos" },
    ],
    annotationsBySlice: undefined
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

    keySlices: [8, 15, 22, 30, 38, 47, 58, 70, 85, 98],

    // Por ahora vacío, pero listo para completar
    structures: [],
    annotationsBySlice: undefined
  },
  // END SECTION :: [S.2] STUDY :: Abdomen CT Normal v1
  // Fin sección :: [S.2] Estudio TC Abdomen normal v1
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
