import { useRoutes, type RouteObject } from 'react-router-dom'
import { Hero } from '../components/hero/Hero'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { PlaceholderPage } from '../pages/PlaceholderPage'

const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Hero /> },
      { path: 'about', element: <PlaceholderPage title="About" /> },
      { path: 'projects', element: <PlaceholderPage title="Projects" /> },
      { path: 'projects/:slug', element: <PlaceholderPage title="Project detail" /> },
      { path: 'blog', element: <PlaceholderPage title="Blog" /> },
      { path: 'blog/:slug', element: <PlaceholderPage title="Blog post" /> },
      { path: 'contact', element: <PlaceholderPage title="Contact" /> },
    ],
  },
]

const adminRoutes: RouteObject[] = [
  // Login lives outside AdminLayout: it is not part of the dashboard shell.
  { path: '/admin/login', element: <PlaceholderPage title="Admin login" /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <PlaceholderPage title="Admin dashboard" /> },
      { path: 'profile', element: <PlaceholderPage title="Admin: Profile" /> },
      { path: 'skills', element: <PlaceholderPage title="Admin: Skills" /> },
      { path: 'projects', element: <PlaceholderPage title="Admin: Projects" /> },
      { path: 'experience', element: <PlaceholderPage title="Admin: Experience" /> },
      { path: 'education', element: <PlaceholderPage title="Admin: Education" /> },
      { path: 'certifications', element: <PlaceholderPage title="Admin: Certifications" /> },
      { path: 'blog', element: <PlaceholderPage title="Admin: Blog" /> },
      { path: 'messages', element: <PlaceholderPage title="Admin: Messages" /> },
      { path: 'media', element: <PlaceholderPage title="Admin: Media" /> },
    ],
  },
]

const routes: RouteObject[] = [
  ...publicRoutes,
  ...adminRoutes,
  { path: '*', element: <PlaceholderPage title="404: Not found" /> },
]

export function AppRoutes() {
  return useRoutes(routes)
}