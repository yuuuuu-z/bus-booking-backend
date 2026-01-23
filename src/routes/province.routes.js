import express from "express";
import { getProvinces } from "../controllers/province.controller.js";

const router = express.Router();

router.get("/", getProvinces);

export default router;
