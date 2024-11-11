import mongoose from "mongoose";

// Benutzer-Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Benutzer-Modell exportieren
const User = mongoose.model("User", userSchema);

module.exports = User;
