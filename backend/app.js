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
import { craftItem } from "./controllers/craftingController.js";

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

// Crafting-Route
// Zum Testen:
// {
//   "userId": "user_id_aus_der_datenbank",
//   "itemName": "Schwert"
// }
app.post("/craft", async (req, res) => {
  const { userId, itemName } = req.body;

  try {
    const result = await craftItem(userId, itemName);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Fehler beim Crafting:", error);
    res
      .status(500)
      .json({ success: false, message: "Fehler beim Craften des Items" });
  }
});

//app.post("/craft/:1/:1000") => Drachenklauen Axt wird gecraftet
// Ist ein Seperater Button in dem Crafting Interface ( Seite )

// Charakter erstellen (Hier wird die createCharacter-Funktion aus characterCreation.js aufgerufen)
// Zum Testen der character erstellung
// {
//   "accountId": "1",
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

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
