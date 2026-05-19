// lib/anatomy/profiles/abdomen_ct_core.ts

import { ABDOMEN_STRUCTURES } from "../structures/abdomen"

export const ABDOMEN_CT_CORE_PROFILE = {
  id: "abdomen_ct_core",

  label: "TC abdomen - anatomía básica",

  structures: [
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
  ],
} as const