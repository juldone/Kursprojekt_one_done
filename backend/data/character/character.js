import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  characterId: { type: String, required: true, unique: true }, // _id als String (UUID)
  accountId: { type: Number, required: true },
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 12,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
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

// Überprüfe, ob das Modell bereits existiert, bevor du es erstellst
const Character =
  mongoose.models.Character || mongoose.model("Character", characterSchema);

export default Character;
