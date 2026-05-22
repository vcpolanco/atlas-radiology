type Side = "L" | "R" | "M"
type Category = "organ" | "artery" | "vein"

type AbdomenStructure = {
  id: string
  labelEs: string
  side: Side
  category: Category
}

const ABDOMEN_STRUCTURES: AbdomenStructure[] = [
  { id: "liver", labelEs: "Hígado", side: "R", category: "organ" },
  { id: "spleen", labelEs: "Bazo", side: "L", category: "organ" },
  { id: "stomach", labelEs: "Estómago", side: "L", category: "organ" },
  { id: "pancreas", labelEs: "Páncreas", side: "M", category: "organ" },
  { id: "gallbladder", labelEs: "Vesícula biliar", side: "R", category: "organ" },
  { id: "kidney_r", labelEs: "Riñón derecho", side: "R", category: "organ" },
  { id: "kidney_l", labelEs: "Riñón izquierdo", side: "L", category: "organ" },
  { id: "aorta", labelEs: "Aorta abdominal", side: "M", category: "artery" },
  { id: "ivc", labelEs: "VCI", side: "M", category: "vein" },
  { id: "portal_vein", labelEs: "Vena porta", side: "M", category: "vein" },
  { id: "bladder", labelEs: "Vejiga", side: "M", category: "organ" },
  // =====================================================
// VASCULAR
// =====================================================

{ id: "smv", labelEs: "Vena mesentérica superior", side: "M", category: "vein" },

{ id: "common_iliac_r", labelEs: "Ilíaca común derecha", side: "R", category: "artery" },

{ id: "common_iliac_l", labelEs: "Ilíaca común izquierda", side: "L", category: "artery" },

{ id: "external_iliac_r", labelEs: "Ilíaca externa derecha", side: "R", category: "artery" },

{ id: "external_iliac_l", labelEs: "Ilíaca externa izquierda", side: "L", category: "artery" },

// =====================================================
// MUSCULOSKELETAL
// =====================================================

{ id: "psoas_r", labelEs: "Psoas derecho", side: "R", category: "organ" },

{ id: "psoas_l", labelEs: "Psoas izquierdo", side: "L", category: "organ" },

{ id: "vertebral_body", labelEs: "Cuerpo vertebral", side: "M", category: "organ" },

{ id: "spinal_canal", labelEs: "Canal raquídeo", side: "M", category: "organ" },

// =====================================================
// DIGESTIVE
// =====================================================

{ id: "ascending_colon", labelEs: "Colon ascendente", side: "R", category: "organ" },

{ id: "transverse_colon", labelEs: "Colon transverso", side: "M", category: "organ" },

{ id: "descending_colon", labelEs: "Colon descendente", side: "L", category: "organ" },

{ id: "sigmoid_colon", labelEs: "Colon sigmoides", side: "L", category: "organ" },

{ id: "rectum", labelEs: "Recto", side: "M", category: "organ" },

]

export const ABDOMEN_CT_CORE_PROFILE = {
  id: "abdomen_ct_core",
  label: "TC abdomen - anatomía básica",
  structures: ABDOMEN_STRUCTURES,
} as const