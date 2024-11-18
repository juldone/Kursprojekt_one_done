import User from "../../data/User.js"; // Der Pfad kann je nach Struktur des Projekts variieren
import mongoose from "mongoose";
// Funktion zur Erstellung eines Charakters
export const createCharacter = async (req, res) => {
  try {
    // Benutzerdaten aus der Anfrage
    const { accountId, name, level, stats, equipment } = req.body;

    // Überprüfen, ob der Benutzer existiert
    const user = await User.findOne({ accountId });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Erstelle eine neue Charakter-ID
    const newCharacterId = new mongoose.Types.ObjectId().toString();

    // Erstelle das Charakter-Objekt
    const newCharacter = {
      characterId: newCharacterId,
      name,
      level,
      stats,
      equipment,
    };

    // Füge den neuen Charakter zum Benutzer hinzu
    user.characters.push(newCharacter);

    // Speichere den Benutzer mit dem neuen Charakter
    await user.save();

    // Erfolgsantwort zurückgeben
    res.status(201).json({
      message: "Charakter erfolgreich erstellt",
      character: newCharacter,
    });
  } catch (error) {
    console.error("Fehler bei der Charaktererstellung:", error);
    res.status(500).json({ message: "Fehler bei der Charaktererstellung" });
  }
};
