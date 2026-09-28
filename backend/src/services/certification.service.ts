import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const getCertifications = async () => {
  return prisma.certification.findMany({
    orderBy: {
      issueDate: 'desc',
    },
  });
};

export const getCertificationById = async (id: string) => {
  const certification = await prisma.certification.findUnique({
    where: { id },
  });

  if (!certification) {
    throw new AppError('Certification not found', 404);
  }

  return certification;
};

export const createCertification = async (data: {
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl?: string;
}) => {
  return prisma.certification.create({
    data,
  });
};

export const updateCertification = async (
  id: string,
  data: {
    title: string;
    issuer: string;
    issueDate: Date;
    credentialUrl?: string;
  },
) => {
  const existingCertification = await prisma.certification.findUnique({
    where: { id },
  });

  if (!existingCertification) {
    throw new AppError('Certification not found', 404);
  }

  return prisma.certification.update({
    where: { id },
    data,
  });
};

export const deleteCertification = async (id: string) => {
  const existingCertification = await prisma.certification.findUnique({
    where: { id },
  });

  if (!existingCertification) {
    throw new AppError('Certification not found', 404);
  }

  await prisma.certification.delete({
    where: { id },
  });
};
