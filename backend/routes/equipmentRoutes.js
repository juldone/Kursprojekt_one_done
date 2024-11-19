import express from "express";
import { equipItem } from "../controllers/equipmentController.js";

const router = express.Router();

// POST-Route zum Ausrüsten eines Items
router.post("/equip", equipItem);

export default router;
