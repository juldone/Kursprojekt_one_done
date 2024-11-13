import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import models from "../../data/Items/items.js"; // Importiert das gesamte Export-Objekt

const { Item } = models; // Entnimm nur das `Item`-Modell

// __dirname in ES-Modulen erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function itemImport(req, res) {
  try {
    // JSON-Daten aus items.json laden
    const itemData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "..", "data", "Items", "items.json"),
        "utf-8"
      )
    );

    // Überprüfen, ob die Verbindung besteht
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: "Keine Datenbankverbindung" });
    }

    // Speichern der Daten in der MongoDB
    const docs = await Item.insertMany(itemData);
    console.log("Items erfolgreich importiert", docs);

    res.status(200).json({ message: "Items erfolgreich importiert", docs });
  } catch (err) {
    console.error("Fehler beim Importieren der Items:", err);
    res.status(500).json({ error: "Fehler beim Importieren der Items" });
  }
}
