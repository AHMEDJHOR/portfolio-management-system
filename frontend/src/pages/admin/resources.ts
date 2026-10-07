import type { Item } from '../../services/admin'

export type FieldType = 'text' | 'textarea' | 'url' | 'date' | 'checkbox' | 'tags' | 'number' | 'skills' | 'media'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  /** Property to read when editing, if it differs from `name` (e.g. technologies → technologyIds). */
  source?: string
}

export interface ResourceConfig {
  key: string
  title: string
  path: string
  endpoint: string
  fields: readonly FieldConfig[]
  primary: (item: Item) => string
  secondary?: (item: Item) => string
  /** The endpoint takes ?page&limit, so ask for a large page. */
  paginated?: boolean
  /** No create/edit, only list and delete (contact messages). */
  readOnly?: boolean
  /** Shows a "Mark read" button that sends PUT { isRead: true }. */
  canMarkRead?: boolean

  canApprove?: boolean
}
const text = (value: unknown): string => (typeof value === 'string' ? value : '')

export const skillsResource: ResourceConfig = {
  key: 'skills',
  title: 'Skills',
  path: '/admin/skills',
  endpoint: '/skills',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'text', required: true, help: 'Skills sharing a category are grouped together.' },
    { name: 'level', label: 'Level', type: 'number', required: true, help: 'Whole number. Stored only; the public site does not show it.' },
    { name: 'icon', label: 'Icon', type: 'text' },
  ],
  primary: (item) => text(item.name),
  secondary: (item) => text(item.category),
}

export const projectsResource: ResourceConfig = {
  key: 'projects',
  title: 'Projects',
  path: '/admin/projects',
  endpoint: '/projects',
  paginated: true,
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, help: 'Lowercase letters, numbers and hyphens, e.g. my-project.' },
    { name: 'description', label: 'Description', type: 'textarea', required: true, help: 'Separate paragraphs with a blank line.' },
    { name: 'skillIds', source: 'technologies', label: 'Technologies', type: 'skills' },
    { name: 'thumbnailId', label: 'Thumbnail', type: 'media' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { name: 'liveUrl', label: 'Live demo URL', type: 'url' },
    { name: 'featured', label: 'Featured on the home page', type: 'checkbox' },
  ],
  primary: (item) => text(item.title),
  secondary: (item) => text(item.description),
}

export const experienceResource: ResourceConfig = {
  key: 'experiences',
  title: 'Experience',
  path: '/admin/experience',
  endpoint: '/experiences',
  fields: [
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'startDate', label: 'Start date', type: 'date', required: true },
    { name: 'endDate', label: 'End date', type: 'date', help: 'Leave empty if this is current.' },
    { name: 'isCurrent', label: 'I currently work here', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ],
  primary: (item) => text(item.position),
  secondary: (item) => text(item.company),
}

export const educationResource: ResourceConfig = {
  key: 'education',
  title: 'Education',
  path: '/admin/education',
  endpoint: '/education',
  fields: [
    { name: 'degree', label: 'Degree', type: 'text', required: true },
    { name: 'fieldOfStudy', label: 'Field of study', type: 'text', required: true },
    { name: 'institution', label: 'Institution', type: 'text', required: true },
    { name: 'startDate', label: 'Start date', type: 'date', required: true },
    { name: 'endDate', label: 'End date', type: 'date', help: 'Leave empty if ongoing.' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  primary: (item) => text(item.degree),
  secondary: (item) => text(item.institution),
}

export const certificationsResource: ResourceConfig = {
  key: 'certifications',
  title: 'Certifications',
  path: '/admin/certifications',
  endpoint: '/certifications',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'issuer', label: 'Issuer', type: 'text', required: true },
    { name: 'issueDate', label: 'Issue date', type: 'date', required: true },
    { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
  ],
  primary: (item) => text(item.title),
  secondary: (item) => text(item.issuer),
}

export const blogResource: ResourceConfig = {
  key: 'blogs',
  title: 'Blog',
  path: '/admin/blog',
  endpoint: '/blogs',
  paginated: true,
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true, help: 'Plain text. Separate paragraphs with a blank line.' },
    { name: 'thumbnailId', label: 'Thumbnail', type: 'media' },
    { name: 'published', label: 'Published', type: 'checkbox' },
  ],
  primary: (item) => text(item.title),
  secondary: (item) => (item.published === true ? 'Published' : 'Draft'),
}

export const messagesResource: ResourceConfig = {
  key: 'messages',
  title: 'Messages',
  path: '/admin/messages',
  endpoint: '/contact-messages',
  fields: [],
  readOnly: true,
  canMarkRead: true,
  primary: (item) => `${item.isRead === true ? '' : '● '}${text(item.name)} <${text(item.email)}>`,
  secondary: (item) => `${text(item.subject)}: ${text(item.message)}`,
}

export const ADMIN_RESOURCES: readonly ResourceConfig[] = [
  skillsResource,
  projectsResource,
  experienceResource,
  educationResource,
  certificationsResource,
  blogResource,
  messagesResource,
]

const blogTitle = (item: Item): string => {
  const blog = item.blog
  return typeof blog === 'object' && blog !== null && 'title' in blog && typeof blog.title === 'string'
    ? blog.title
    : ''
}

export const commentsResource: ResourceConfig = {
  key: 'comments',
  title: 'Comments',
  path: '/admin/comments',
  endpoint: '/comments',
  fields: [],
  readOnly: true,
  canApprove: true,
  primary: (item) => `${item.approved === true ? '' : '● '}${text(item.name)} <${text(item.email)}>`,
  secondary: (item) => `On "${blogTitle(item)}": ${text(item.content)}`,
}