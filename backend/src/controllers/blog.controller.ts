import type { Request, Response } from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/blog.service.js";
import { AppError } from "../utils/AppError.js";

export const getAll = async (_req: Request, res: Response) => {
  const blogs = await getBlogs();

  res.status(200).json({
    success: true,
    data: blogs,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Blog ID is required", 400);
  }

  const blog = await getBlogById(id);

  res.status(200).json({
    success: true,
    data: blog,
  });
};

export const create = async (req: Request, res: Response) => {
  const blog = await createBlog(req.body);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Blog ID is required", 400);
  }

  const blog = await updateBlog(id, req.body);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Blog ID is required", 400);
  }

  await deleteBlog(id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};