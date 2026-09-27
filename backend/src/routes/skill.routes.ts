import { Router } from "express";
import {
  get,
  create,
  update,
  remove,
} from "../controllers/skill.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createSkillSchema,
  updateSkillSchema,
} from "../schemas/skill.schema.js";

const router = Router();

router.get("/", get);

router.post(
  "/",
  requireAuth,
  validateBody(createSkillSchema),
  create,
);

router.put(
  "/:id",
  requireAuth,
  validateBody(updateSkillSchema),
  update,
);

router.delete("/:id", requireAuth, remove);

export default router;