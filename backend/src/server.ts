import app from "./app.js";

import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import logger from "./config/logger.js";

const server = app.listen(env.port, () => {
  logger.info(`Portfolio API running on http://localhost:${env.port}`);
});

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
