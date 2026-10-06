import type { MessageKey } from './messages'

export interface NavItem {
  id: string
  labelKey: MessageKey
}

// Shared by the header and the footer.
export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'about', labelKey: 'nav.about' },
  { id: 'skills', labelKey: 'nav.skills' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'blog', labelKey: 'nav.blog' },
  { id: 'contact', labelKey: 'nav.contact' },
]