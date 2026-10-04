import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/media', label: 'Media' },
] as const

export function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <p className="admin__brand">Admin</p>
        <nav aria-label="Admin">
          <ul className="admin__nav">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={'end' in link} className="admin__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin__footer">
          <NavLink to="/" className="admin__link">
            View site
          </NavLink>
          <button type="button" className="admin__link" onClick={() => void handleLogout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  )
}