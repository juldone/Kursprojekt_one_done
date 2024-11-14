import express from "express";
import { craftItem } from "../controllers/craftingController.js";

const router = express.Router();

// Route zum Craften eines Items
router.post("/craft", craftItem);

export default router;
