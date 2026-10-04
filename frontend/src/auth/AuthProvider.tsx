import { useCallback, useMemo, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import {
  clearTokens,
  extractTokens,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  setTokens,
} from '../lib/auth-token'
import type { LoginInput } from '../types'
import { AuthContext, type AuthContextValue } from './auth-context'

const SESSION_KEY = ['auth', 'session'] as const

// The API has no "who am I" endpoint, so a session is simply "we hold, or can obtain, a token".
async function restoreSession(): Promise<boolean> {
  if (getAccessToken()) return true
  if (!getRefreshToken()) return false
  return (await refreshAccessToken()) !== null
}

/** Mounted only around /admin routes, so public visitors never trigger an auth request. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: restoreSession,
    retry: false,
    staleTime: Infinity,
  })

  const login = useCallback(
    async (credentials: LoginInput) => {
      const { data: body } = await apiClient.post<unknown>('/auth/login', credentials)
      const tokens = extractTokens(body)
      if (!tokens.accessToken) throw new Error('Login succeeded but no access token was returned.')
      setTokens(tokens.accessToken, tokens.refreshToken)
      queryClient.setQueryData(SESSION_KEY, true)
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout', { refreshToken: getRefreshToken() })
    } catch {
      // The local session is cleared either way.
    }
    clearTokens()
    queryClient.setQueryData(SESSION_KEY, false)
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: data === true, isLoading: isPending, login, logout }),
    [data, isPending, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}