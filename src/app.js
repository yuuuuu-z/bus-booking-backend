import express from "express";
import prisma from "./lib/prisma.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check

app.use("/users", userRoutes);


export default app;
