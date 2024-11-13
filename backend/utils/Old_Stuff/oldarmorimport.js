import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import models from "../../data/armor.js"; // Importiert das gesamte Export-Objekt

const { Armor } = models; // Entnimm nur das `Armor`-Modell

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function armorImport(req, res) {
  try {
    // JSON-Daten aus armor.json laden
    const armorData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "armor.json"),
        "utf-8"
      )
    );

    // Überprüfen, ob die Verbindung besteht
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: "Keine Datenbankverbindung" });
    }

    // Speichern der Daten in der MongoDB
    const docs = await Armor.insertMany(armorData);
    console.log("Rüstungen erfolgreich importiert:", docs);

    res.status(200).json({ message: "Rüstungen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Rüstungen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Rüstungen" });
  }
}
