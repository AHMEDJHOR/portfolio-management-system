import app from "./app.js";

import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import logger from "./config/logger.js";

const server = app.listen(env.port);

server.on("listening", () => {
  logger.info(`Portfolio API running on http://localhost:${env.port}`);
});

server.on("error", (error) => {
  logger.error({ err: error }, "Failed to start HTTP server");
  process.exitCode = 1;
});

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, "Failed to close HTTP server");
      process.exitCode = 1;
      return;
    }

    try {
      await prisma.$disconnect();
      logger.info("Server closed successfully.");
      process.exitCode = 0;
    } catch (error) {
      logger.error({ err: error }, "Failed to disconnect from database");
      process.exitCode = 1;
    }
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});