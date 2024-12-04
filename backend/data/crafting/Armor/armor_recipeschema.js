import mongoose from "mongoose";

// ArmorSchema
const recipeSchema = new mongoose.Schema({
  recipeId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  armor: { type: Number, required: true },
  rarity: { type: String },
  materials: {
    Holz: { type: Number, default: 0 },
    Stein: { type: Number, default: 0 },
    Metall: { type: Number, default: 0 },
  },
});

// Modell für Rüstung erstellen und exportieren

const ArmorRecipe =
  mongoose.models.ARmorRecipe || mongoose.model("ArmorRecipe", recipeSchema);

export default ArmorRecipe;
