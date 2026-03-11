import express from "express";
import { getAuthUser, logoutUser } from "../controllers/auth.controller.js";
import { devLogin, devSignup } from "../controllers/devAuth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * 🔹 CUSTOM DEV AUTH ROUTES
 */
router.post("/signup", (req, res, next) => {
  console.log("✅ Signup route handler called");
  devSignup(req, res).catch(next);
});
router.post("/login", (req, res, next) => {
  console.log("✅ Login route handler called");
  devLogin(req, res).catch(next);
});

/**
 * 🔹 COMMON ROUTES
 */
router.get("/me", verifyToken, getAuthUser);
router.post("/logout", logoutUser);

/**
 * 🔹 GOOGLE AUTH (DISABLED - NOT EXPOSED)
 * Google OAuth controller code kept but routes are not exposed
 */

// Debug route to verify auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!", timestamp: new Date().toISOString() });
});

export default router;
