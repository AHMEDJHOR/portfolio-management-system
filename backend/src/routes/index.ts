import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import skillRoutes from "./skill.routes.js";
import projectRoutes from "./project.routes.js";
import experienceRoutes from "./experience.routes.js";
import educationRoutes from "./education.routes.js";
import certificationRoutes from "./certification.routes.js";
import blogRoutes from "./blog.routes.js";
import contactMessageRoutes from "./contact-message.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/projects", projectRoutes);
router.use("/experiences", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certifications", certificationRoutes);
router.use("/blogs", blogRoutes);
router.use("/contact-messages", contactMessageRoutes);

export default router;