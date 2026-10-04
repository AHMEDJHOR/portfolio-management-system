import { apiClient, unwrapList } from '../lib/api-client'
import type { Media } from '../types'

export const getMedia = (): Promise<Media[]> => unwrapList<Media>(apiClient.get('/media'))

export interface UploadInput {
  file: File
  altText: string
  provider: 'local' | 'cloudinary'
}

export async function uploadMedia({ file, altText, provider }: UploadInput): Promise<void> {
  const body = new FormData()
  if (altText.trim()) body.append('altText', altText.trim())
  body.append('file', file)
  await apiClient.post(provider === 'cloudinary' ? '/media/upload/cloudinary' : '/media/upload', body)
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete(`/media/${encodeURIComponent(id)}`)
}