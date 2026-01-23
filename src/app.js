import express from "express";
import userRoutes from "./routes/user.routes.js";
import provinceRoutes from "./routes/province.routes.js";
import tripRoutes from "./routes/trip.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check

app.use("/users", userRoutes);
app.use("/provinces", provinceRoutes);
app.use("/trips", tripRoutes);



export default app;
