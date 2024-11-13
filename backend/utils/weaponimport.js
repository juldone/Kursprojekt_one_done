import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import models from "../data/weapons.js"; // Importiert das gesamte Export-Objekt

const { Weapon } = models; // Entnimm nur das 'Weapon' - Modell

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function weaponImport(req, res) {
  try {
    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const weaponData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "waffen.json"),
        "utf-8"
      )
    );

    // Überprüfe, ob die Verindung besteht
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: "keine Datenbankverbindung" });
    }

    // Daten in der MongoDB speichern
    const docs = await Weapon.insertMany(weaponData);
    console.log("Waffen erfolgreich importiert:", docs);

    // Erfolgsmeldung senden
    res.status(200).json({ message: "Waffen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Waffen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Waffen" });
  }
}
