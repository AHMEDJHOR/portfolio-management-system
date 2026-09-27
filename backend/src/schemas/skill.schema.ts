import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required"),
  category: z.string().trim().min(1, "Skill category is required"),
  level: z
    .number()
    .int("Skill level must be an integer")
    .min(1, "Skill level must be at least 1")
    .max(100, "Skill level cannot exceed 100"),
  icon: z.string().trim().optional(),
});

export const updateSkillSchema = createSkillSchema;