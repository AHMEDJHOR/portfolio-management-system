import type { Request, Response } from 'express';
import {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../services/blog.service.js';
import { AppError } from '../utils/AppError.js';

export const getAll = async (req: Request, res: Response) => {
  const blogs = await getBlogs(req.adminId !== undefined);

  res.status(200).json({
    success: true,
    data: blogs,
  });
};

export const getBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (typeof slug !== 'string') {
    throw new AppError('Blog slug is required', 400);
  }

  const blog = await getBlogBySlug(slug);

  if (!blog.published && req.adminId === undefined) {
    throw new AppError('Blog not found', 404);
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Blog ID is required', 400);
  }

  const blog = await getBlogById(id);

  if (!blog.published && req.adminId === undefined) {
    throw new AppError('Blog not found', 404);
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
};

export const create = async (req: Request, res: Response) => {
  const blog = await createBlog(req.body);

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Blog ID is required', 400);
  }

  const blog = await updateBlog(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Blog ID is required', 400);
  }

  await deleteBlog(id);

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
  });
};