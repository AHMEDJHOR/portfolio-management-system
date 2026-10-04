import { createContext } from 'react'
import type { LoginInput } from '../types'

export interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)