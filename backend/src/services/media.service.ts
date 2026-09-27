import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import fs from "node:fs/promises";
import path from "node:path";

export const getMediaItems = async () => {
  return prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMediaById = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new AppError("Media not found", 404);
  }

  return media;
};

export const createMedia = async (data: {
  publicId?: string;
  url: string;
  altText?: string;
  mimeType: string;
  size: number;
  provider: "LOCAL" | "CLOUDINARY";
}) => {
  return prisma.media.create({
    data,
  });
};

export const updateMedia = async (
  id: string,
  data: {
    publicId?: string;
    url: string;
    altText?: string;
    mimeType: string;
    size: number;
    provider: "LOCAL" | "CLOUDINARY";
  },
) => {
  const existingMedia = await prisma.media.findUnique({
    where: { id },
  });

  if (!existingMedia) {
    throw new AppError("Media not found", 404);
  }

  return prisma.media.update({
    where: { id },
    data,
  });
};

export const deleteMedia = async (id: string) => {
  const existingMedia = await prisma.media.findUnique({
    where: { id },
  });

  if (!existingMedia) {
    throw new AppError("Media not found", 404);
  }

  if (existingMedia.provider === "LOCAL") {
    const filename = path.basename(existingMedia.url);
    const filePath = path.resolve("uploads", filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code !== "ENOENT"
      ) {
        throw error;
      }
    }
  }

  await prisma.media.delete({
    where: { id },
  });
};