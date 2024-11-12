import mongoose from "mongoose";

// Waffenschema
const weaponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wea_id: { type: Number, required: true },
  type: {
    type: String,
    enum: ["artefakte", "axt", "bogen", "schwerter"],
    required: true,
  },
  damage: { type: Number, required: true },
  attributes: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
  },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    required: true,
  },
  price: { type: Number, required: true },
});

// Modelle für Waffen und Rüstungen erstellen und exportieren
const Weapon = mongoose.model("Weapon", weaponSchema);

export default { Weapon };
