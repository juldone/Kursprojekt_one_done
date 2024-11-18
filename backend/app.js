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
import { authenticate } from "./routes/authMiddleware.js";
import characterRoutes from "./routes/characterRoutes.js";
import User from "./data/User.js";

import { weaponrecipeImport } from "./data/crafting/Weapon/waffen_recipeimport.js";
import { armorrecipeImport } from "./data/crafting/Armor/armor_recipeimport.js";
import craftingRoutes from "./routes/craftingRoutes.js"; // Import der Crafting-Routen chatty -

import Character from "./data/character/character.js";

// Initialisiere Express
const app = express();

// Middleware, um JSON-Daten zu verarbeiten
app.use(express.json());

// CORS konfigurieren
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend URL anpassen
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// CORS konfigurieren
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend URL anpassen
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
// Für die Registrierung das Frontend launchen das
app.post("/register", register);
app.post("/login", login);

// Geschützte Route (z.B. nach Login)
app.get("/protected", protect);

// Crafting-System (Zufälliges Item generieren)
app.get("/craft", authenticate, (req, res) => {
  const result = craftRandomItem();
  res.json({
    message: `Du hast ein ${result.rarity} ${result.itemType} erhalten!`,
  });
});

// Waffen-Import
app.get("/weapons", weaponImport);

// Waffen-Rezepte Import
app.get("/wrezepte", weaponrecipeImport);

// Armor-Rezepte Import
app.get("/arezepte", armorrecipeImport);

// Armor-Import
app.get("/armor", armorImport);
// Route zum Abrufen aller Items
app.get("/item", itemImport);

// Materialien-Import
// Zum testen =
// {
//   "accountId": 1,
//   "materialType": "Holz",
//   "amount": 100
// }

app.post("/materials", materials);

app.get("/enemy", enemyImport);

// Füge die Kampf-Route hinzu
// Zum Testen :

// {
//   "characterId": "charakter_id_aus_der_datenbank",
//   "enemyId": 6000
// }

app.post("/battle", battle);

// Charakter erstellen (Hier wird die createCharacter-Funktion aus characterCreation.js aufgerufen)
// Zum Testen der character erstellung
// {
//   "accountId": 1,
//   "name": "Horst",
//   "level": 1,
//   "stats": {
//     "hp": 150,
//     "attack": 20,
//     "defense": 10,
//     "speed": 8
//   },
//   "equipment": {
//     "weapon": "Schwert",
//     "armor": {
//       "head": "Helm",
//       "chest": "Brustpanzer",
//       "hands": "Handschuhe",
//       "legs": "Beinschützer"
//     }
//   }
// }

app.post("/createCharacter", createCharacter); // Diese Route ist für die Erstellung eines Charakters

// Öffentlich zugängliche Dateien aus dem "public"-Verzeichnis bereitstellen
app.use(express.static(path.resolve("public")));

//localhost:3000/character/equipWeapon
//                        /equipArmor
//                        /removeWeapon
//                        /removeArmor
//{
// "characterId" : "ObjectId",
// armor/weaponId "ObjectId"
//}
app.use("/character", characterRoutes);

// Registriere die Crafting-Routen

// /crafting/wpncraft
// /crafting/armcraft

app.use("/user/:accountId/crafting", craftingRoutes);

app.get("/user/:accountId", authenticate, async (req, res) => {
  try {
    const { accountId } = req.params;

    // Abruf des Benutzers
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Abruf der Charaktere des Benutzers
    const characters = await Character.find({ accountId });

    console.log("Benutzerdaten aus der Datenbank:", user); // Debug-Ausgabe
    console.log("Charakterdaten aus der Datenbank:", characters); // Debug-Ausgabe

    res.json({
      accountId: user.accountId,
      username: user.userName,
      character_id: characters,
      materials: user.materials, // Materialien aus der Datenbank
      weapopninventory: user.weaponinventory, // Dein Inventar
      armorinventory: user.armorinventory,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzerdaten" });
  }
});

//localhost:3000/character/equipWeapon
//                        /equipArmor
//                        /removeWeapon
//                        /removeArmor
//{
// "characterId" : "ObjectId",
// armor/weaponId "ObjectId"
//}
app.use("/character", characterRoutes);

// Route im Backend für den Benutzer:
app.get("/user/:accountId", authenticate, async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await User.findOne({ accountId });
    // const character = await Character.findOne({characterId})
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    console.log("Benutzerdaten aus der Datenbank:", user); // Ausgabe der Benutzerdaten

    res.json({
      accountId: user.accountId,
      username: user.userName,
      materials: user.materials, // Materialien aus der Datenbank
      inventory: user.inventory, // Dein Inventar
      characters: characterRoutes((char) => ({
        id: char._id,
        name: char.name,
        level: char.level,
        stats: char.stats,
        equipment: char.equipment,
      })), // Charakterdaten
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzerdaten" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
