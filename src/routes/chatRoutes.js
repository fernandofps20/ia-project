import express from "express";
import { processChat } from "../controllers/chatcontroller.js";

const router = express.Router();

router.post("/api/data", processChat);

export default router;
