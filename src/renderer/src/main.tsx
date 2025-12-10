import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ThemeProvider } from '@/components/theme-provider'
import { THEME_STORAGE_KEY } from '../../shared/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 5 * 60000,
      refetchOnWindowFocus: true,
      retry: 2
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
