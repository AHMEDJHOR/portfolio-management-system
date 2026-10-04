import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return 'Cannot reach the server. Please try again.'
    if (error.response.status === 404) return 'We could not find that.'
    return error.response.data?.message ?? `Request failed (${error.response.status}).`
  }
  return error instanceof Error ? error.message : 'Something went wrong.'
}