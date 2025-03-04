import express from "express";
import { processPrompt } from "../controllers/promptController.js";

const router = express.Router();

router.post("/api/data", processPrompt);

export default router;