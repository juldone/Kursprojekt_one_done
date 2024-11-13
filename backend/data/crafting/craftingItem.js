// Importiere das Mongoose-Modul, um mit MongoDB zu interagieren
import mongoose from "mongoose";

// Definiere ein Schema für Crafting-Gegenstände mit Mongoose
// Das Schema legt die Struktur für die Dokumente fest, die in der MongoDB-Datenbank gespeichert werden
const craftingItemSchema = new mongoose.Schema({
  // Name des Gegenstands (erforderlich, vom Typ String)
  name: { type: String, required: true },

  // Materialien, die für das Crafting benötigt werden
  // Es ist ein Array von Strings, und jedes Material im Array ist erforderlich
  materials: [{ type: String, required: true }],

  // Materialkosten, die für das Herstellen des Gegenstands notwendig sind
  // Das Feld ist erforderlich und vom Typ Number
  cost: { type: Number, required: true },
});

// Erstelle ein Modell aus dem Schema mit dem Namen "CraftingItem"
// Ein Modell ist eine Klasse, die verwendet wird, um mit Dokumenten dieser Struktur in der Datenbank zu arbeiten
const CraftingItem = mongoose.model("CraftingItem", craftingItemSchema);

// Exportiere das Modell, um es in anderen Dateien zu verwenden
export default CraftingItem;
