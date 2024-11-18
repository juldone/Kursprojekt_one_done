// weaponimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Weapon from "../data/weapons.js";
import connectDB from "../../db.js"; // Importiere die zentrale DB-Verbindung

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function weaponImport(req, res) {
  try {
    // Verbindung zur DB herstellen (nur einmal)
    await connectDB();

    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const weaponData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "waffen.json"),
        "utf-8"
      )
    );

    // Überprüfe, ob die importierten IDs bereits in der Datenbank existieren
    const existingIds = await Weapon.find({
      id: { $in: weaponData.map((weapon) => weapon.id) },
    }).select("id");

    // Erstelle eine Liste der bereits existierenden IDs in der DB
    const existingIdsSet = new Set(existingIds.map((weapon) => weapon.id));
    const newWeaponData = weaponData.filter(
      (weapon) => !existingIdsSet.has(weapon.id)
    );

    // Wenn keine neuen Waffen vorhanden sind
    if (newWeaponData.length === 0) {
      return res.status(400).json({
        message:
          "Keine neuen Waffen zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Daten in der MongoDB speichern
    const docs = await Weapon.insertMany(newWeaponData);
    console.log("Waffen erfolgreich importiert:", docs);

    // Erfolgsmeldung senden
    res.status(200).json({ message: "Waffen erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Waffen:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Waffen" });
  }
}
