// userSchema ist die Datei wie es auf der Datenbank dann aussehen soll.

import mongoose from "mongoose";

// Benutzer-Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  uniqueAccID: { type: Number, required: true, unique: true },
});

// Benutzer-Modell exportieren
const User = mongoose.model("User", userSchema);

export default User;
