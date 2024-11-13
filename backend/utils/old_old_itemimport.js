// itemimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Item from "../data/Items/items.js"; // Modell korrekt importieren
import connectDB from "../db.js"; // Importiere die zentrale DB-Verbindung

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function itemImport(req, res) {
  try {
    // Verbindung zur DB herstellen (nur einmal)
    await connectDB();

    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const itemData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "Items", "items.json"),
        "utf-8"
      )
    );

    // Überprüfe, ob die importierten IDs bereits in der Datenbank existieren
    const existingIds = await Item.find({
      id: { $in: itemData.map((item) => item.id) },
    }).select("id");

    // Erstelle eine Liste der bereits existierenden IDs in der DB
    const existingIdsSet = new Set(existingIds.map((item) => item.id));
    const newItemData = itemData.filter((item) => !existingIdsSet.has(item.id));

    // Wenn keine neuen Items vorhanden sind
    if (newItemData.length === 0) {
      return res.status(400).json({
        message:
          "Keine neuen Items zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Daten in der MongoDB speichern
    const docs = await Item.insertMany(newItemData);
    console.log("Items erfolgreich importiert:", docs);

    // Erfolgsmeldung senden
    res.status(200).json({ message: "Items erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Items:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Items" });
  }
}
