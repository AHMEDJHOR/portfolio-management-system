import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import skillRoutes from "./skill.routes.js";
import projectRoutes from "./project.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/projects", projectRoutes);

export default router;