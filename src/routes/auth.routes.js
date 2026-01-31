import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { register, login, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

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
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

    res.redirect(`${frontendURL}/auth/callback?`);
    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  },
);

export default router;
