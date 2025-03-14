import express from "express";
import { createReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", createReport);

export default router; // Default export