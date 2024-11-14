import mongoose from "mongoose"; // Importiere die Mongoose-Bibliothek, die für die Arbeit mit MongoDB verwendet wird

// Definiere das Schema für ein Crafting-Item
const craftingItemSchema = new mongoose.Schema({
  // Name des Crafting-Items (z.B. "Schwert der Zerstörung")
  name: { type: String, required: true }, // Der Name ist erforderlich

  // Der Typ des Crafting-Items, z.B. "Weapon" für Waffen oder "Armor" für Rüstungen
  type: { type: String, required: true }, // Der Typ ist ebenfalls erforderlich

  // Das Rezept des Items, das Material und die Menge enthält, die benötigt werden
  recipe: [
    {
      material: { type: String, required: true }, // Der Name des Materials, das zum Craften des Items benötigt wird (z.B. "Holz")
      amount: { type: Number, required: true }, // Die Menge des Materials, die benötigt wird (z.B. 5)
    },
  ],

  // Das Ergebnis des Crafting-Vorgangs, also der Name des hergestellten Items (z.B. "Schwert der Zerstörung")
  result: { type: String, required: true }, // Das Ergebnis ist ebenfalls erforderlich

  // Die Seltenheit des Items, z.B. "common", "uncommon", "rare", "epic", "legendary"
  // Dies ist optional, je nachdem, ob du die Seltenheit verwenden möchtest
  rarity: { type: String, required: true }, // Seltenheit ist erforderlich
});

// Erstelle das Modell für Crafting-Items basierend auf dem Schema
const CraftingItem = mongoose.model("CraftingItem", craftingItemSchema);

// Exportiere das Modell, damit es in anderen Teilen der Anwendung verwendet werden kann
export default CraftingItem;
