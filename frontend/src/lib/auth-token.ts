import axios from 'axios'
import { isRecord } from './guards'

const REFRESH_KEY = 'portfolio.refreshToken'

let accessToken: string | null = null
let inFlight: Promise<string | null> | null = null

export const getAccessToken = (): string | null => accessToken

export function getRefreshToken(): string | null {
  try {
    return window.localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

export function setTokens(access: string, refresh?: string | null): void {
  accessToken = access
  if (!refresh) return
  try {
    window.localStorage.setItem(REFRESH_KEY, refresh)
  } catch {
    // Storage blocked: the session lasts until the page is reloaded.
  }
}

export function clearTokens(): void {
  accessToken = null
  try {
    window.localStorage.removeItem(REFRESH_KEY)
  } catch {
    // Nothing to clear.
  }
}

export interface TokenPair {
  accessToken: string | null
  refreshToken: string | null
}

/** Reads tokens from `{ accessToken, refreshToken }`, or the same nested under `data`. */
export function extractTokens(body: unknown): TokenPair {
  if (!isRecord(body)) return { accessToken: null, refreshToken: null }
  if (typeof body.accessToken === 'string') {
    return {
      accessToken: body.accessToken,
      refreshToken: typeof body.refreshToken === 'string' ? body.refreshToken : null,
    }
  }
  return extractTokens(body.data)
}

/**
 * Exchanges the stored refresh token for a new access token. Concurrent callers share one
 * request. Uses plain axios (not apiClient) so it can never trigger its own 401 handling.
 */
export function refreshAccessToken(): Promise<string | null> {
  inFlight ??= axios
    .post<unknown>(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      { refreshToken: getRefreshToken() },
      { withCredentials: true },
    )
    .then((response) => {
      const tokens = extractTokens(response.data)
      if (!tokens.accessToken) {
        clearTokens()
        return null
      }
      setTokens(tokens.accessToken, tokens.refreshToken)
      return tokens.accessToken
    })
    .catch(() => {
      clearTokens()
      return null
    })
    .finally(() => {
      inFlight = null
    })
  return inFlight
}