import express from "express";
import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import provinceRoutes from "./routes/province.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import passport from "passport";
import prisma from "./lib/prisma.js";
import { protect } from "./middlewares/auth.middleware.js";

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
    origin: "*", // Allow all origins (testing only!)
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// ==================== ROUTES ====================
// Test endpoints
app.get("/", (req, res) => {
  res.json({ message: "API is running from Backend" });
});

app.use("/auth", authRoutes); // login / register / google

// 🔐 PROTECTED routes
app.use("/users", protect, userRoutes);
app.use("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});
app.use("/provinces", protect, provinceRoutes);
app.use("/booking", protect, bookingRoutes);
app.use("/avatar", protect, uploadRoutes);

export default app;
