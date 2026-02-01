import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/uploadAvatar.js";
import {
  deleteAvatar,
  uploadAvatar,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload", protect, upload.single("avatar"), uploadAvatar);

router.delete("/delete", protect, deleteAvatar);

export default router;
