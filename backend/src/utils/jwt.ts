import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type AccessTokenPayload = {
  adminId: string;
};

export const generateAccessToken = (adminId: string): string => {
  return jwt.sign(
    { adminId } satisfies AccessTokenPayload,
    env.jwtAccessSecret,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (adminId: string): string => {
  return jwt.sign(
    { adminId } satisfies AccessTokenPayload,
    env.jwtRefreshSecret,
    {
      expiresIn: "7d",
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(
    token,
    env.jwtAccessSecret,
  ) as unknown as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): AccessTokenPayload => {
  return jwt.verify(
    token,
    env.jwtRefreshSecret,
  ) as unknown as AccessTokenPayload;
};