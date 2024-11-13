import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import Enemy from "./enemy.js";

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function enemyImport(req, res) {
  try {
    // JSON-Daten aus enemy.json laden
    const enemyData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, ".", "enemy.json"),
        "utf-8"
      )
    );

    // Überprüfen, ob die Verbindung besteht
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: "Keine Datenbankverbindung" });
    }

    // Speichern der Daten in der MongoDB
    const docs = await Enemy.insertMany(enemyData);
    console.log("Gegner erfolgreich importiert:", docs);

    res.status(200).json({ message: "Gegner erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Gegner:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Gegner" });
  }
}
