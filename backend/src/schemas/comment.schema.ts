import { z } from 'zod';

export const createCommentSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email: z.string().trim().email('Invalid email address').max(120),
  content: z.string().trim().min(3, 'Comment is too short').max(1000, 'Comment is too long'),
});

export const updateCommentSchema = z.object({
  approved: z.boolean(),
});