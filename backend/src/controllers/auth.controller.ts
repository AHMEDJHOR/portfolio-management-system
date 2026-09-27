import type { Request, Response } from "express";
import { logout as logoutService } from "../services/auth.service.js";
import {
  createAuthTokens,
  refreshAuthTokens,
  verifyAdminCredentials,
} from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new AppError("Email and password are required", 400);
  }

  const admin = await verifyAdminCredentials(email, password);

  const tokens = await createAuthTokens(admin.id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      admin,
      ...tokens,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (typeof refreshToken !== "string" || !refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const tokens = await refreshAuthTokens(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: tokens,
  });
};

export const logout = async (
  req: Request,
  res: Response,
) => {
  const { refreshToken } = req.body;

  if (typeof refreshToken !== "string" || !refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const result = await logoutService(refreshToken);

  res.status(200).json(result);
};