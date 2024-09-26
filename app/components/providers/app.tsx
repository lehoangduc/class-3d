import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

import type { SHARED_ENVS } from '@/configs/envs'
import type { User } from '../types'

interface AppProviderProps {
  children: React.ReactNode
  values?: { envs?: typeof SHARED_ENVS; user?: User }
}

const AppContext = createContext<{
  envs: any
  user: User | undefined
  setEnvs: Dispatch<typeof SHARED_ENVS>
  setUser: Dispatch<SetStateAction<User | undefined>>
}>({
  envs: undefined,
  user: undefined,

  setUser: () => {},
  setEnvs: () => {},
})

const AppProvider = ({ children, values }: AppProviderProps) => {
  const [envs, setEnvs] = useState(values?.envs)
  const [user, setUser] = useState(values?.user)

  return (
    <AppContext.Provider value={{ envs, user, setEnvs, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export { AppProvider, useAppContext }
