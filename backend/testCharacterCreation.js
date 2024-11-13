import { createCharacter } from "./characterCreation.js";

async function testCreateCharacter() {
  const characterData = {
    accountId: "12345",
    name: "Test Character",
    level: 1,
    stats: {
      hp: 120,
      attack: 15,
    },
    equipment: {
      armor: {
        head: "Iron Helmet",
      },
      weapon: "Iron Sword",
    },
  };

  try {
    const newCharacter = await createCharacter(characterData);
    console.log("Charakter erfolgreich erstellt:", newCharacter);
  } catch (error) {
    console.error("Fehler beim Erstellen des Charakters:", error);
  } finally {
    mongoose.connection.close(); // Verbindung schließen, nachdem der Test abgeschlossen ist
  }
}

testCreateCharacter();
