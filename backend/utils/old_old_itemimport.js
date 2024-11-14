// itemimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Item from "../data/Items/items.js"; // Modell korrekt importieren
import { connectDB, disconnectDB } from "../db.js"; // Benannte Importe für connectDB und disconnectDB

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

    // Überprüfen, ob es überhaupt neue Items gibt (Vergleiche IDs in der DB)
    const existingIds = await Item.find({
      id: { $in: itemData.map((item) => item.id) },
    }).select("id");

    const existingIdsSet = new Set(existingIds.map((item) => item.id));
    const newItemData = itemData.filter((item) => !existingIdsSet.has(item.id));

    // Wenn keine neuen Items vorhanden sind
    if (newItemData.length === 0) {
      return res.status(200).json({
        message:
          "Keine neuen Items zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Erstelle ein Array von Update-Operationen für die neuen Items (mit upsert)
    const operations = newItemData.map((item) => ({
      updateOne: {
        filter: { id: item.id }, // Suche nach Items mit der gleichen ID
        update: { $set: item }, // Aktualisiere die Felder
        upsert: true, // Wenn das Item nicht existiert, füge es hinzu
      },
    }));

    // Führe die Bulk-Operation aus, um Duplikate zu vermeiden
    const result = await Item.bulkWrite(operations);

    // Erfolgreiche Rückmeldung an den Client
    return res.status(200).json({
      message: "Items erfolgreich importiert",
      result,
    });
  } catch (err) {
    // Fehler-Rückmeldung an den Client
    return res.status(500).json({
      error: "Fehler beim Importieren der Items",
      details: err.message,
    });
  } finally {
    // Datenbankverbindung schließen und Rückmeldung an den Client geben
    await disconnectDB();
  }
}
