import pino from "pino";
import { env } from "./env.js";

const isProduction = env.nodeEnv === "production";

const logger = isProduction
  ? pino({
      level: env.logLevel,
    })
  : pino({
      level: env.logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });

export default logger;