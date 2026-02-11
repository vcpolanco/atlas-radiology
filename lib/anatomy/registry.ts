import { THORAX_CT_CORE } from "./profiles/thorax_ct_core"
import { THORAX_CT_PUBLIC } from "./profiles/thorax_ct_public"

export const ANATOMY_PROFILE_MAP = {
  thorax_ct_core: THORAX_CT_CORE,
  thorax_ct_public: THORAX_CT_PUBLIC,
} as const

export type AnatomyProfileId = keyof typeof ANATOMY_PROFILE_MAP
