// userSchema ist die Datei wie es auf der Datenbank dann aussehen soll.

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
});

// Benutzer-Modell exportieren
const User = mongoose.model("User", userSchema);

export default User;
