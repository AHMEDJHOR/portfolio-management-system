import { z } from "zod";

export const createMediaSchema = z.object({
  publicId: z.string().optional(),
  url: z.string().url("Invalid media URL"),
  altText: z.string().optional(),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().int().positive("Size must be greater than zero"),
  provider: z.enum(["LOCAL", "CLOUDINARY"]),
});

export const updateMediaSchema = createMediaSchema;