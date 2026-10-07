import type { Request, Response } from 'express';
import {
  createComment,
  deleteComment,
  getAllComments,
  getApprovedComments,
  setCommentApproved,
} from '../services/comment.service.js';
import { AppError } from '../utils/AppError.js';

const requireParam = (value: unknown, name: string): string => {
  if (typeof value !== 'string') throw new AppError(`${name} is required`, 400);
  return value;
};

export const listForBlog = async (req: Request, res: Response) => {
  const comments = await getApprovedComments(requireParam(req.params.blogId, 'Blog ID'));
  res.status(200).json({ success: true, data: comments });
};

export const createForBlog = async (req: Request, res: Response) => {
  await createComment(requireParam(req.params.blogId, 'Blog ID'), req.body);
  res.status(201).json({ success: true, message: 'Comment submitted for review' });
};

export const listAll = async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: await getAllComments() });
};

export const update = async (req: Request, res: Response) => {
  const comment = await setCommentApproved(requireParam(req.params.id, 'Comment ID'), req.body.approved);
  res.status(200).json({ success: true, message: 'Comment updated', data: comment });
};

export const remove = async (req: Request, res: Response) => {
  await deleteComment(requireParam(req.params.id, 'Comment ID'));
  res.status(200).json({ success: true, message: 'Comment deleted' });
};