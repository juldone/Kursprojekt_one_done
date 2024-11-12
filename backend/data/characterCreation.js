import Character from "../models/character.js";
import { v4 as uuidv4 } from "uuid"; // UUID-Bibliothek für eindeutige IDs

// Funktion zur Charaktererstellung
export async function createCharacter(data) {
  const { accountId, name, level = 1, stats, equipment } = data; // accountId wird nun auch übernommen

  // Standard-Stats setzen
  const defaultStats = {
    hp: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    ...stats,
  };

  // Standard-Ausrüstung setzen
  const defaultEquipment = {
    armor: {
      head: null,
      chest: null,
      hands: null,
      legs: null,
      ...equipment?.armor,
    },
    weapon: equipment?.weapon || null,
  };

  // Eindeutige Charakter-ID generieren
  const uniqueCharacterID = uuidv4();

  const newCharacter = new Character({
    _id: uniqueCharacterID, // Generierte Charakter-ID
    accountId: accountId, // Zugehörige Account-ID
    name,
    level,
    stats: defaultStats,
    equipment: defaultEquipment,
  });

  // Charakter in der Datenbank speichern
  return await newCharacter.save();
}
