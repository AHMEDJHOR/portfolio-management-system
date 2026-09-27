import type { Request, Response } from "express";
import {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from "../services/contact-message.service.js";
import { AppError } from "../utils/AppError.js";

export const getAll = async (_req: Request, res: Response) => {
  const messages = await getContactMessages();

  res.status(200).json({
    success: true,
    data: messages,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Contact message ID is required", 400);
  }

  const message = await getContactMessageById(id);

  res.status(200).json({
    success: true,
    data: message,
  });
};

export const create = async (req: Request, res: Response) => {
  const message = await createContactMessage(req.body);

  res.status(201).json({
    success: true,
    message: "Contact message sent successfully",
    data: message,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Contact message ID is required", 400);
  }

  const message = await updateContactMessage(id, req.body);

  res.status(200).json({
    success: true,
    message: "Contact message updated successfully",
    data: message,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Contact message ID is required", 400);
  }

  await deleteContactMessage(id);

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
};