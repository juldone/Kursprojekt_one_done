import mongoose from "mongoose";

// Charakter-Schema
const characterSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  accountId: { type: String, required: true }, // Verweis auf die Account-ID
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
  stats: {
    hp: { type: Number, default: 100 },
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 5 },
  },
  equipment: {
    armor: {
      head: { type: String, default: null },
      chest: { type: String, default: null },
      hands: { type: String, default: null },
      legs: { type: String, default: null },
    },
    weapon: { type: String, default: null },
  },
});

// Charakter-Modell exportieren
const Character = mongoose.model("Character", characterSchema);

export default Character;
