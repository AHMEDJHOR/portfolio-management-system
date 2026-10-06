const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
const longDate = new Intl.DateTimeFormat('en', { dateStyle: 'long' })

export const formatMonth = (iso: string): string => monthYear.format(new Date(iso))
export const formatDate = (iso: string): string => longDate.format(new Date(iso))

export function formatRange(start: string, end: string | null, present = 'Present'): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : present}`
}

/** Splits plain text into paragraphs. Rendering text nodes keeps CMS content free of HTML injection. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Only http(s) links are rendered, so an admin-entered `javascript:` URL can never become a link. */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`
}