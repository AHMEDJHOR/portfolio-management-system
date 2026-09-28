import type { Request, Response } from 'express';
import {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../services/certification.service.js';
import { AppError } from '../utils/AppError.js';

export const getAll = async (_req: Request, res: Response) => {
  const certifications = await getCertifications();

  res.status(200).json({
    success: true,
    data: certifications,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Certification ID is required', 400);
  }

  const certification = await getCertificationById(id);

  res.status(200).json({
    success: true,
    data: certification,
  });
};

export const create = async (req: Request, res: Response) => {
  const certification = await createCertification(req.body);

  res.status(201).json({
    success: true,
    message: 'Certification created successfully',
    data: certification,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Certification ID is required', 400);
  }

  const certification = await updateCertification(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Certification updated successfully',
    data: certification,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Certification ID is required', 400);
  }

  await deleteCertification(id);

  res.status(200).json({
    success: true,
    message: 'Certification deleted successfully',
  });
};
