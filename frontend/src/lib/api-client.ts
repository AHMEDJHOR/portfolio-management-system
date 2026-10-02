import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    // Content-Type is intentionally not forced: Axios sets application/json
    // for object bodies and lets the browser set the multipart boundary for
    // FormData (needed for media uploads later).
  },
  // Assumes the auth architecture uses an httpOnly refresh cookie.
  withCredentials: true,
  timeout: 15_000,
})