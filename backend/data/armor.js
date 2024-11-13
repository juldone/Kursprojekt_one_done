import mongoose from "mongoose";

// Rüstungsschema
const armorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
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
});

const Armor = mongoose.model("Armor", armorSchema);
export default Armor;
