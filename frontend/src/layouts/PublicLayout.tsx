import { Outlet } from 'react-router-dom'
import { PublicHeader } from '../components/navigation/PublicHeader'

export function PublicLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}