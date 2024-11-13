//Mongoose-Schema für Crafting-Gegenstände):
import mongoose from "mongoose";

const craftingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  materials: [{ type: String, required: true }], // Liste der benötigten Materialien
  cost: { type: Number, required: true }, // Materialkosten
});

const CraftingItem = mongoose.model("CraftingItem", craftingItemSchema);
export default CraftingItem;
