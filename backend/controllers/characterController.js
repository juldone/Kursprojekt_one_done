// controllers/characterController.js

import {
  equipWeapon,
  unequipWeapon,
  equipArmor, // importiere die equipArmor-Funktion
  unequipArmor, // importiere die unequipArmor-Funktion
} from "../utils/stat_updater/statupdater.js";

// Route zum Ausrüsten einer Waffe
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

// Route zum Entfernen einer Waffe
export const removeWeapon = async (req, res) => {
  const { characterId, weaponId } = req.body;

  try {
    const updatedCharacter = await unequipWeapon(characterId, weaponId);
    res.status(200).json({
      message: "Waffe erfolgreich entfernt.",
      character: updatedCharacter,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Route zum Ausrüsten einer Rüstung
export async function equipArmorController(req, res) {
  try {
    const { characterId, armorId } = req.body;
    const updatedCharacter = await equipArmor(characterId, armorId);
    res.json({
      message: "Rüstung erfolgreich ausgerüstet",
      character: updatedCharacter,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Ausrüsten der Rüstung", error });
  }
}

// Route zum Entfernen einer Rüstung
export const removeArmor = async (req, res) => {
  const { characterId, armorId } = req.body;

  try {
    const updatedCharacter = await unequipArmor(characterId, armorId);
    res.status(200).json({
      message: "Rüstung erfolgreich entfernt.",
      character: updatedCharacter,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
