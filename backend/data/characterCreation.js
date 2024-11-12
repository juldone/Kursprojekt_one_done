import mongoose from "mongoose";
import Character from "./character.js"; // Character-Schema wird importiert

// Verbindung zur MongoDB-Datenbank herstellen
mongoose.connect("mongodb://localhost:27017/gameDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Funktion zur Charaktererstellung
async function createCharacter({ name, level = 1, stats, equipment }) {
  try {
    //Standardwerte festlegen, falls nicht bereitgsetellt
    const defaultStats = {
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 5,
      ...stats, // Werte überschreiben, falls sie in stats angegeben sind
    };

    const defaultEquipment = {
      armor: {
        head: null,
        chest: null,
        hands: null,
        legs: null,
        ...equipment?.armor, // spezifische Rüstungsteile
      },
      weapon: equipment?.weapon || null,
    };

    // Neuen Charakter erstellen
    const newCharacter = new Character({
      name,
      level,
      stats: defaultStats,
      equipment: defaultEquipment,
    });

    // Charakter in der Datenbank speichern
    const savedCharacter = await newCharacter.save();
    console.log("Dein Charakter trägt folgenden Namen:", savedCharacter);
    return savedCharacter;
  } catch (error) {
    console.error("Fehler bei der Charaktererstellung:", error);
  }
}

// Beispiel für die CHaraktererstellung
createCharacter({
  name: "BraveKnight",
  level: 5,
  stats: { hp: 120, attack: 15, defense: 10, speed: 10 },
  equipment: {
    armor: {
      head: "item_id_head_armor",
      chest: "item_id_chest_armor",
      hands: "item_id_hand_armor",
      legs: "item_id_leg_armor",
    },
    weapon: "item_id_weapon",
  },
}).then(() => mongoose.disconnect()); // Verbindung zur Datenbank schließen
