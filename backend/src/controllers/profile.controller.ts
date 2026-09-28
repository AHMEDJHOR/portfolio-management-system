import type { Request, Response } from 'express';
import { getProfile, updateProfile } from '../services/profile.service.js';

export const get = async (req: Request, res: Response) => {
  const profile = await getProfile();

  res.status(200).json({
    success: true,
    data: profile,
  });
};

export const update = async (req: Request, res: Response) => {
  const profile = await updateProfile(req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: profile,
  });
};
