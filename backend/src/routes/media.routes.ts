import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  upload,
} from "../controllers/media.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createMediaSchema,
  updateMediaSchema,
} from "../schemas/media.schema.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getAll);
router.post(
  "/upload",
  requireAuth,
  uploadImage.single("file"),
  upload,
);
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