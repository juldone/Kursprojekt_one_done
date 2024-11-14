import mongoose from "mongoose";

const craftingItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  requiredMaterials: {
    Holz: { type: Number, required: true, default: 0 },
    Stein: { type: Number, required: true, default: 0 },
    Metall: { type: Number, required: true, default: 0 },
  },
  rarity: { type: String, default: "common" },
  type: { type: String, required: true }, // 'weapon' oder 'armor'
  baseAttack: { type: Number, default: 0 }, // Basisangriff für Waffen
  baseDefence: { type: Number, default: 0 }, // Basisverteidigung für Rüstung
});

const CraftingItem = mongoose.model("CraftingItem", craftingItemSchema);

export default CraftingItem;
