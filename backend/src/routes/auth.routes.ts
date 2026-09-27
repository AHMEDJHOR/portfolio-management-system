import { Router } from "express";
import {
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

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