import mongoose from "mongoose";

// Waffenschema
const recipeSchema = new mongoose.Schema({
  recipeId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  damage: { type: Number, required: true },
  rarity: { type: String, required: true },
  materials: {
    Holz: { type: Number, default: 0 },
    Stein: { type: Number, default: 0 },
    Metall: { type: Number, default: 0 },
  },
});

// Modell für Waffen erstellen und exportieren
const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
