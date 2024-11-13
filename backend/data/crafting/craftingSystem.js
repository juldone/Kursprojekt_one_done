// Importiere die Funktion `getRandomRarity` aus der Datei "chanceTable.js".
// Diese Funktion wird verwendet, um eine zufällige Seltenheit für das gecraftete Item zu bestimmen.
import { getRandomRarity } from "../../utils/chanceTable.js";

// Definiere ein Array `items`, das die möglichen Arten von gecrafteten Gegenständen enthält.
// In diesem Fall kann entweder eine "Waffe" oder eine "Rüstung" gecraftet werden.
const items = ["Waffe", "Rüstung"];

// Exportiere die Funktion `craftRandomItem`, die ein zufälliges Item erzeugt.
// Diese Funktion kann in anderen Modulen importiert und aufgerufen werden.
export function craftRandomItem() {
  // Bestimme den Typ des Items (`itemType`), indem ein zufälliger Eintrag aus dem Array `items` ausgewählt wird.
  // `Math.random()` generiert eine Zufallszahl zwischen 0 und 1, multipliziert mit der Länge von `items` (2),
  // ergibt einen zufälligen Index (0 oder 1) für das Array.
  const itemType = items[Math.floor(Math.random() * items.length)];

  // Rufe die `getRandomRarity`-Funktion auf, um die Seltenheit (`rarity`) des Items zufällig zu bestimmen.
  const rarity = getRandomRarity();

  // Gib ein Objekt mit den Eigenschaften `itemType` und `rarity` zurück, das den gecrafteten Gegenstand repräsentiert.
  // Das Objekt enthält also den Typ (z. B. "Waffe" oder "Rüstung") und die zufällig bestimmte Seltenheit.
  return { itemType, rarity };
}
