// craftingSystem.js
import { getRandomRarity } from "./chanceTable.js";

const items = ["Waffe", "Rüstung"];

export function craftRandomItem() {
  const itemType = items[Math.floor(Math.random() * items.length)];
  const rarity = getRandomRarity();
  return { itemType, rarity };
}
