import { Router } from "express";

import {
  get,
  update,
} from "../controllers/profile.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";

const router = Router();

router.get("/", get);

router.put(
  "/",
  requireAuth,
  validateBody(updateProfileSchema),
  update,
);

export default router;