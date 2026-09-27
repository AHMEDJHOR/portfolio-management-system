import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/experience.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createExperienceSchema,
  updateExperienceSchema,
} from "../schemas/experience.schema.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Admin only
router.post(
  "/",
  requireAuth,
  validateBody(createExperienceSchema),
  create,
);

router.put(
  "/:id",
  requireAuth,
  validateBody(updateExperienceSchema),
  update,
);

router.delete("/:id", requireAuth, remove);

export default router;