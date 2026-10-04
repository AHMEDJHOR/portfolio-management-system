import axios, { type AxiosResponse } from 'axios'
import { getAccessToken, refreshAccessToken } from './auth-token'
import { isRecord } from './guards'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
  withCredentials: true,
  timeout: 15_000,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

// On 401: refresh once, then replay the request. The replay goes through plain axios,
// so it can't re-enter this handler. Auth endpoints (bad password etc.) are never retried.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error
    const { config, response } = error
    if (response?.status !== 401 || !config || config.url?.startsWith('/auth/')) throw error

    const token = await refreshAccessToken()
    if (!token) throw error

    config.headers.set('Authorization', `Bearer ${token}`)
    return axios(config)
  },
)

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

/** `{ success, message, data }` → `data`. */
export async function unwrap<T>(request: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  return (await request).data.data
}

function findArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (isRecord(value)) {
    for (const entry of Object.values(value)) {
      if (Array.isArray(entry)) return entry
    }
  }
  return []
}

/** Accepts `data: [...]` or a paginated `data: { items: [...], meta }`. */
export async function unwrapList<T>(request: Promise<AxiosResponse<unknown>>): Promise<T[]> {
  const body = (await request).data
  // API boundary: element types are trusted, not validated at runtime.
  return findArray(isRecord(body) && 'data' in body ? body.data : body) as T[]
}