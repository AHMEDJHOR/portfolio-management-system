import { z } from 'zod';

export const createCertificationSchema = z.object({
  title: z.string().trim().min(1, 'Certification title is required'),
  issuer: z.string().trim().min(1, 'Certification issuer is required'),
  issueDate: z.coerce.date({
    message: 'Invalid issue date',
  }),
  credentialUrl: z.string().url('Invalid credential URL').optional(),
});

export const updateCertificationSchema = createCertificationSchema;
