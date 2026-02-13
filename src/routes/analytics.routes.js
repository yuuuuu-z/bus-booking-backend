import express from "express";
import { getTopDestinationProvinces } from "../controllers/analytics.controller.js";
const router = express.Router();

router.get("/top-provinces", getTopDestinationProvinces);


export default router;
