// routes/characterRoutes.js
import express from "express";
import { equipWeaponController } from "../controllers/characterController.js";

const router = express.Router();

// Route zum Ausrüsten einer Waffe
router.post("/equipWeapon", equipWeaponController);

export default router;
