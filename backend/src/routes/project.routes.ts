import { Router } from "express";
import {
  getAll,
  getBySlug,
  create,
  update,
  remove,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:slug", getBySlug);

// Admin only
router.post("/", requireAuth, create);
router.put("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

export default router;