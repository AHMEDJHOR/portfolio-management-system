import { z } from 'zod';

const optionalText = z.string().trim().nullable().optional();
const optionalUrl = (message: string) => z.string().url(message).nullable().optional();

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  title: z.string().trim().min(1, 'Profile title is required'),
  bio: z.string().trim().min(1, 'Profile bio is required'),
  location: optionalText,
  email: z.string().trim().email('Invalid email address'),
  phone: optionalText,
  githubUrl: optionalUrl('Invalid GitHub URL'),
  linkedinUrl: optionalUrl('Invalid LinkedIn URL'),
  telegramUrl: optionalUrl('Invalid Telegram URL'),
  resumeUrl: optionalUrl('Invalid resume URL'),
  profileImageId: z.string().uuid('Invalid image ID').nullable().optional(),
});