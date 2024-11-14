import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

// Deine weiteren Importe hier ...
import { login } from "./utils/login.js";
import { protect } from "./utils/protected.js";
import { register } from "./utils/register.js";
import { weaponImport } from "./utils/weaponimport.js";
import { itemImport } from "./utils/itemimport.js";
import { armorImport } from "./utils/armorimport.js";
import { materials } from "./utils/materialimport.js";
import { enemyImport } from "./data/enemies/enemyimport.js";
import { battle } from "./controllers/battlecontroller.js";
import { createCharacter } from "./data/character/characterCreation.js";
import { authenticate } from "./routes/authMiddleware.js";
import craftingRoute from "./routes/crafting.js"; // Crafting-Route importieren

// Initialisiere Express
const app = express();

// Middleware, um JSON-Daten zu verarbeiten
app.use(express.json());

// CORS konfigurieren
app.use(cors());

// MongoDB-Verbindung herstellen
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MongoDB URI nicht gefunden. Bitte in der .env Datei setzen.");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("Mit MongoDB verbunden"))
  .catch((error) => console.error("MongoDB Verbindungsfehler:", error));

// Routen definieren
app.post("/register", register);
app.post("/login", login);
app.get("/protected", protect);

// Crafting-Route einbinden
app.use("/api", craftingRoute);

// Weitere Routen hier, falls vorhanden
app.get("/weapons", weaponImport);
app.get("/armor", armorImport);
app.get("/item", itemImport);
app.post("/materials", materials);
app.get("/enemy", enemyImport);
app.post("/battle", battle);
app.post("/createCharacter", createCharacter);

// Öffentlich zugängliche Dateien
app.use(express.static(path.resolve("public")));

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
