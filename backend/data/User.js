import mongoose from "mongoose";

// Benutzer-Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  accountId: { type: Number, required: true, unique: true },
  materials: {
    Holz: { type: Number, default: 0 },
    Stein: { type: Number, default: 0 },
    Metall: { type: Number, default: 0 },
  },
  weaponinventory: [
    {
      itemName: { type: String, required: true },
      type: { type: String, required: true },
      damage: { type: Number, required: true },
      rarity: { type: String }, // optional, falls es eine Rarität gibt
    },
  ],
  armorinventory: [
    {
      itemName: { type: String, required: true },
      type: { type: String, required: true },
      armor: { type: Number, required: true },
      rarity: { type: String }, // optional, falls es eine Rarität gibt
    },
  ],
  characters: [
    {
      characterId: { type: String, required: true }, // ID des Charakters
      name: { type: String, required: true, unique: true }, // Name des Charakters
      level: { type: Number, required: true, default: 1 }, // Level des Charakters
      stats: {
        hp: { type: Number, required: true, default: 100 }, // HP des Charakters
        attack: { type: Number, required: true, default: 10 }, // Angriffskraft
        defense: { type: Number, required: true, default: 5 }, // Verteidigungskraft
        speed: { type: Number, required: true, default: 5 }, // Geschwindigkeit
      },
      equipment: {
        weapon: { type: String, required: true, default: "Basis-Schwert" }, // Standardwaffe
        armor: {
          head: { type: String, required: true, default: "Basis-Helm" }, // Helm
          chest: { type: String, required: true, default: "Basis-Brustpanzer" }, // Brustpanzer
          hands: { type: String, required: true, default: "Basis-Handschuhe" }, // Handschuhe
          legs: { type: String, required: true, default: "Basis-Beinschützer" }, // Beinschützer
        },
      },
    },
  ],
});

// Verhindert die doppelte Kompilierung des Modells
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
