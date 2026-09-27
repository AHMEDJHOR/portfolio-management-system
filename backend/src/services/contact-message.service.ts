import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getContactMessages = async () => {
  return prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getContactMessageById = async (id: string) => {
  const contactMessage = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!contactMessage) {
    throw new AppError("Contact message not found", 404);
  }

  return contactMessage;
};

export const createContactMessage = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return prisma.contactMessage.create({
    data,
  });
};

export const updateContactMessage = async (
  id: string,
  data: {
    isRead: boolean;
  },
) => {
  const existingMessage = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!existingMessage) {
    throw new AppError("Contact message not found", 404);
  }

  return prisma.contactMessage.update({
    where: { id },
    data,
  });
};

export const deleteContactMessage = async (id: string) => {
  const existingMessage = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!existingMessage) {
    throw new AppError("Contact message not found", 404);
  }

  await prisma.contactMessage.delete({
    where: { id },
  });
};