import type { Request, Response } from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../services/project.service.js";
import { AppError } from "../utils/AppError.js";

export const getAll = async (req: Request, res: Response) => {
  const featuredParam = req.query.featured;

  let featured: boolean | undefined;

  if (featuredParam !== undefined) {
    if (featuredParam !== "true" && featuredParam !== "false") {
      throw new AppError(
        "Featured must be either true or false",
        400,
      );
    }

    featured = featuredParam === "true";
  }

  const projects = await getProjects(featured);

  res.status(200).json({
    success: true,
    data: projects,
  });
};

export const getBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (typeof slug !== "string") {
    throw new AppError("Project slug is required", 400);
  }

  const project = await getProjectBySlug(slug);

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const create = async (req: Request, res: Response) => {
  const project = await createProject(req.body);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Project ID is required", 400);
  }

  const project = await updateProject(id, req.body);

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Project ID is required", 400);
  }

  await deleteProject(id);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
};