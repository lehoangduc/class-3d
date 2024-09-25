import { create } from 'zustand'

import type { User } from '../types'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

const useAuthStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}))

export default useAuthStore
