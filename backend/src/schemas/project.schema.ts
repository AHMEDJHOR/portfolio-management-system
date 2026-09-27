import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Project title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Project slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().trim().min(1, "Project description is required"),
  githubUrl: z.string().url("Invalid GitHub URL").optional(),
  liveUrl: z.string().url("Invalid live URL").optional(),
  featured: z.boolean().optional(),
  thumbnailId: z.string().uuid("Invalid thumbnail ID").optional(),
  skillIds: z.array(z.string().uuid("Invalid skill ID")).optional(),
});

export const updateProjectSchema = createProjectSchema;