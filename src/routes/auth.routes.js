import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect to login page on failure
    failureMessage: true,
  }),
  (req, res) => {
    // Generate JWT token for API access
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ CORRECT: Redirect to frontend dashboard
    res.redirect(`http://localhost:8000/dashboard?token=${token}`);

    // OR if you want to send user data too:
    // res.redirect(
    //   `http://localhost:3000/dashboard?token=${token}&userId=${req.user.id}`
    // );
  },
);

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logged out" });
  });
});

export default router;
