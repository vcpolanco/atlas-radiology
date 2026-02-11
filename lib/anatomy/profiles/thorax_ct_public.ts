import { THORAX_STRUCTURES } from "../structures/thorax"

// =====================================================
// [A.X] PROFILE :: thorax CT public (base completa)
// =====================================================
export const THORAX_CT_PUBLIC = [
  // AIRWAY
  THORAX_STRUCTURES.trachea,
  THORAX_STRUCTURES.carina,
  THORAX_STRUCTURES.bronchus_main_r,
  THORAX_STRUCTURES.bronchus_main_l,
  THORAX_STRUCTURES.bronchus_lobar_r_ul,
  THORAX_STRUCTURES.bronchus_intermedius,
  THORAX_STRUCTURES.bronchus_lobar_r_ml,
  THORAX_STRUCTURES.bronchus_lobar_r_ll,
  THORAX_STRUCTURES.bronchus_lobar_l_ul,
  THORAX_STRUCTURES.bronchus_lobar_l_ll,
  THORAX_STRUCTURES.esophagus,

  // ARTERIES
  THORAX_STRUCTURES.aorta_asc,
  THORAX_STRUCTURES.aortic_arch,
  THORAX_STRUCTURES.aorta_desc,
  THORAX_STRUCTURES.brachiocephalic_trunk,
  THORAX_STRUCTURES.carotid_l,
  THORAX_STRUCTURES.subclavian_l_art,
  THORAX_STRUCTURES.subclavian_r_art,
  THORAX_STRUCTURES.pulmonary_trunk,
  THORAX_STRUCTURES.pulmonary_artery_r,
  THORAX_STRUCTURES.pulmonary_artery_l,

  // VEINS
  THORAX_STRUCTURES.svc,
  THORAX_STRUCTURES.ivc,
  THORAX_STRUCTURES.azygos,
  THORAX_STRUCTURES.brachiocephalic_vein_r,
  THORAX_STRUCTURES.brachiocephalic_vein_l,

  // ORGANS / OTHERS
  THORAX_STRUCTURES.heart,
  THORAX_STRUCTURES.right_lung,
  THORAX_STRUCTURES.left_lung,
  THORAX_STRUCTURES.diaphragm_r,
  THORAX_STRUCTURES.diaphragm_l,
  THORAX_STRUCTURES.sternum,
  THORAX_STRUCTURES.vertebral_body,
  THORAX_STRUCTURES.spinal_canal,
  THORAX_STRUCTURES.liver,
  THORAX_STRUCTURES.spleen,
] as const
// END SECTION :: [A.X] PROFILE :: thorax CT public
