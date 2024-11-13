// Logik für das Crafting-System
import CraftingItem from "./craftingItem.js";
import Account from "./account.js"; // Beispiel für ein Account-Schema

export const craftItem = async (accountId, itemId) => {
  try {
    const item = await CraftingItem.findById(itemId);
    const account = await Account.findById(accountId);

    if (account.materials < item.cost) {
      throw new Error("Nicht genügend Materialien");
    }

    account.materials -= item.cost; // Materialien abziehen
    await account.save();

    return { success: true, item: item.name };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
