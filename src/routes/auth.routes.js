import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const getFrontendURL = () => {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.FRONTEND_URL || "http://localhost:3000";
  }
  return "http://localhost:8000";
};

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// 2️⃣ Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // For testing: return JSON instead of redirect
    if (process.env.NODE_ENV === "development") {
      return res.json({
        success: true,
        token,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.avatar,
        },
      });
    }

    // For production: redirect to frontend
    res.redirect(`${getFrontendURL()}/auth/callback?token=${token}`);
  },
);

export default router;
