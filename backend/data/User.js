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
      damage: { type: Number, required: true },
      rarity: { type: String }, // optional, falls es eine Rarität gibt
    },
  ],
  armorinventory: [
    {
      itemName: { type: String, required: true },
      armor: { type: Number, required: true },
      rarity: { type: String }, // optional, falls es eine Rarität gibt
    },
  ],
});

// Verhindert die doppelte Kompilierung des Modells
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
