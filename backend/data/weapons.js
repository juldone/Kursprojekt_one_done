import mongoose from "mongoose";

// Waffenschema
const weaponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true }, // Sicherstellen, dass id einzigartig ist, falls nötig
  type: { type: String, required: true },
  damage: { type: Number, required: true },
  attributes: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
  },
});

// Modell für Waffen erstellen und exportieren
const Weapon = mongoose.model("Weapon", weaponSchema);

export default Weapon;
