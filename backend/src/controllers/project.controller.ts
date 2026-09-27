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
  const {
    title,
    slug,
    description,
    githubUrl,
    liveUrl,
    featured,
    thumbnailId,
    skillIds,
  } = req.body;

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof description !== "string"
  ) {
    throw new AppError(
      "Title, slug, and description are required",
      400,
    );
  }

  if (githubUrl !== undefined && typeof githubUrl !== "string") {
    throw new AppError("GitHub URL must be a string", 400);
  }

  if (liveUrl !== undefined && typeof liveUrl !== "string") {
    throw new AppError("Live URL must be a string", 400);
  }

  if (featured !== undefined && typeof featured !== "boolean") {
    throw new AppError("Featured must be a boolean", 400);
  }

  if (thumbnailId !== undefined && typeof thumbnailId !== "string") {
    throw new AppError("Thumbnail ID must be a string", 400);
  }

  if (
    skillIds !== undefined &&
    (!Array.isArray(skillIds) ||
      !skillIds.every((skillId) => typeof skillId === "string"))
  ) {
    throw new AppError("Skill IDs must be an array of strings", 400);
  }

  const project = await createProject({
    title,
    slug,
    description,
    githubUrl,
    liveUrl,
    featured,
    thumbnailId,
    skillIds,
  });

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

  const {
    title,
    slug,
    description,
    githubUrl,
    liveUrl,
    featured,
    thumbnailId,
    skillIds,
  } = req.body;

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof description !== "string"
  ) {
    throw new AppError(
      "Title, slug, and description are required",
      400,
    );
  }

  if (githubUrl !== undefined && typeof githubUrl !== "string") {
    throw new AppError("GitHub URL must be a string", 400);
  }

  if (liveUrl !== undefined && typeof liveUrl !== "string") {
    throw new AppError("Live URL must be a string", 400);
  }

  if (featured !== undefined && typeof featured !== "boolean") {
    throw new AppError("Featured must be a boolean", 400);
  }

  if (thumbnailId !== undefined && typeof thumbnailId !== "string") {
    throw new AppError("Thumbnail ID must be a string", 400);
  }

  if (
    skillIds !== undefined &&
    (!Array.isArray(skillIds) ||
      !skillIds.every((skillId) => typeof skillId === "string"))
  ) {
    throw new AppError("Skill IDs must be an array of strings", 400);
  }

  const project = await updateProject(id, {
    title,
    slug,
    description,
    githubUrl,
    liveUrl,
    featured,
    thumbnailId,
    skillIds,
  });

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