export interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon: string | null
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
  thumbnail: Media | null
  /** Skill names, flattened from the ProjectTechnology join rows. */
  technologies: string[]
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string | null
  description: string | null
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  published: boolean
  createdAt: string
}

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface Media {
  id: string
  url: string
  altText: string | null
  mimeType: string
  size: number
  provider: 'LOCAL' | 'CLOUDINARY'
}

export interface Profile {
  id: string
  fullName: string
  title: string
  bio: string
  location: string | null
  email: string
  phone: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  telegramUrl: string | null
  resumeUrl: string | null
  profileImage: Media | null
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialUrl: string | null
}