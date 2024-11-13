import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { login } from "./utils/login.js";
import { protect } from "./utils/protected.js";
import { register } from "./utils/register.js";
import { weaponImport } from "./utils/weaponimport.js";
import { itemImport } from "./utils/itemimport.js";
import { armorImport } from "./utils/armorimport.js";
import { materials } from "./utils/materialimport.js";

const app = express();
app.use(express.json());
app.use(cors());
// MongoDB-Verbindung herstellen
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MongoDB URI nicht gefunden. Bitte in der .env Datei setzen.");
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB verbunden"))
  .catch((error) => console.error("MongoDB Verbindungsfehler:", error));

// Registrierungs-Route
app.post("/register", register);

// Login-Route
app.post("/login", login);

// Geschützte Route
app.get("/protected", protect);

// Statische Dateien bereitstellen
app.use(express.static(path.resolve("public")));

// Route zum Abrufen aller Waffen
app.get("/weapons", weaponImport); // /weapons, Weapon
// Route zum Abrufen aller Armor
app.get("/armor", armorImport);
// Route zum Abrufen aller Items
app.get("/item", itemImport);

// Verbinde die Material-Route
app.post("/materials", materials);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
