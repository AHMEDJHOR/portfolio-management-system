import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttpModule from 'pino-http';
import logger from './config/logger.js';

const pinoHttp = pinoHttpModule.default ?? pinoHttpModule;

import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { apiRateLimiter } from './middlewares/rateLimit.js';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.resolve(__dirname, '../uploads');

const app = express();

app.use(
  pinoHttp({
    logger,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers.set-cookie',
      ],
      censor: '[REDACTED]',
    },
  }),
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

   app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use('/uploads', express.static(uploadDirectory));

app.use(express.json({ limit: '1mb' }));

app.use('/api/v1', apiRateLimiter);
app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
