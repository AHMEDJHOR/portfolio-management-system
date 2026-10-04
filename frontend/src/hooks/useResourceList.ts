import { useQuery } from '@tanstack/react-query'
import { listResource } from '../services/admin'

export function useResourceList(config: { key: string; endpoint: string; paginated?: boolean }) {
  return useQuery({
    // Admin keys are prefixed so they never share cache entries with the public pages.
    queryKey: ['admin', config.key],
    queryFn: () => listResource(config.endpoint, config.paginated),
  })
}