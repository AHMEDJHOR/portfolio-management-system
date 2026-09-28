import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError('Authentication required', 401));
    return;
  }

  const token = authorization.slice(7);

  try {
    const payload = verifyAccessToken(token);

    req.adminId = payload.adminId;

    next();
  } catch {
    next(new AppError('Invalid or expired access token', 401));
  }
};
