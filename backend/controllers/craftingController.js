import User from "../models/User.js";
import CraftingItem from "../models/craftingItem.js";
import { getRandomRarity } from "../utils/chanceTable.js";
import Weapon from "../models/weapons.js"; // Angepasst, um auf Weapon zuzugreifen

export const craftItem = async (userId, itemName) => {
  try {
    const craftingItem = await CraftingItem.findOne({ itemName });

    if (!craftingItem) {
      throw new Error("Item not found for crafting.");
    }

    const user = await User.findById(userId);

    for (const [material, amount] of Object.entries(
      craftingItem.requiredMaterials
    )) {
      if (user.materials[material] < amount) {
        throw new Error(`Insufficient materials: ${material}`);
      }
    }

    for (const [material, amount] of Object.entries(
      craftingItem.requiredMaterials
    )) {
      user.materials[material] -= amount;
    }

    const rarity = getRandomRarity();

    const rarityMultipliers = {
      common: 1,
      uncommon: 1.5,
      rare: 2.0,
      epic: 2.5,
      legendary: 3.0,
    };

    // Finde eine zufällige Waffe für das Crafting
    const weapon = await Weapon.findOne({ name: craftingItem.itemName });

    if (!weapon) {
      throw new Error("Weapon not found in database.");
    }

    const adjustedAttack = weapon.baseAttack * rarityMultipliers[rarity];

    user.inventory.push({
      itemName: weapon.name,
      rarity,
      attack: adjustedAttack,
    });

    await user.save();

    return {
      success: true,
      message: `${itemName} crafted successfully as ${rarity} item!`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
