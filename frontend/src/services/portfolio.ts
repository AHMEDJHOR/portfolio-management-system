import { apiClient, unwrap, unwrapList } from '../lib/api-client'
import { isRecord } from '../lib/guards'
import type { BlogPost, ContactInput, Education, Experience, Project, Skill,Profile,Certification } from '../types'

const PAGE = { page: 1, limit: 100 }

type ApiProject = Omit<Project, 'technologies'> & { technologies?: unknown[] }

// Accepts "TypeScript", { name }, or the join row { skill: { name } }.
function technologyName(entry: unknown): string | null {
  if (typeof entry === 'string') return entry
  if (!isRecord(entry)) return null
  if (typeof entry.name === 'string') return entry.name
  if (isRecord(entry.skill) && typeof entry.skill.name === 'string') return entry.skill.name
  return null
}

function toProject(raw: ApiProject): Project {
  const names = (raw.technologies ?? []).flatMap((entry) => {
    const name = technologyName(entry)
    return name ? [name] : []
  })
  return { ...raw, technologies: names }
}

export const getSkills = (): Promise<Skill[]> => unwrapList<Skill>(apiClient.get('/skills'))

export async function getProjects(): Promise<Project[]> {
  const list = await unwrapList<ApiProject>(apiClient.get('/projects', { params: PAGE }))
  return list.map(toProject)
}

export async function getProject(slug: string): Promise<Project> {
  return toProject(
    await unwrap<ApiProject>(apiClient.get(`/projects/${encodeURIComponent(slug)}`)),
  )
}

export const getExperience = (): Promise<Experience[]> =>
  unwrapList<Experience>(apiClient.get('/experiences'))

export const getEducation = (): Promise<Education[]> =>
  unwrapList<Education>(apiClient.get('/education'))

export const getBlogPosts = (): Promise<BlogPost[]> =>
  unwrapList<BlogPost>(apiClient.get('/blogs', { params: PAGE }))

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function sendContactMessage(input: ContactInput): Promise<void> {
  await apiClient.post('/contact-messages', input)
}

export const getProfile = (): Promise<Profile> => unwrap<Profile>(apiClient.get('/profile'))

export const getCertifications = (): Promise<Certification[]> =>
  unwrapList<Certification>(apiClient.get('/certifications'))