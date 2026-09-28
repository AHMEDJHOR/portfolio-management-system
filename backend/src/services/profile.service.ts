import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const getProfile = async () => {
  return prisma.profile.findFirst({
    include: {
      profileImage: true,
    },
  });
};

export const updateProfile = async (data: {
  fullName: string;
  title: string;
  bio: string;
  location?: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  resumeUrl?: string;
}) => {
  const existingProfile = await prisma.profile.findFirst();

  if (!existingProfile) {
    return prisma.profile.create({
      data,
    });
  }

  return prisma.profile.update({
    where: {
      id: existingProfile.id,
    },
    data,
  });
};
