import { THORAX_CT_CORE } from "./profiles/thorax_ct_core"

export const ANATOMY_PROFILE_REGISTRY = {
  thorax_ct_core: THORAX_CT_CORE,
} as const

export type AnatomyProfileId = keyof typeof ANATOMY_PROFILE_REGISTRY
