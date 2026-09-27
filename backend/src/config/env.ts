import "dotenv/config";

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
} as const;