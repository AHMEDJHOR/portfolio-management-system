import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import { AdminRoot } from '../auth/AdminRoot'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminLogin } from '../pages/admin/AdminLogin'
import { ResourceManager } from '../pages/admin/ResourceManager'
import { MediaManager } from '../pages/admin/MediaManager'
import { ProfileManager } from '../pages/admin/ProfileManager'
import { NotFound } from '../pages/NotFound'
import {
  blogResource,
  educationResource,
  experienceResource,
  messagesResource,
  projectsResource,
  skillsResource,
  certificationsResource,
  type ResourceConfig,
} from '../pages/admin/resources'
import { Blog } from '../pages/Blog'
import { BlogPostPage } from '../pages/BlogPostPage'
import { Home } from '../pages/Home'
import { ProjectDetail } from '../pages/ProjectDetail'
import { Projects } from '../pages/Projects'

// The key forces a fresh editor state when moving between resource pages.
const manage = (config: ResourceConfig) => <ResourceManager key={config.key} config={config} />

const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <Navigate to="/#about" replace /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'contact', element: <Navigate to="/#contact" replace /> },
    ],
  },
]

const adminRoutes: RouteObject[] = [
  {
    // AuthProvider only wraps /admin, so public pages never call /auth/me.
    element: <AdminRoot />,
    children: [
      { path: '/admin/login', element: <AdminLogin /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'profile', element: <ProfileManager /> },
              { path: 'skills', element: manage(skillsResource) },
              { path: 'projects', element: manage(projectsResource) },
              { path: 'experience', element: manage(experienceResource) },
              { path: 'education', element: manage(educationResource) },
              { path: 'certifications', element: manage(certificationsResource) },
              { path: 'blog', element: manage(blogResource) },
              { path: 'messages', element: manage(messagesResource) },
              { path: 'media', element: <MediaManager /> },
            ],
          },
        ],
      },
    ],
  },
]

const routes: RouteObject[] = [
  ...publicRoutes,
  ...adminRoutes,
  { path: '*', element: <NotFound /> },
]

export function AppRoutes() {
  return useRoutes(routes)
}