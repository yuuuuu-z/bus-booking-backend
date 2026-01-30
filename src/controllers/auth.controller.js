import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { transporter } from "../config/mail.js";
import { generateOTP } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        created: user.createdAt,
        updated: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name,
          otp,
          otpExpires,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          otp,
          otpExpires,
          isVerified: false,
        },
      });
    }

    // ✅ THIS WAS MISSING
    await sendOtpEmail(email, otp);

    res.status(200).json({
      email: user.email,
      successMessage: "Account created successfully",
      otpMessage: "OTP has been sent to your email",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "Already verified" });
    }

    if (!user.otp || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatar: profile.photos[0]?.value,
              provider: "google",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
