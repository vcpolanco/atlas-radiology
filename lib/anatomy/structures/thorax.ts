import type { AnatomyCategory, AnatomyStructure } from "../types"

// =====================================================
// [A.2] ANATOMY :: thorax structures (canonical)
// =====================================================
// Notes:
// - IDs cortos y estables
// - category usa AnatomyCategory (airway/artery/vein/organ)
// - labelEs es el texto principal para UI en español
// =====================================================

export type ThoraxStructure = AnatomyStructure & {
  labelEs: string
  side?: "L" | "R" | "M"
}

export const THORAX_STRUCTURES: Record<string, ThoraxStructure> = {
  // =====================================================
  // AIRWAY
  // =====================================================

  trachea: {
    id: "trachea",
    label: "Trachea",
    labelEs: "Tráquea",
    category: "airway",
    side: "M",
  },

  carina: {
    id: "carina",
    label: "Carina",
    labelEs: "Carina",
    category: "airway",
    side: "M",
  },

  bronchus_main_r: {
    id: "bronchus_main_r",
    label: "Right main bronchus",
    labelEs: "Bronquio principal derecho",
    category: "airway",
    side: "R",
  },

  bronchus_main_l: {
    id: "bronchus_main_l",
    label: "Left main bronchus",
    labelEs: "Bronquio principal izquierdo",
    category: "airway",
    side: "L",
  },

  bronchus_intermedius: {
    id: "bronchus_intermedius",
    label: "Bronchus intermedius",
    labelEs: "Bronquio intermedio",
    category: "airway",
    side: "R",
  },

  bronchus_lobar_r_ul: {
    id: "bronchus_lobar_r_ul",
    label: "Right upper lobe bronchus",
    labelEs: "Bronquio lobar superior derecho",
    category: "airway",
    side: "R",
  },

  bronchus_lobar_r_ml: {
    id: "bronchus_lobar_r_ml",
    label: "Right middle lobe bronchus",
    labelEs: "Bronquio lobar medio",
    category: "airway",
    side: "R",
  },

  bronchus_lobar_r_ll: {
    id: "bronchus_lobar_r_ll",
    label: "Right lower lobe bronchus",
    labelEs: "Bronquio lobar inferior derecho",
    category: "airway",
    side: "R",
  },

  bronchus_lobar_l_ul: {
    id: "bronchus_lobar_l_ul",
    label: "Left upper lobe bronchus",
    labelEs: "Bronquio lobar superior izquierdo",
    category: "airway",
    side: "L",
  },

  bronchus_lobar_l_ll: {
    id: "bronchus_lobar_l_ll",
    label: "Left lower lobe bronchus",
    labelEs: "Bronquio lobar inferior izquierdo",
    category: "airway",
    side: "L",
  },

  esophagus: {
    id: "esophagus",
    label: "Esophagus",
    labelEs: "Esófago",
    category: "organ",
    side: "M",
  },

  // =====================================================
  // ARTERIES
  // =====================================================

  aorta_asc: {
    id: "aorta_asc",
    label: "Ascending aorta",
    labelEs: "Aorta ascendente",
    category: "artery",
    side: "M",
  },

  aortic_arch: {
    id: "aortic_arch",
    label: "Aortic arch",
    labelEs: "Cayado aórtico",
    category: "artery",
    side: "M",
  },

  aorta_desc: {
    id: "aorta_desc",
    label: "Descending aorta",
    labelEs: "Aorta descendente",
    category: "artery",
    side: "M",
  },

  brachiocephalic_trunk: {
    id: "brachiocephalic_trunk",
    label: "Brachiocephalic trunk",
    labelEs: "Tronco braquiocefálico",
    category: "artery",
    side: "M",
  },

  carotid_l: {
    id: "carotid_l",
    label: "Left common carotid artery",
    labelEs: "Carótida común izquierda",
    category: "artery",
    side: "L",
  },

  subclavian_l_art: {
    id: "subclavian_l_art",
    label: "Left subclavian artery",
    labelEs: "Arteria subclavia izquierda",
    category: "artery",
    side: "L",
  },

  subclavian_r_art: {
    id: "subclavian_r_art",
    label: "Right subclavian artery",
    labelEs: "Arteria subclavia derecha",
    category: "artery",
    side: "R",
  },

  pulmonary_trunk: {
    id: "pulmonary_trunk",
    label: "Pulmonary trunk",
    labelEs: "Tronco pulmonar",
    category: "artery",
    side: "M",
  },

  pulmonary_artery_r: {
    id: "pulmonary_artery_r",
    label: "Right pulmonary artery",
    labelEs: "Arteria pulmonar derecha",
    category: "artery",
    side: "R",
  },

  pulmonary_artery_l: {
    id: "pulmonary_artery_l",
    label: "Left pulmonary artery",
    labelEs: "Arteria pulmonar izquierda",
    category: "artery",
    side: "L",
  },

  // =====================================================
  // VEINS
  // =====================================================

  svc: {
    id: "svc",
    label: "Superior vena cava",
    labelEs: "Vena cava superior",
    category: "vein",
    side: "M",
  },

  ivc: {
    id: "ivc",
    label: "Inferior vena cava",
    labelEs: "Vena cava inferior",
    category: "vein",
    side: "M",
  },

  azygos: {
    id: "azygos",
    label: "Azygos vein",
    labelEs: "Vena ácigos",
    category: "vein",
    side: "R",
  },

  brachiocephalic_vein_r: {
    id: "brachiocephalic_vein_r",
    label: "Right brachiocephalic vein",
    labelEs: "Vena braquiocefálica derecha",
    category: "vein",
    side: "R",
  },

  brachiocephalic_vein_l: {
    id: "brachiocephalic_vein_l",
    label: "Left brachiocephalic vein",
    labelEs: "Vena braquiocefálica izquierda",
    category: "vein",
    side: "L",
  },

  pulmonary_vein_r_sup: {
  id: "pulmonary_vein_r_sup",
  label: "Right superior pulmonary vein",
  labelEs: "Vena pulmonar superior derecha",
  category: "vein",
  side: "R",
},

pulmonary_vein_r_inf: {
  id: "pulmonary_vein_r_inf",
  label: "Right inferior pulmonary vein",
  labelEs: "Vena pulmonar inferior derecha",
  category: "vein",
  side: "R",
},

pulmonary_vein_l_sup: {
  id: "pulmonary_vein_l_sup",
  label: "Left superior pulmonary vein",
  labelEs: "Vena pulmonar superior izquierda",
  category: "vein",
  side: "L",
},

pulmonary_vein_l_inf: {
  id: "pulmonary_vein_l_inf",
  label: "Left inferior pulmonary vein",
  labelEs: "Vena pulmonar inferior izquierda",
  category: "vein",
  side: "L",
},

  // =====================================================
  // ORGANS / OTHERS
  // =====================================================

  heart: {
    id: "heart",
    label: "Heart",
    labelEs: "Corazón",
    category: "organ",
    side: "M",
  },

  right_lung: {
    id: "right_lung",
    label: "Right lung",
    labelEs: "Pulmón derecho",
    category: "organ",
    side: "R",
  },

  left_lung: {
    id: "left_lung",
    label: "Left lung",
    labelEs: "Pulmón izquierdo",
    category: "organ",
    side: "L",
  },

  diaphragm_r: {
    id: "diaphragm_r",
    label: "Right hemidiaphragm",
    labelEs: "Hemidiafragma derecho",
    category: "organ",
    side: "R",
  },

  diaphragm_l: {
    id: "diaphragm_l",
    label: "Left hemidiaphragm",
    labelEs: "Hemidiafragma izquierdo",
    category: "organ",
    side: "L",
  },

  sternum: {
    id: "sternum",
    label: "Sternum",
    labelEs: "Esternón",
    category: "organ",
    side: "M",
  },

  vertebral_body: {
    id: "vertebral_body",
    label: "Thoracic vertebral body",
    labelEs: "Cuerpo vertebral torácico",
    category: "organ",
    side: "M",
  },

  spinal_canal: {
    id: "spinal_canal",
    label: "Spinal canal",
    labelEs: "Canal raquídeo",
    category: "organ",
    side: "M",
  },

  liver: {
    id: "liver",
    label: "Liver",
    labelEs: "Hígado",
    category: "organ",
    side: "R",
  },

  spleen: {
    id: "spleen",
    label: "Spleen",
    labelEs: "Bazo",
    category: "organ",
    side: "L",
  },

  right_atrium: {
  id: "right_atrium",
  label: "Right atrium",
  labelEs: "Aurícula derecha",
  category: "organ",
  side: "R",
},

left_atrium: {
  id: "left_atrium",
  label: "Left atrium",
  labelEs: "Aurícula izquierda",
  category: "organ",
  side: "L",
},

right_ventricle: {
  id: "right_ventricle",
  label: "Right ventricle",
  labelEs: "Ventrículo derecho",
  category: "organ",
  side: "R",
},

left_ventricle: {
  id: "left_ventricle",
  label: "Left ventricle",
  labelEs: "Ventrículo izquierdo",
  category: "organ",
  side: "L",
},

} as const

// END SECTION :: [A.2] ANATOMY :: thorax structures
