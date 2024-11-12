// userSchema ist die Datei wie es auf der Datenbank dann aussehen soll.

import mongoose from "mongoose";

// Benutzer-Schema
const counterSchema = new mongoose.Schema({
  id: { type: String },
  sequenz: { type: Number },
});

// Benutzer-Modell exportieren
const autoincID = mongoose.model("autoincID", counterSchema);

export default autoincID;
