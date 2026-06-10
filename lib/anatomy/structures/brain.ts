type Side = "L" | "R" | "M"
type Category = "organ" | "artery" | "vein"

export type BrainStructure = {
  id: string
  labelEs: string
  side: Side
  category: Category
}

export const BRAIN_STRUCTURES: BrainStructure[] = [
  { id: "frontal_lobe", labelEs: "Lóbulo frontal", side: "M", category: "organ" },
  { id: "temporal_lobe", labelEs: "Lóbulo temporal", side: "M", category: "organ" },
  { id: "parietal_lobe", labelEs: "Lóbulo parietal", side: "M", category: "organ" },
  { id: "occipital_lobe", labelEs: "Lóbulo occipital", side: "M", category: "organ" },
  { id: "cerebellum", labelEs: "Cerebelo", side: "M", category: "organ" },
  { id: "brainstem", labelEs: "Tronco encefálico", side: "M", category: "organ" },
  { id: "lateral_ventricle", labelEs: "Ventrículo lateral", side: "M", category: "organ" },
  { id: "third_ventricle", labelEs: "Tercer ventrículo", side: "M", category: "organ" },
  { id: "fourth_ventricle", labelEs: "Cuarto ventrículo", side: "M", category: "organ" },
  { id: "corpus_callosum", labelEs: "Cuerpo calloso", side: "M", category: "organ" },
  { id: "basal_ganglia", labelEs: "Ganglios basales", side: "M", category: "organ" },
  { id: "thalamus", labelEs: "Tálamo", side: "M", category: "organ" },
]