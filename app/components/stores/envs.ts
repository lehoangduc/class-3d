import { create } from 'zustand'

import type { SHARED_ENVS } from '@/configs/envs'

interface EnvsState {
  envs: typeof SHARED_ENVS | null
  setEnvs: (envs: typeof SHARED_ENVS | null) => void
}

const useEnvsStore = create<EnvsState>((set) => ({
  envs: null,
  setEnvs: (envs: typeof SHARED_ENVS | null) => set({ envs }),
}))

export default useEnvsStore
