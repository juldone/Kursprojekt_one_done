import mongoose from "mongoose";

// Definieren des Mongoose-Schemas für die Ausrüstungsgegenstände
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  id: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["headgear", "chestarmor", "pants", "shoes"], // Definiert den Typ des Items
    required: true,
  },

  attributes: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
  },
});

// Modelle für Items exportieren
const Item = mongoose.model("Item", itemSchema);

export default { Item };
