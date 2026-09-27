import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { AppError } from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { hashRefreshToken } from "../utils/refreshToken.js";

export const createAdmin = async (
  email: string,
  password: string,
) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new AppError("Admin account already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return admin;
};

export const verifyAdminCredentials = async (
  email: string,
  password: string,
) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordIsValid = await comparePassword(
    password,
    admin.password,
  );

  if (!passwordIsValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    id: admin.id,
    email: admin.email,
  };
};

export const createAuthTokens = async (adminId: string) => {
  const accessToken = generateAccessToken(adminId);
  const refreshToken = generateRefreshToken(adminId);

  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  );

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      adminId,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshAuthTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.revokedAt) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new AppError("Refresh token has expired", 401);
  }

  if (storedToken.adminId !== payload.adminId) {
    throw new AppError("Invalid refresh token", 401);
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      revokedAt: new Date(),
    },
  });

  return createAuthTokens(storedToken.adminId);
};

export const logout = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });

  return {
    success: true,
    message: "Logged out successfully",
  };
};