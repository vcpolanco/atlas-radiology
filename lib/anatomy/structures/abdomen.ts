// lib/anatomy/structures/abdomen.ts

export const ABDOMEN_STRUCTURES = [
  { id: "liver", labelEs: "Hígado", side: "M", category: "organ" },
  { id: "spleen", labelEs: "Bazo", side: "M", category: "organ" },
  { id: "pancreas", labelEs: "Páncreas", side: "M", category: "organ" },
  { id: "gallbladder", labelEs: "Vesícula biliar", side: "M", category: "organ" },

  { id: "right_kidney", labelEs: "Riñón derecho", side: "R", category: "organ" },
  { id: "left_kidney", labelEs: "Riñón izquierdo", side: "L", category: "organ" },

  { id: "aorta", labelEs: "Aorta abdominal", side: "M", category: "artery" },
  { id: "ivc", labelEs: "Vena cava inferior", side: "M", category: "vein" },
  { id: "portal_vein", labelEs: "Vena porta", side: "M", category: "vein" },

  { id: "stomach", labelEs: "Estómago", side: "M", category: "organ" },
  { id: "duodenum", labelEs: "Duodeno", side: "M", category: "organ" },
  { id: "colon", labelEs: "Colon", side: "M", category: "organ" },
] as const