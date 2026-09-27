import type { Request, Response } from "express";
import {
  getMediaItems,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../services/media.service.js";
import { AppError } from "../utils/AppError.js";

export const getAll = async (_req: Request, res: Response) => {
  const media = await getMediaItems();

  res.status(200).json({
    success: true,
    data: media,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Media ID is required", 400);
  }

  const media = await getMediaById(id);

  res.status(200).json({
    success: true,
    data: media,
  });
};

export const create = async (req: Request, res: Response) => {
  const media = await createMedia(req.body);

  res.status(201).json({
    success: true,
    message: "Media created successfully",
    data: media,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Media ID is required", 400);
  }

  const media = await updateMedia(id, req.body);

  res.status(200).json({
    success: true,
    message: "Media updated successfully",
    data: media,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Media ID is required", 400);
  }

  await deleteMedia(id);

  res.status(200).json({
    success: true,
    message: "Media deleted successfully",
  });
};