import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import models from "../data/weapons.js"; // Importiere das gesamte Export-Objekt
import dotenv from "dotenv";
dotenv.config();

const { Weapon } = models; // Entnimm nur das `Weapon`-Modell

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function weaponImport(req, res) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error(
        "MongoDB URI nicht gefunden. Bitte in der .env Datei setzen."
      );
      process.exit(1);
    }

    mongoose
      .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDB verbunden"))
      .catch((error) => console.error("MongoDB Verbindungsfehler:", error));

    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const weaponData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "waffen.json"),
        "utf-8"
      )
    );

    // Speichern der Waffen-Daten in der MongoDB
    const docs = await Weapon.insertMany(weaponData);
    console.log("Waffen erfolgreich importiert:", docs);

    // Verbindung schließen und Erfolgsmeldung senden
    mongoose.connection.close();
    res.status(200).json({ message: "Waffen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Waffen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Waffen" });
  }
}
