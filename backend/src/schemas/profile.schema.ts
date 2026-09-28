import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  title: z.string().trim().min(1, 'Profile title is required'),
  bio: z.string().trim().min(1, 'Profile bio is required'),
  location: z.string().trim().optional(),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional(),
  telegramUrl: z.string().url('Invalid Telegram URL').optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
});
