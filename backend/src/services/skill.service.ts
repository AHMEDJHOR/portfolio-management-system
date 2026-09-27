import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getSkills = async () => {
  return prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createSkill = async (data: {
  name: string;
  category: string;
  level: number;
  icon?: string;
}) => {
  const existingSkill = await prisma.skill.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingSkill) {
    throw new AppError("A skill with this name already exists", 409);
  }

  return prisma.skill.create({
    data,
  });
};

export const updateSkill = async (
  id: string,
  data: {
    name: string;
    category: string;
    level: number;
    icon?: string;
  },
) => {
  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new AppError("Skill not found", 404);
  }

  const duplicateSkill = await prisma.skill.findFirst({
    where: {
      name: data.name,
      NOT: {
        id,
      },
    },
  });

  if (duplicateSkill) {
    throw new AppError("A skill with this name already exists", 409);
  }

  return prisma.skill.update({
    where: { id },
    data,
  });
};

export const deleteSkill = async (id: string) => {
  const existingSkill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!existingSkill) {
    throw new AppError("Skill not found", 404);
  }

  return prisma.skill.delete({
    where: { id },
  });
};