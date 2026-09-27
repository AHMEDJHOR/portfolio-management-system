import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getExperiences = async () => {
  return prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });
};

export const getExperienceById = async (id: string) => {
  const experience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  return experience;
};

export const createExperience = async (data: {
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
}) => {
  return prisma.experience.create({
    data,
  });
};

export const updateExperience = async (
  id: string,
  data: {
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    isCurrent?: boolean;
  },
) => {
  const existingExperience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!existingExperience) {
    throw new AppError("Experience not found", 404);
  }

  return prisma.experience.update({
    where: { id },
    data,
  });
};

export const deleteExperience = async (id: string) => {
  const existingExperience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!existingExperience) {
    throw new AppError("Experience not found", 404);
  }

  await prisma.experience.delete({
    where: { id },
  });
};