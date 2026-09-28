import { uploadToCloudinary } from "../services/media.service.js";
import fs from "node:fs/promises";
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

export const upload = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Image file is required", 400);
  }

  const media = await createMedia({
    url: `/uploads/${req.file.filename}`,
    altText: req.body.altText,
    mimeType: req.file.mimetype,
    size: req.file.size,
    provider: "LOCAL",
  });

  res.status(201).json({
    success: true,
    message: "Media uploaded successfully",
    data: media,
  });
};

export const uploadCloudinary = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError("Image file is required", 400);
  }

  const result = await uploadToCloudinary(req.file.path);

  const media = await createMedia({
    publicId: result.publicId,
    url: result.secureUrl,
    altText: req.body.altText,
    mimeType: req.file.mimetype,
    size: req.file.size,
    provider: "CLOUDINARY",
  });

  await fs.unlink(req.file.path);

  res.status(201).json({
    success: true,
    message: "Media uploaded to Cloudinary successfully",
    data: media,
  });
};