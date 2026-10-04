import type { Media } from '../types'

const API_ORIGIN = new URL(import.meta.env.VITE_API_URL, window.location.origin).origin

/** Local uploads come back as "/uploads/x.png"; Cloudinary URLs are already absolute. */
export function mediaUrl(url: string): string {
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url
}

export function mediaLabel(item: Media): string {
  return item.altText || item.url.split('/').pop() || item.id
}