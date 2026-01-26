import express from "express";
import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import provinceRoutes from "./routes/province.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import prisma from "./lib/prisma.js";

const app = express();

// ==================== SESSION (MUST BE FIRST!) ====================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// ==================== PASSPORT SETUP ====================
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user ID:", id);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    console.error("Deserialize error:", error);
    done(error, null);
  }
});

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// ==================== ROUTES ====================
// Test endpoints
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Your existing routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", (req, res) => {
  res.json({ message: "Hiuuuuuu" });
});
app.use("/provinces", provinceRoutes);
app.use("/trips", tripRoutes);

export default app;
