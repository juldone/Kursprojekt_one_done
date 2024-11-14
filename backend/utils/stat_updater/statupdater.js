// utils/statsUpdater.js

import Character from "../../data/character/character.js";
import Weapon from "../../data/weapons.js";

export async function equipWeapon(characterId, weaponId) {
  // Lade den Charakter und die Waffe
  const character = await Character.findById(characterId);
  const weapon = await Weapon.findById(weaponId);

  if (!character || !weapon) {
    throw new Error("Charakter oder Waffe nicht gefunden");
  }

  // Aktualisiere die Stats basierend auf den Werten der Waffe
  character.stats.attack += weapon.damage;
  character.stats.strength =
    (character.stats.strength || 0) + weapon.attributes.strength;
  character.stats.agility =
    (character.stats.agility || 0) + weapon.attributes.agility;
  character.stats.intelligence =
    (character.stats.intelligence || 0) + weapon.attributes.intelligence;

  // Speichere die Änderungen
  character.equipment.weapon = weapon._id; // Waffe als ausgerüstet speichern
  await character.save();
  return character;
}
