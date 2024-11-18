import express from "express";
import {
  equipArmorController,
  equipWeaponController,
  removeArmor,
  removeWeapon,
} from "../controllers/characterController.js";
import { createCharacter } from "../data/character/characterCreation.js";

const router = express.Router();

// Definiere den POST-Route für die Charaktererstellung

// {
//   "accountId": deine AccountID,
//   "name": "Jesus",
//   "level": 1,
//   "stats": {
//     "hp": 150,
//     "attack": 20,
//     "defense": 10,
//     "speed": 8
//   },
//   "equipment": {
//     "weapon": "Schwert",
//     "armor": {
//       "head": "Helm",
//       "chest": "Brustpanzer",
//       "hands": "Handschuhe",
//       "legs": "Beinschützer"
//     }
//   }
// }

router.post("/createCharacter", createCharacter);
// Route zum Ausrüsten einer Waffe/Armor
router.post("/equipWeapon", equipWeaponController);
router.post("/equipArmor", equipArmorController);
// Route zum Entfernen einer Waffe/Armor
router.post("/removeWeapon", removeWeapon);
router.post("/removeArmor", removeArmor);
export default router;
