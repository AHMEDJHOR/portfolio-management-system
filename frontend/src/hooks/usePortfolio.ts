import { useQuery } from '@tanstack/react-query'
import {
  getBlogPost,
  getBlogPosts,
  getEducation,
  getExperience,
  getProject,
  getProjects,
  getSkills,
  getProfile,
  getCertifications,
} from '../services/portfolio'
import type { BlogPost } from '../types'

// Keys equal the admin resource keys, so admin saves refresh the public pages too.
export const useSkills = () => useQuery({ queryKey: ['skills'], queryFn: getSkills })
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: getProjects })
export const useExperience = () => useQuery({ queryKey: ['experiences'], queryFn: getExperience })
export const useEducation = () => useQuery({ queryKey: ['education'], queryFn: getEducation })

export const useProject = (slug: string) =>
  useQuery({ queryKey: ['projects', slug], queryFn: () => getProject(slug), enabled: slug !== '' })

export const useBlogPost = (slug: string) =>
  useQuery({ queryKey: ['blogs', slug], queryFn: () => getBlogPost(slug), enabled: slug !== '' })

const publishedNewestFirst = (posts: BlogPost[]): BlogPost[] =>
  posts
    .filter((post) => post.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const useBlogPosts = () =>
  useQuery({ queryKey: ['blogs'], queryFn: getBlogPosts, select: publishedNewestFirst })

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: getProfile, retry: false })
export const useCertifications = () =>
  useQuery({ queryKey: ['certifications'], queryFn: getCertifications })