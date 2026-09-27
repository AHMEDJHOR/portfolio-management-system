import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getEducations = async () => {
  return prisma.education.findMany({
    orderBy: {
      startDate: "desc",
    },
  });
};

export const getEducationById = async (id: string) => {
  const education = await prisma.education.findUnique({
    where: { id },
  });

  if (!education) {
    throw new AppError("Education not found", 404);
  }

  return education;
};

export const createEducation = async (data: {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}) => {
  return prisma.education.create({
    data,
  });
};

export const updateEducation = async (
  id: string,
  data: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  },
) => {
  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new AppError("Education not found", 404);
  }

  return prisma.education.update({
    where: { id },
    data,
  });
};

export const deleteEducation = async (id: string) => {
  const existingEducation = await prisma.education.findUnique({
    where: { id },
  });

  if (!existingEducation) {
    throw new AppError("Education not found", 404);
  }

  await prisma.education.delete({
    where: { id },
  });
};