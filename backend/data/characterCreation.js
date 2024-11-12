// Importiere das Character-Modell aus der Datei character.js, um es in der Funktion zu verwenden.
import Character from "../models/character.js";
import dotenv from "dotenv";
dotenv.config();
// Importiere die UUID-Bibliothek, um eindeutige IDs für die Charaktere zu generieren.
import { v4 as uuidv4 } from "uuid"; // UUID-Bibliothek für eindeutige IDs

// Stelle eine Verbindung zur MongoDB-Datenbank her (bitte die vollständige Verbindungs-URL ergänzen).
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB verbunden"))
  .catch((error) => console.error("MongoDB Verbindungsfehler:", error));

// Definiere die Funktion zur Charaktererstellung. Sie ist asynchron, um auf die Datenbankspeicherung warten zu können.
export async function createCharacter(data) {
  // Destrukturiere die Eingabedaten und lege Standardwerte fest (Level 1, falls nicht angegeben).
  const { accountId, name, level = 1, stats, equipment } = data; // accountId wird nun auch übernommen

  // Definiere Standardwerte für die Charakter-Statistiken und überschreibe sie mit den übergebenen Daten, falls vorhanden.
  const defaultStats = {
    hp: 100, // Standardwert für die Lebenspunkte (Health Points)
    attack: 10, // Standardwert für den Angriff
    defense: 5, // Standardwert für die Verteidigung
    speed: 5, // Standardwert für die Geschwindigkeit
    ...stats, // Erlaubt das Überschreiben einzelner Stat-Werte, falls im Input "stats" vorhanden
  };

  // Definiere Standardwerte für die Ausrüstung und überschreibe sie mit den übergebenen Daten, falls vorhanden.
  const defaultEquipment = {
    armor: {
      head: null, // Standardwert für Kopf-Rüstung (keine Ausrüstung standardmäßig)
      chest: null, // Standardwert für Brust-Rüstung (keine Ausrüstung standardmäßig)
      hands: null, // Standardwert für Handschuh-Rüstung (keine Ausrüstung standardmäßig)
      legs: null, // Standardwert für Bein-Rüstung (keine Ausrüstung standardmäßig)
      ...equipment?.armor, // Überschreibe, falls spezifische Rüstungsteile im Input "equipment.armor" angegeben sind
    },
    weapon: equipment?.weapon || null, // Falls im Input "equipment.weapon" vorhanden, setze dies, ansonsten kein Standardwaffenwert
  };

  // Erzeuge eine eindeutige ID für den neuen Charakter mit Hilfe der UUID-Bibliothek.
  const uniqueCharacterID = uuidv4();

  // Erstelle ein neues Charakter-Dokument basierend auf dem Character-Modell und den zusammengestellten Daten.
  const newCharacter = new Character({
    uniqueCharacterID: uniqueCharacterID, // Setze die generierte eindeutige ID als Charakter-ID
    accountId: accountId, // Weist den Charakter dem übergebenen Account zu
    name, // Setzt den Namen des Charakters
    level, // Setzt das Level des Charakters
    stats: defaultStats, // Übernimmt die festgelegten Statistiken
    equipment: defaultEquipment, // Übernimmt die festgelegte Ausrüstung
  });

  // Speichere das neue Charakter-Dokument in der Datenbank und gib das gespeicherte Dokument zurück.
  return await newCharacter.save();
}
