import { apiClient, unwrapList } from '../lib/api-client'

export type Item = { id: string } & Record<string, unknown>
export type Payload = Record<string, unknown>

export const listResource = (endpoint: string, paginated = false): Promise<Item[]> =>
  unwrapList<Item>(apiClient.get(endpoint, paginated ? { params: { page: 1, limit: 100 } } : undefined))

export async function createResource(endpoint: string, payload: Payload): Promise<void> {
  await apiClient.post(endpoint, payload)
}

export async function updateResource(endpoint: string, id: string, payload: Payload): Promise<void> {
  await apiClient.put(`${endpoint}/${encodeURIComponent(id)}`, payload)
}

export async function deleteResource(endpoint: string, id: string): Promise<void> {
  await apiClient.delete(`${endpoint}/${encodeURIComponent(id)}`)
}

export async function updateProfile(payload: Payload): Promise<void> {
  await apiClient.put('/profile', payload)
}