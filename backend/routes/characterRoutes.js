import express from "express";
import {
  equipArmorController,
  equipWeaponController,
  removeArmor,
  removeWeapon,
} from "../controllers/characterController.js";

const router = express.Router();

// Route zum Ausrüsten einer Waffe/Armor
router.post("/equipWeapon", equipWeaponController);
router.post("/equipArmor", equipArmorController);
// Route zum Entfernen einer Waffe/Armor
router.post("/removeWeapon", removeWeapon);
router.post("/removeArmor", removeArmor);
export default router;
