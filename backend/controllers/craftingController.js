import User from "../models/User.js"; // Importiert das User-Modell, um Benutzer aus der Datenbank abzurufen und zu bearbeiten
import { getRandomRarity } from "../utils/chanceTable.js"; // Importiert eine Funktion, die eine zufällige Rarität für ein Item bestimmt
import fs from "fs"; // Importiert das File-System-Modul von Node.js, um auf Dateien zuzugreifen und diese zu bearbeiten
import path from "path"; // Importiert das Path-Modul von Node.js, um mit Dateipfaden zu arbeiten
import Armor from "../data/armor.js"; // Importiert die Rüstungsdaten aus einer externen Datei
import { createCraftingItem } from "../utils/craftingUtils.js"; // Importiert eine Funktion, die Crafting-Items erstellt
import { fileURLToPath } from "url"; // Importiert die Funktion, die hilft, die Dateipfade in einer ES-Modul-Umgebung zu ermitteln

// Holen des Pfads des aktuellen Moduls (dieser Code hilft, den Pfad zur Datei unabhängig vom Betriebssystem korrekt zu ermitteln)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Der Verzeichnisname des aktuellen Moduls (kann genutzt werden, um relativ auf Dateien zuzugreifen)

// Der Pfad zur Waffen-Json-Datei wird mit Hilfe von __dirname und path.join zusammengesetzt
const weaponsPath = path.join(__dirname, "..", "data", "waffen.json");

// Die JSON-Datei mit Waffeninformationen wird synchron mit fs geladen und geparsed
const weapons = JSON.parse(fs.readFileSync(weaponsPath, "utf8")); // Liest die Datei und konvertiert sie von JSON in ein JavaScript-Objekt

// Funktion zum Überprüfen, ob der Benutzer genug Materialien hat, um das Item zu craften
function checkMaterials(userMaterials, materialCost) {
  for (const material in materialCost) {
    // Iteriert über jedes Material im Rezept
    if (userMaterials[material] < materialCost[material]) {
      // Überprüft, ob der Benutzer genug Material hat
      return false; // Wenn ein Material fehlt oder nicht genug vorhanden ist, wird false zurückgegeben
    }
  }
  return true; // Wenn alle Materialien ausreichend sind, wird true zurückgegeben
}

// Funktion zum Abziehen der Materialien vom Benutzer
function deductMaterials(userMaterials, materialCost) {
  for (const material in materialCost) {
    // Iteriert über jedes Material im Rezept
    userMaterials[material] -= materialCost[material]; // Zieht die Materialmenge ab, die im Rezept benötigt wird
  }
  return userMaterials; // Gibt die aktualisierten Materialien des Benutzers zurück
}

// Hauptfunktion zum Craften eines Items
export async function craftItem(userId, itemName) {
  try {
    // Sucht den Benutzer anhand der Benutzer-ID in der Datenbank
    const user = await User.findById(userId);
    if (!user) {
      // Wenn der Benutzer nicht gefunden wird, gibt es eine Fehlermeldung
      return { success: false, message: "Benutzer nicht gefunden" };
    }

    let item, itemType; // Variablen für das Item und seinen Typ (Waffe oder Rüstung)
    let isWeapon = false; // Flag, um zu prüfen, ob es sich bei dem Item um eine Waffe handelt

    // Überprüfen, ob das Item eine Waffe oder eine Rüstung ist
    if (weapons[itemName]) {
      // Wenn der Name des Items in den Waffen-Daten vorhanden ist
      item = weapons[itemName]; // Setze das Item als Waffe
      itemType = "weapon"; // Setze den Item-Typ auf "weapon"
      isWeapon = true; // Setze das Flag für Waffen auf true
    } else if (Armor[itemName]) {
      // Wenn der Name des Items in den Rüstungs-Daten vorhanden ist
      item = Armor[itemName]; // Setze das Item als Rüstung
      itemType = "armor"; // Setze den Item-Typ auf "armor"
    } else {
      return { success: false, message: "Item nicht gefunden" }; // Wenn das Item weder eine Waffe noch eine Rüstung ist
    }

    // Überprüfen, ob der Benutzer genügend Materialien für das Crafting hat
    const hasMaterials = checkMaterials(user.materials, item.materialCost);
    if (!hasMaterials) {
      // Wenn der Benutzer nicht genug Materialien hat
      return { success: false, message: "Deine Materialien reichen nicht aus" };
    }

    // Materialien vom Benutzer abziehen
    user.materials = deductMaterials(user.materials, item.materialCost);

    // Bestimmen der Rarität des Items (die Rarität wird mit einer zufälligen Chance-Tabelle festgelegt)
    const rarity = getRandomRarity(); // Ruft die Funktion zur Bestimmung der Rarität auf

    // Erstellen des gecrafteten Items basierend auf den Item-Daten und der Rarität
    const craftedItem = createCraftingItem({
      result: itemName, // Das Ergebnis ist der Name des Items
      type: itemType, // Der Typ des Items (Waffe oder Rüstung)
      attack: isWeapon ? item.attack : 0, // Falls es eine Waffe ist, wird der Angriffswert gesetzt, andernfalls 0
      defense: !isWeapon ? item.defense : 0, // Falls es keine Waffe (also eine Rüstung) ist, wird der Verteidigungswert gesetzt
      recipe: item.materialCost, // Die Materialkosten des Items
    });

    // Das neu gecraftete Item wird dem Benutzer-Inventar hinzugefügt, zusammen mit der Rarität
    user.inventory.push({ itemName: craftedItem.name, rarity });

    // Speichern der Benutzer-Daten (damit die Änderungen im Inventar und den Materialien persistiert werden)
    await user.save();

    // Erfolgreiche Rückmeldung mit dem gecrafteten Item und der Rarität
    return {
      success: true,
      message: `Du hast ein ${craftedItem.name} von Qualität ${rarity} hergestellt!`,
      item: craftedItem, // Rückgabe des gecrafteten Items
    };
  } catch (error) {
    // Fehlerbehandlung, falls beim Craften ein Fehler auftritt
    console.error("Fehler beim Craften:", error); // Fehlerprotokollierung in der Konsole
    return { success: false, message: "Fehler beim Craften des Items" }; // Rückgabe einer Fehlermeldung
  }
}
