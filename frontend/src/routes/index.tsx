import { lazy, Suspense } from 'react'
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import {
  blogResource,
  certificationsResource,
  educationResource,
  experienceResource,
  messagesResource,
  projectsResource,
  skillsResource,
  commentsResource,
  type ResourceConfig,
} from '../pages/admin/resources'

// Public pages
const Projects = lazy(() => import('../pages/Projects').then((m) => ({ default: m.Projects })))
const ProjectDetail = lazy(() =>
  import('../pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
)
const Blog = lazy(() => import('../pages/Blog').then((m) => ({ default: m.Blog })))
const BlogPostPage = lazy(() =>
  import('../pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
)

// Admin area: nothing here is downloaded by public visitors
const AdminRoot = lazy(() => import('../auth/AdminRoot').then((m) => ({ default: m.AdminRoot })))
const ProtectedRoute = lazy(() =>
  import('../auth/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })),
)
const AdminLayout = lazy(() =>
  import('../layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminLogin = lazy(() =>
  import('../pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })),
)
const AdminDashboard = lazy(() =>
  import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
)
const ResourceManager = lazy(() =>
  import('../pages/admin/ResourceManager').then((m) => ({ default: m.ResourceManager })),
)
const MediaManager = lazy(() =>
  import('../pages/admin/MediaManager').then((m) => ({ default: m.MediaManager })),
)
const ProfileManager = lazy(() =>
  import('../pages/admin/ProfileManager').then((m) => ({ default: m.ProfileManager })),
)

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
    // AuthProvider only wraps /admin, so public pages never call the auth endpoints.
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
              { path: 'comments', element: manage(commentsResource) },
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
  // Covers the admin chunks, which load outside PublicLayout.
  return (
    <Suspense
      fallback={
        <p className="pf-state" role="status">
          Loading…
        </p>
      }
    >
      {useRoutes(routes)}
    </Suspense>
  )
}