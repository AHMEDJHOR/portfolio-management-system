import type { Request, Response } from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/skill.service.js";
import { AppError } from "../utils/AppError.js";

export const get = async (_req: Request, res: Response) => {
  const skills = await getSkills();

  res.status(200).json({
    success: true,
    data: skills,
  });
};

export const create = async (req: Request, res: Response) => {
  const { name, category, level, icon } = req.body;

  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    typeof level !== "number"
  ) {
    throw new AppError(
      "Name, category, and level are required",
      400,
    );
  }

  const skill = await createSkill({
    name,
    category,
    level,
    icon,
  });

  res.status(201).json({
    success: true,
    message: "Skill created successfully",
    data: skill,
  });
};

export const update = async (req: Request, res: Response) => {
  const { name, category, level, icon } = req.body;
  const { id } = req.params;

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof category !== "string" ||
    typeof level !== "number"
  ) {
    throw new AppError(
      "Skill id, name, category, and level are required",
      400,
    );
  }

  const skill = await updateSkill(id, {
    name,
    category,
    level,
    icon,
  });

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    data: skill,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Skill id is required", 400);
  }

  await deleteSkill(id);

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
};