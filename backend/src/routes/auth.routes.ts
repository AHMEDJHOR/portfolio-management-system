import { Router } from "express";

import {
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import { loginRateLimiter } from "../middlewares/rateLimit.js";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/login",
  loginRateLimiter,
  validateBody(loginSchema),
  login,
);

router.post(
  "/refresh",
  validateBody(refreshSchema),
  refresh,
);

router.post(
  "/logout",
  validateBody(logoutSchema),
  logout,
);

router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    data: {
      adminId: req.adminId,
    },
  });
});

export default router;