import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../../components/theme/ThemeProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Portfolio content changes rarely, so avoid needless refetching.
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {/* "user" honors prefers-reduced-motion for every Framer Motion animation. */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}