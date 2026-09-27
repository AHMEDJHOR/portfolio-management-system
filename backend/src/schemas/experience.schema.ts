import { z } from "zod";

export const createExperienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
  description: z.string().trim().min(1, "Description is required"),
  startDate: z.coerce.date({
    message: "Invalid start date",
  }),
  endDate: z.coerce.date({
    message: "Invalid end date",
  }).optional(),
  isCurrent: z.boolean().optional(),
});

export const updateExperienceSchema = createExperienceSchema;