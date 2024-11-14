// controllers/characterController.js

import { equipWeapon } from "../utils/stat_updater/statupdater.js";

export async function equipWeaponController(req, res) {
  try {
    const { characterId, weaponId } = req.body;
    const updatedCharacter = await equipWeapon(characterId, weaponId);
    res.json({
      message: "Waffe erfolgreich ausgerüstet",
      character: updatedCharacter,
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Ausrüsten der Waffe", error });
  }
}
