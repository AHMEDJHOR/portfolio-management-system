import { prisma } from '../config/prisma.js';

export const getProfile = async () => {
  return prisma.profile.findFirst({
    include: {
      profileImage: true,
    },
  });
};

export interface UpdateProfileData {
  fullName: string;
  title: string;
  bio: string;
  location?: string | null;
  email: string;
  phone?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  telegramUrl?: string | null;
  resumeUrl?: string | null;
  profileImageId?: string | null;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const existingProfile = await prisma.profile.findFirst();

  if (!existingProfile) {
    return prisma.profile.create({
      data,
      include: { profileImage: true },
    });
  }

  return prisma.profile.update({
    where: { id: existingProfile.id },
    data,
    include: { profileImage: true },
  });
};