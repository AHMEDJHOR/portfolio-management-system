import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import './styles/globals.css'
import { App } from './app/App'
import { AppProviders } from './app/providers/AppProviders'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element "#root" was not found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)