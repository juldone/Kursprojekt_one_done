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
import { enemyImport } from "./data/enemies/enemyimport.js";
import { battle } from "./controllers/battlecontroller.js";
import { createCharacter } from "./data/character/characterCreation.js"; // Pfad nach Ordnerumstrukturierung aktualisiert.
import { craftItem } from "./controllers/craftingController.js";
import { authenticate } from "./routes/authMiddleware.js";

// Initialisiere Express
const app = express();

// Middleware, um JSON-Daten zu verarbeiten
app.use(express.json());

// CORS konfigurieren, falls erforderlich
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

// Registrierung und Login
app.post("/register", register);
app.post("/login", login);

// Geschützte Route (z.B. nach Login)
app.get("/protected", protect);

// Crafting-System (Zufälliges Item generieren)
app.get("/craft", authenticate, async (req, res) => {
  const { userId, itemName } = req.query; // Abfrage von userId und itemName aus der Anfrage
  try {
    const result = await craftItem(userId, itemName); // Aufruf der richtigen Funktion
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Craften des Items", error: error.message });
  }
});

// Waffen-Import
app.get("/weapons", weaponImport);

// Armor-Import
app.get("/armor", armorImport);

// Route zum Abrufen aller Items
app.get("/item", itemImport);

// Materialien-Import
app.post("/materials", materials);

// Gegner importieren
app.get("/enemy", enemyImport);

// Kampf-Route
app.post("/battle", battle);

// Charakter erstellen
app.post("/createCharacter", createCharacter); // Diese Route ist für die Erstellung eines Charakters

// Öffentlich zugängliche Dateien aus dem "public"-Verzeichnis bereitstellen
app.use(express.static(path.resolve("public")));

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// Fehlerbehandlung für unerwartete Fehler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Etwas ist schief gelaufen!");
});
