import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().trim().min(1, 'Blog title is required'),
  slug: z.string().trim().min(1, 'Blog slug is required'),
  excerpt: z.string().trim().min(1, 'Blog excerpt is required'),
  content: z.string().trim().min(1, 'Blog content is required'),
  published: z.boolean().optional(),
  thumbnailId: z.string().uuid('Invalid thumbnail ID').optional(),
});

export const updateBlogSchema = createBlogSchema;
