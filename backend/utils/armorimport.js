import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import models from "../data/armor.js"; // Importiere das gesamte Export-Objekt

const { Armor } = models; // Entnimm nur das `Weapon`-Modell

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function armorImport(req, res) {
  try {
    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const armorData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "armor.json"),
        "utf-8"
      )
    );

    // Speichern der Waffen-Daten in der MongoDB
    const docs = await Armor.insertMany(armorData);
    console.log("Waffen erfolgreich importiert:", docs);

    // Verbindung schließen und Erfolgsmeldung senden
    mongoose.connection.close();
    res.status(200).json({ message: "Waffen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Waffen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Waffen" });
  }
}
