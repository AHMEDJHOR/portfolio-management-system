import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'

export function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}