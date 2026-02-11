import type { Structure } from "@/lib/atlas/types"

// Nota: `category` debe matchear tu union AnatomyCategory.
// Asumo: "airway" | "artery" | "vein" | "organ" (como tus ANATOMY_PROFILES)

export const THORAX_CT_NORMAL_V1_PUBLIC_STRUCTURES: Structure[] = [
  // =========================
  // AIRWAY :: Vía aérea
  // =========================
  { id: "airway.trachea", label: "Tráquea", category: "airway" },
  { id: "airway.carina", label: "Carina", category: "airway" },
  { id: "airway.r_main_bronchus", label: "Bronquio principal derecho", category: "airway", side: "R" },
  { id: "airway.l_main_bronchus", label: "Bronquio principal izquierdo", category: "airway", side: "L" },
  { id: "airway.r_upper_lobar_bronchus", label: "Bronquio lobar superior derecho", category: "airway", side: "R" },
  { id: "airway.r_intermediate_bronchus", label: "Bronquio intermedio", category: "airway", side: "R" },
  { id: "airway.r_middle_lobar_bronchus", label: "Bronquio lobar medio", category: "airway", side: "R" },
  { id: "airway.r_lower_lobar_bronchus", label: "Bronquio lobar inferior derecho", category: "airway", side: "R" },
  { id: "airway.l_upper_lobar_bronchus", label: "Bronquio lobar superior izquierdo", category: "airway", side: "L" },
  { id: "airway.l_lower_lobar_bronchus", label: "Bronquio lobar inferior izquierdo", category: "airway", side: "L" },
  { id: "airway.esophagus", label: "Esófago", category: "airway", side: "M" },

  // =========================
  // ARTERY :: Arterias
  // =========================
  { id: "artery.aorta_ascending", label: "Aorta ascendente", category: "artery", side: "M" },
  { id: "artery.aortic_arch", label: "Cayado aórtico", category: "artery", side: "M" },
  { id: "artery.aorta_descending", label: "Aorta descendente", category: "artery", side: "M" },
  { id: "artery.brachiocephalic_trunk", label: "Tronco braquiocefálico", category: "artery", side: "M" },
  { id: "artery.l_common_carotid", label: "Carótida común izquierda", category: "artery", side: "L" },
  { id: "artery.l_subclavian", label: "Arteria subclavia izquierda", category: "artery", side: "L" },
  { id: "artery.r_subclavian", label: "Arteria subclavia derecha", category: "artery", side: "R" },
  { id: "artery.pulmonary_trunk", label: "Tronco pulmonar", category: "artery", side: "M" },
  { id: "artery.r_pulmonary_artery", label: "Arteria pulmonar derecha", category: "artery", side: "R" },
  { id: "artery.l_pulmonary_artery", label: "Arteria pulmonar izquierda", category: "artery", side: "L" },
  { id: "artery.r_interlobar_pa", label: "Arteria pulmonar interlobar derecha", category: "artery", side: "R" },
  { id: "artery.l_interlobar_pa", label: "Arteria pulmonar interlobar izquierda", category: "artery", side: "L" },

  // =========================
  // VEIN :: Venas
  // =========================
  { id: "vein.svc", label: "Vena cava superior", category: "vein", side: "M" },
  { id: "vein.ivc", label: "Vena cava inferior", category: "vein", side: "M" },
  { id: "vein.azygos", label: "Vena ácigos", category: "vein", side: "R" },
  { id: "vein.r_brachiocephalic", label: "Vena braquiocefálica derecha", category: "vein", side: "R" },
  { id: "vein.l_brachiocephalic", label: "Vena braquiocefálica izquierda", category: "vein", side: "L" },
  { id: "vein.r_subclavian", label: "Vena subclavia derecha", category: "vein", side: "R" },
  { id: "vein.l_subclavian", label: "Vena subclavia izquierda", category: "vein", side: "L" },
  { id: "vein.r_internal_jugular", label: "Vena yugular interna derecha", category: "vein", side: "R" },
  { id: "vein.l_internal_jugular", label: "Vena yugular interna izquierda", category: "vein", side: "L" },
  { id: "vein.r_superior_pulmonary_vein", label: "Vena pulmonar superior derecha", category: "vein", side: "R" },
  { id: "vein.r_inferior_pulmonary_vein", label: "Vena pulmonar inferior derecha", category: "vein", side: "R" },
  { id: "vein.l_superior_pulmonary_vein", label: "Vena pulmonar superior izquierda", category: "vein", side: "L" },
  { id: "vein.l_inferior_pulmonary_vein", label: "Vena pulmonar inferior izquierda", category: "vein", side: "L" },

  // =========================
  // ORGAN :: Órganos / otros
  // =========================
  { id: "organ.right_lung", label: "Pulmón derecho", category: "organ", side: "R" },
  { id: "organ.left_lung", label: "Pulmón izquierdo", category: "organ", side: "L" },
  { id: "organ.right_hemidiaphragm", label: "Hemidiafragma derecho", category: "organ", side: "R" },
  { id: "organ.left_hemidiaphragm", label: "Hemidiafragma izquierdo", category: "organ", side: "L" },

  { id: "organ.heart", label: "Corazón", category: "organ", side: "M" },
  { id: "organ.ra", label: "Aurícula derecha", category: "organ", side: "R" },
  { id: "organ.rv", label: "Ventrículo derecho", category: "organ", side: "R" },
  { id: "organ.la", label: "Aurícula izquierda", category: "organ", side: "L" },
  { id: "organ.lv", label: "Ventrículo izquierdo", category: "organ", side: "L" },
  { id: "organ.pericardium", label: "Pericardio", category: "organ", side: "M" },

  { id: "organ.anterior_mediastinum_fat", label: "Grasa mediastínica anterior", category: "organ", side: "M" },
  { id: "organ.hilar_region_right", label: "Hilio derecho", category: "organ", side: "R" },
  { id: "organ.hilar_region_left", label: "Hilio izquierdo", category: "organ", side: "L" },

  { id: "organ.sternum", label: "Esternón", category: "organ", side: "M" },
  { id: "organ.vertebral_body", label: "Cuerpo vertebral torácico", category: "organ", side: "M" },
  { id: "organ.spinal_canal", label: "Canal raquídeo", category: "organ", side: "M" },
  { id: "organ.rib", label: "Costilla", category: "organ" },
  { id: "organ.scapula", label: "Escápula", category: "organ" },
  { id: "organ.paraspinal_muscles", label: "Músculos paravertebrales", category: "organ", side: "M" },

  { id: "organ.liver", label: "Hígado", category: "organ", side: "R" },
  { id: "organ.spleen", label: "Bazo", category: "organ", side: "L" },
]
