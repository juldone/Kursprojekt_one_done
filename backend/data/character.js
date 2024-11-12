import mongoose from "mongoose";

// Charakter-Schema

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  level: { type: Number, required: true, default: 1 },
  stats: {
    hp: { type: Number, required: true, default: 100 },
    attack: { type: Number, required: true, default: 10 },
    defense: { type: Number, required: true, default: 5 },
    speed: { type: Number, required: true, default: 5 },
  },
  equipment: {
    armor: {
      head: { type: String, required: false },
      chest: { type: String, required: false },
      hands: { type: String, required: false },
      legs: { type: String, required: false },
    },
    weapon: { type: String, required: false },
  },
});

// Charakter-Modell exportieren

const Character = mongoose.model("Character", characterSchema);

export default Character;
