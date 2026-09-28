import { z } from 'zod';

export const createEducationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required'),
  degree: z.string().trim().min(1, 'Degree is required'),
  fieldOfStudy: z.string().trim().min(1, 'Field of study is required'),
  startDate: z.coerce.date({
    message: 'Invalid start date',
  }),
  endDate: z.coerce
    .date({
      message: 'Invalid end date',
    })
    .optional(),
  description: z.string().trim().optional(),
});

export const updateEducationSchema = createEducationSchema;
