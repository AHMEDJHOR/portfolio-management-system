import { Router } from "express";
import {
  get,
  create,
  update,
  remove,
} from "../controllers/skill.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", get);

// Admin only
router.post("/", requireAuth, create);
router.put("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

export default router;