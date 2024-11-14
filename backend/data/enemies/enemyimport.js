// enemyimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Enemy from "./enemy.js";
import connectDB from "../../db.js";

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function enemyImport(req, res) {
  try {
    // Verbindung zur DB herstellen (nur einmal)
    await connectDB();

    // JSON-Daten aus enemy.json laden
    const enemyData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, ".", "enemy.json"),
        "utf-8"
      )
    );

    // Überprüfe, ob die importierten IDs bereits in der Datenbank existieren
    const existingIds = await Enemy.find({
      id: { $in: enemyData.map((enemy) => enemy.id) },
    }).select("id");

    // Erstelle eine Liste der bereits existierenden IDs in der DB
    const existingIdsSet = new Set(existingIds.map((enemy) => enemy.id));
    const newEnemyData = enemyData.filter(
      (enemy) => !existingIdsSet.has(enemy.id)
    );

    // Wenn keine neuen Enemys vorhanden sind
    if (newEnemyData.length === 0) {
      return res.status(400).json({
        message:
          "Keine neuen Waffen zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Daten in der MongoDB speichern
    const docs = await Enemy.insertMany(newEnemyData);
    console.log("Enemys erfolgreich importiert:", docs);

    // Erfolgsmeldung senden
    res.status(200).json({ message: "Enemys erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Enemys:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Enemys" });
  }
}
