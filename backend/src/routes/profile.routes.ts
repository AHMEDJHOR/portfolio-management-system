import { Router } from "express";
import {
  get,
  update,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", get);

router.put("/", requireAuth, update);

export default router;