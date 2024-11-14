import User from "../models/user.js";
import { getRandomRarity } from "../utils/chanceTable.js";
import fs from "fs";
import path from "path";
import Armor from "../data/armor.js";
import { createCraftingItem } from "../utils/craftingUtils.js"; // Nur createCraftingItem importieren
import { fileURLToPath } from "url";

// Hol den Pfad des aktuellen Moduls
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Der Pfad zur Waffen-Json-Datei (korrekt zusammengesetzt)
const weaponsPath = path.join(__dirname, "..", "data", "waffen.json");

// Lade die JSON-Datei mit fs und parse sie
const weapons = JSON.parse(fs.readFileSync(weaponsPath, "utf8"));

// Prüfen, ob der Benutzer genug Materialien hat
function checkMaterials(userMaterials, materialCost) {
  for (const material in materialCost) {
    if (userMaterials[material] < materialCost[material]) {
      return false; // Nicht genug Materialien
    }
  }
  return true; // Genug Materialien
}

// Materialien vom Benutzer abziehen
function deductMaterials(userMaterials, materialCost) {
  for (const material in materialCost) {
    userMaterials[material] -= materialCost[material];
  }
  return userMaterials;
}

// Craft-Item Funktion: Erstellen eines Items und Hinzufügen zum Benutzer-Inventar
export async function craftItem(userId, itemName) {
  try {
    // Benutzer aus der Datenbank suchen
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Benutzer nicht gefunden" };
    }

    let item, itemType;
    let isWeapon = false;

    // Bestimmen, ob das Item eine Waffe oder eine Rüstung ist
    if (weapons[itemName]) {
      item = weapons[itemName];
      itemType = "weapon"; // Wenn es eine Waffe ist
      isWeapon = true;
    } else if (Armor[itemName]) {
      item = Armor[itemName];
      itemType = "armor"; // Wenn es eine Rüstung ist
    } else {
      return { success: false, message: "Item nicht gefunden" };
    }

    // Prüfen, ob der Benutzer genug Materialien hat
    const hasMaterials = checkMaterials(user.materials, item.materialCost);
    if (!hasMaterials) {
      return { success: false, message: "Deine Materialien reichen nicht aus" };
    }

    // Materialien abziehen
    user.materials = deductMaterials(user.materials, item.materialCost);

    // Rarität des Items bestimmen
    const rarity = getRandomRarity(); // Chance-Tabelle für die Rarität verwenden

    // Item erstellen basierend auf der Rarität
    const craftedItem = createCraftingItem({
      result: itemName,
      type: itemType,
      attack: isWeapon ? item.attack : 0,
      defense: !isWeapon ? item.defense : 0,
      recipe: item.materialCost,
    });

    // Das gecraftete Item ins Inventar des Benutzers hinzufügen
    user.inventory.push({ itemName: craftedItem.name, rarity });

    // Benutzer-Daten speichern
    await user.save();

    // Erfolgreiche Rückmeldung
    return {
      success: true,
      message: `Du hast ein ${craftedItem.name} von Qualität ${rarity} hergestellt!`,
      item: craftedItem,
    };
  } catch (error) {
    // Fehlerbehandlung
    console.error("Fehler beim Craften:", error);
    return { success: false, message: "Fehler beim Craften des Items" };
  }
}
