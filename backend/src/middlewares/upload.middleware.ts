import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import type { RequestHandler } from 'express';
import { fileTypeFromFile } from 'file-type';
import { AppError } from '../utils/AppError.js';

const uploadDirectory = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const ALLOWED: ReadonlyMap<string, string> = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  // Extension comes from the allowed type, never from the user's filename.
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${ALLOWED.get(file.mimetype) ?? ''}`);
  },
});

export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(new AppError('Only JPEG, PNG, WebP or GIF images are allowed', 400));
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

/** Runs after multer: the declared type can be faked, the file's bytes cannot. */
export const verifyImage: RequestHandler = async (req, _res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const detected = await fileTypeFromFile(req.file.path);
  if (!detected || !ALLOWED.has(detected.mime)) {
    await fsp.unlink(req.file.path).catch(() => {});
    next(new AppError('The file is not a valid image', 400));
    return;
  }
  next();
};