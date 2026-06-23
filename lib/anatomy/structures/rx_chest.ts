import type { Side } from "@/lib/atlas/types"
import type { AnatomyCategory } from "@/lib/anatomy/types"

export type RxChestStructure = {
  id: string
  labelEs: string
  side: Side
  category: AnatomyCategory
}

export const RX_CHEST_STRUCTURES: RxChestStructure[] = [
  { id: "trachea", labelEs: "Tráquea", side: "M", category: "airway" },
  { id: "carina", labelEs: "Carina", side: "M", category: "airway" },

  { id: "right_main_bronchus", labelEs: "Bronquio principal derecho", side: "R", category: "airway" },
  { id: "left_main_bronchus", labelEs: "Bronquio principal izquierdo", side: "L", category: "airway" },

  { id: "aortic_knob", labelEs: "Botón aórtico", side: "M", category: "artery" },

  { id: "right_hilum", labelEs: "Hilio derecho", side: "R", category: "artery" },
  { id: "left_hilum", labelEs: "Hilio izquierdo", side: "L", category: "artery" },

  { id: "right_heart_border", labelEs: "Borde cardíaco derecho", side: "R", category: "organ" },
  { id: "left_heart_border", labelEs: "Borde cardíaco izquierdo", side: "L", category: "organ" },

  { id: "right_hemidiaphragm", labelEs: "Hemidiafragma derecho", side: "R", category: "muscle" },
  { id: "left_hemidiaphragm", labelEs: "Hemidiafragma izquierdo", side: "L", category: "muscle" },

  { id: "right_costophrenic_angle", labelEs: "Seno costofrénico derecho", side: "R", category: "organ" },
  { id: "left_costophrenic_angle", labelEs: "Seno costofrénico izquierdo", side: "L", category: "organ" },

  { id: "right_apex", labelEs: "Ápice pulmonar derecho", side: "R", category: "organ" },
  { id: "left_apex", labelEs: "Ápice pulmonar izquierdo", side: "L", category: "organ" },

  { id: "minor_fissure", labelEs: "Cisura menor", side: "R", category: "organ" },

  { id: "right_clavicle", labelEs: "Clavícula derecha", side: "R", category: "bone" },
  { id: "left_clavicle", labelEs: "Clavícula izquierda", side: "L", category: "bone" },
]