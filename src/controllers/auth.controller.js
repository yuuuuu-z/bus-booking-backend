import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  console.log("Login attempt:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    console.log("Finding user:", email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("Comparing password");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("Login successful");
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err); // This will show the actual error
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, name required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile.id);
        console.log("Email:", profile.emails[0].value);

        // Check if user exists by googleId or email
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          },
        });

        if (existingUser) {
          console.log("User exists:", existingUser.email);

          // Update googleId if missing
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: profile.id,
                provider: "google",
                avatar: profile.photos[0]?.value || existingUser.avatar,
              },
            });
          }

          return done(null, existingUser);
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value,
            provider: "google",
            // No password for Google users
          },
        });

        console.log("✅ New user created:", newUser.email);
        return done(null, newUser);
      } catch (error) {
        console.error("❌ Google OAuth error:", error);
        return done(error, null);
      }
    },
  ),
);
