// craftingUtils.js
import { getRandomRarity } from "./chanceTable.js"; // Importiere die Chance-Tabelle

// Funktion zum Erstellen eines Crafting-Ergebnisses
export const createCraftingItem = (recipe) => {
  const rarity = getRandomRarity(); // Bestimme die Seltenheit basierend auf der Chance-Tabelle

  const baseItem = {
    name: `${rarity} ${recipe.result}`,
    type: recipe.type, // Waffen oder Rüstungen
    rarity: rarity,
    recipe: recipe.recipe,
  };

  // Skalierung von Angriff/Verteidigung je nach Seltenheit
  if (recipe.type === "weapon") {
    // Für Waffen
    baseItem.attack = recipe.attack;
    if (rarity === "Legendary") {
      baseItem.attack *= 3;
    } else if (rarity === "Epic") {
      baseItem.attack *= 2.5;
    } else if (rarity === "Rare") {
      baseItem.attack *= 2;
    } else if (rarity === "Uncommon") {
      baseItem.attack *= 1.5;
    }
  } else if (recipe.type === "armor") {
    // Für Rüstungen
    baseItem.defense = recipe.defense;
    if (rarity === "Legendary") {
      baseItem.defense *= 3;
    } else if (rarity === "Epic") {
      baseItem.defense *= 2.5;
    } else if (rarity === "Rare") {
      baseItem.defense *= 2;
    } else if (rarity === "Uncommon") {
      baseItem.defense *= 1.5;
    }
  }

  return baseItem;
};
