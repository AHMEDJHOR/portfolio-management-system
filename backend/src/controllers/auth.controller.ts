import type { Request, Response } from "express";

import {
  createAuthTokens,
  logout as logoutService,
  refreshAuthTokens,
  verifyAdminCredentials,
} from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  const tokens = await refreshAuthTokens(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: tokens,
  });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await logoutService(refreshToken);

  res.status(200).json(result);
};