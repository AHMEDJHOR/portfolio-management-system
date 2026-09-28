import path from "node:path";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { apiRateLimiter } from "./middlewares/rateLimit.js";
import apiRoutes from "./routes/index.js";



const app = express();

app.use("/uploads", express.static(path.resolve("uploads")));

app.use(express.json());

app.use("/api/v1", apiRateLimiter);
app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;