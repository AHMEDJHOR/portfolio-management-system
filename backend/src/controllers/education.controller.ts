import type { Request, Response } from 'express';
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../services/education.service.js';
import { AppError } from '../utils/AppError.js';

export const getAll = async (_req: Request, res: Response) => {
  const educations = await getEducations();

  res.status(200).json({
    success: true,
    data: educations,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Education ID is required', 400);
  }

  const education = await getEducationById(id);

  res.status(200).json({
    success: true,
    data: education,
  });
};

export const create = async (req: Request, res: Response) => {
  const education = await createEducation(req.body);

  res.status(201).json({
    success: true,
    message: 'Education created successfully',
    data: education,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Education ID is required', 400);
  }

  const education = await updateEducation(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Education updated successfully',
    data: education,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Education ID is required', 400);
  }

  await deleteEducation(id);

  res.status(200).json({
    success: true,
    message: 'Education deleted successfully',
  });
};
