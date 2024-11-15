import Character from "../../data/character/character.js";
import Weapon from "../../data/weapons.js";
import Armor from "../../data/armor.js";

// Funktion zum Ausrüsten einer Rüstung
export async function equipArmor(characterId, armorId) {
  const character = await Character.findById(characterId);
  const armor = await Armor.findById(armorId);

  if (!character || !armor) {
    throw new Error("Charakter oder Rüstung nicht gefunden");
  }

  // Überprüfe den Typ der Rüstung und aktualisiere die entsprechenden Werte
  if (armor.type === "kopf" && !character.equipment.armor.head) {
    character.stats.health += armor.attributes.health;
    character.stats.defense += armor.attributes.defense;
    character.equipment.armor.head = armor.name; // Helm ausrüsten
  } else if (armor.type === "brust" && !character.equipment.armor.chest) {
    character.stats.health += armor.attributes.health;
    character.stats.defense += armor.attributes.defense;
    character.equipment.armor.chest = armor.name; // Brustplatte ausrüsten
  } else if (armor.type === "hände" && !character.equipment.armor.hands) {
    character.stats.health += armor.attributes.health;
    character.stats.defense += armor.attributes.defense;
    character.equipment.armor.hands = armor.name; // Handschuhe ausrüsten
  } else if (armor.type === "beine" && !character.equipment.armor.legs) {
    character.stats.health += armor.attributes.health;
    character.stats.defense += armor.attributes.defense;
    character.equipment.armor.legs = armor.name; // Beine ausrüsten
  }

  await character.save();
  return character;
}

// Funktion zum Entfernen einer Rüstung
export async function unequipArmor(characterId, armorId) {
  const character = await Character.findById(characterId);
  const armor = await Armor.findById(armorId);

  if (!character || !armor) {
    throw new Error("Charakter oder Rüstung nicht gefunden");
  }

  // Überprüfe den Typ der Rüstung und entferne, wenn sie ausgerüstet ist
  if (armor.type === "kopf" && character.equipment.armor.head === armor.name) {
    character.stats.health -= armor.attributes.health;
    character.stats.defense -= armor.attributes.defense;
    character.equipment.armor.head = null; // Helm entfernen
  } else if (
    armor.type === "brust" &&
    character.equipment.armor.chest === armor.name
  ) {
    character.stats.health -= armor.attributes.health;
    character.stats.defense -= armor.attributes.defense;
    character.equipment.armor.chest = null; // Brustplatte entfernen
  } else if (
    armor.type === "hände" &&
    character.equipment.armor.hands === armor.name
  ) {
    character.stats.health -= armor.attributes.health;
    character.stats.defense -= armor.attributes.defense;
    character.equipment.armor.hands = null; // Handschuhe entfernen
  } else if (
    armor.type === "beine" &&
    character.equipment.armor.legs === armor.name
  ) {
    character.stats.health -= armor.attributes.health;
    character.stats.defense -= armor.attributes.defense;
    character.equipment.armor.legs = null; // Beine entfernen
  } else {
    throw new Error("Diese Rüstung ist nicht ausgerüstet.");
  }

  await character.save();
  return character;
}

// Funktion zum Ausrüsten einer Waffe
export async function equipWeapon(characterId, weaponId) {
  const character = await Character.findById(characterId);
  const weapon = await Weapon.findById(weaponId);

  if (!character || !weapon) {
    throw new Error("Charakter oder Waffe nicht gefunden");
  }

  if (character.equipment.weapon === weapon.name) {
    throw new Error("Diese Waffe ist bereits ausgerüstet");
  }

  character.stats.attack += weapon.damage;
  character.stats.strength =
    (character.stats.strength || 0) + weapon.attributes.strength;
  character.stats.agility =
    (character.stats.agility || 0) + weapon.attributes.agility;
  character.stats.intelligence =
    (character.stats.intelligence || 0) + weapon.attributes.intelligence;

  character.equipment.weapon = weapon.name;
  await character.save();
  return character;
}

// Funktion zum Entfernen einer Waffe
export async function unequipWeapon(characterId, weaponId) {
  const character = await Character.findById(characterId);
  const weapon = await Weapon.findById(weaponId);

  if (!character || !weapon) {
    throw new Error("Charakter oder Waffe nicht gefunden");
  }

  if (character.equipment.weapon !== weapon.name) {
    throw new Error("Diese Waffe ist nicht ausgerüstet.");
  }

  character.stats.attack -= weapon.damage;
  character.stats.strength -= weapon.attributes.strength;
  character.stats.agility -= weapon.attributes.agility;
  character.stats.intelligence -= weapon.attributes.intelligence;

  character.equipment.weapon = null;
  await character.save();
  return character;
}
