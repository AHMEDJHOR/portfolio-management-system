import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/media.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createMediaSchema,
  updateMediaSchema,
} from "../schemas/media.schema.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Admin only
router.post(
  "/",
  requireAuth,
  validateBody(createMediaSchema),
  create,
);

router.put(
  "/:id",
  requireAuth,
  validateBody(updateMediaSchema),
  update,
);

router.delete("/:id", requireAuth, remove);

export default router;