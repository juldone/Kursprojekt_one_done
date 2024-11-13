// weaponimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../db.js"; // Importiere die zentrale DB-Verbindung

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function armorImport(req, res) {
  try {
    // Verbindung zur DB herstellen (nur einmal)
    await connectDB();

    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const armorData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "armor.json"),
        "utf-8"
      )
    );

    // Überprüfe, ob die importierten IDs bereits in der Datenbank existieren
    const existingIds = await armor
      .find({
        id: { $in: armorData.map((armor) => armor.id) },
      })
      .select("id");

    // Erstelle eine Liste der bereits existierenden IDs in der DB
    const existingIdsSet = new Set(existingIds.map((armor) => armor.id));
    const newArmorData = armorData.filter(
      (weapon) => !existingIdsSet.has(armor.id)
    );

    // Wenn keine neuen Waffen vorhanden sind
    if (newArmorData.length === 0) {
      return res.status(400).json({
        message:
          "Keine neuen Rüstungen zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Daten in der MongoDB speichern
    const docs = await Armor.insertMany(newArmorData);
    console.log("Rüstungen erfolgreich importiert:", docs);

    // Erfolgsmeldung senden
    res.status(200).json({ message: "Rüstungen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Rüstungen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Rüstungen" });
  }
}
