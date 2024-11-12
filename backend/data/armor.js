import mongoose from "mongoose";

// Rüstungsschema
const armorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amr_id: { type: Number, required: true },
  type: {
    type: String,
    enum: ["kopf", "brust", "hände", "beine"],
    required: true,
  },
  defense: { type: Number, required: true },
  attributes: {
    health: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
  },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    required: true,
  },
  price: { type: Number, required: true },
});

const Armor = mongoose.model("Armor", armorSchema);
export default { Armor };
