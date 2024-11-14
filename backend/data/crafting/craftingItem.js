import mongoose from "mongoose";

const craftingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // z. B. "Weapon" oder "Armor"
  recipe: [
    {
      material: { type: String, required: true }, // z. B. "Holz"
      amount: { type: Number, required: true }, // z. B. 5
    },
  ],
  result: { type: String, required: true }, // z. B. "Schwert der Zerstörung"
  rarity: { type: String, required: true }, // optional, falls nötig
});

const CraftingItem = mongoose.model("CraftingItem", craftingItemSchema);

export default CraftingItem;
