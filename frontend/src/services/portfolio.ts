import { apiClient, unwrap, unwrapList } from '../lib/api-client'
import { isRecord } from '../lib/guards'
import type { BlogPost, ContactInput, Education, Experience, Project, Skill,Profile,Certification,ProjectSkill  } from '../types'

const PAGE = { page: 1, limit: 100 }

type ApiProject = Omit<Project, 'technologies' | 'skills'> & { technologies?: unknown[] }

// Accepts "TypeScript", { name, ... } or the join row { skill: { name, ... } }.
function toSkill(entry: unknown): ProjectSkill | null {
  const source = isRecord(entry) && isRecord(entry.skill) ? entry.skill : entry
  if (typeof source === 'string') return { name: source, category: '', icon: null }
  if (!isRecord(source) || typeof source.name !== 'string') return null
  return {
    name: source.name,
    category: typeof source.category === 'string' ? source.category : '',
    icon: typeof source.icon === 'string' ? source.icon : null,
  }
}

function toProject(raw: ApiProject): Project {
  const skills = (raw.technologies ?? []).flatMap((entry) => {
    const skill = toSkill(entry)
    return skill ? [skill] : []
  })
  return { ...raw, technologies: skills.map((skill) => skill.name), skills }
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