// itemimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Item from "../data/Items/items.js"; // Modell korrekt importieren
import connectDB from "../db.js"; // Benannte Importe für connectDB und disconnectDB

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function itemImport(req, res) {
  try {
    // Verbindung zur DB herstellen
    await connectDB();
    console.log("Datenbankverbindung erfolgreich hergestellt.");

    // Lade die JSON-Datei aus dem angegebenen Verzeichnis
    const itemData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "Items", "items.json"),
        "utf-8"
      )
    );
    console.log("Item-Daten erfolgreich aus JSON-Datei geladen.");

    // Überprüfen, ob es neue Items gibt, indem IDs verglichen werden
    const existingIds = await Item.find({
      id: { $in: itemData.map((item) => item.id) },
    }).select("id");

    const existingIdsSet = new Set(existingIds.map((item) => item.id));
    const newItemData = itemData.filter((item) => !existingIdsSet.has(item.id));

    // Prüfen und Rückmeldung, falls keine neuen Items vorhanden sind
    if (newItemData.length === 0) {
      const message =
        "Alle Items existieren bereits in der Datenbank. Keine neuen Items importiert.";
      console.log(message);
      return res.status(400).json({ message }); // Antwort an Postman senden
    }

    // Wenn neue Items vorhanden sind, erstelle Bulk-Operationen für die neuen Items
    const operations = newItemData.map((item) => ({
      updateOne: {
        filter: { id: item.id }, // Suche nach Items mit der gleichen ID
        update: { $set: item }, // Aktualisiere die Felder
        upsert: true, // Füge hinzu, falls nicht existierend
      },
    }));

    // Führe die Bulk-Operation aus, um neue Items hinzuzufügen
    const result = await Item.bulkWrite(operations);

    // Erfolgreiche Rückmeldung an den Client und Konsole
    const successMessage = `Neue Items erfolgreich importiert. Anzahl der importierten Items: ${result.nUpserted}`;
    console.log(successMessage);
    return res.status(200).json({
      message: successMessage, // Genaue Erfolgsmeldung mit importierten Items
      importedCount: result.nUpserted, // Anzahl der eingefügten Items
    });
  } catch (err) {
    // Fehler-Rückmeldung an den Client und Konsole
    const errorMessage = `Fehler beim Importieren der Items: ${err.message}`;
    console.error(errorMessage);
    return res.status(500).json({
      error: "Fehler beim Importieren der Items",
      details: err.message,
    });
  } finally {
    // Datenbankverbindung schließen und Konsole loggen
    await disconnectDB();
    console.log("Datenbankverbindung geschlossen.");
  }
}
