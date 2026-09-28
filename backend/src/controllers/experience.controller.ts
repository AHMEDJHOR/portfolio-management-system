import type { Request, Response } from 'express';
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../services/experience.service.js';
import { AppError } from '../utils/AppError.js';

export const getAll = async (_req: Request, res: Response) => {
  const experiences = await getExperiences();

  res.status(200).json({
    success: true,
    data: experiences,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Experience ID is required', 400);
  }

  const experience = await getExperienceById(id);

  res.status(200).json({
    success: true,
    data: experience,
  });
};

export const create = async (req: Request, res: Response) => {
  const experience = await createExperience(req.body);

  res.status(201).json({
    success: true,
    message: 'Experience created successfully',
    data: experience,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Experience ID is required', 400);
  }

  const experience = await updateExperience(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Experience updated successfully',
    data: experience,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Experience ID is required', 400);
  }

  await deleteExperience(id);

  res.status(200).json({
    success: true,
    message: 'Experience deleted successfully',
  });
};
