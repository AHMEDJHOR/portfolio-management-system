import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/education.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createEducationSchema,
  updateEducationSchema,
} from "../schemas/education.schema.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Admin only
router.post(
  "/",
  requireAuth,
  validateBody(createEducationSchema),
  create,
);

router.put(
  "/:id",
  requireAuth,
  validateBody(updateEducationSchema),
  update,
);

router.delete("/:id", requireAuth, remove);

export default router;