import { Outlet } from 'react-router-dom'
import { ConfirmProvider } from '../components/ui/ConfirmProvider'
import { AuthProvider } from './AuthProvider'

export function AdminRoot() {
  return (
    <AuthProvider>
      <ConfirmProvider>
      <Outlet />
      </ConfirmProvider>
    </AuthProvider>
  )
}