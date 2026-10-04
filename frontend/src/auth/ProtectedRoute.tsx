import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export function ProtectedRoute() {
 const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <p className="pf-state" role="status">
        Checking session…
      </p>
    )
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}