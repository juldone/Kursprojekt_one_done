// Backend: battle.js
import User from "../data/User.js";
import fs from "fs/promises";
import path from "path";

const enemyDataPath = path.resolve("data/enemies/enemy.json");

export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

    // Benutzer abrufen
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Charakter überprüfen
    const character = user.characters.find(
      (char) => char.characterId.toString() === characterId
    );
    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden" });
    }

    // Gegnerdaten laden
    const data = await fs.readFile(enemyDataPath, "utf-8");
    const enemies = JSON.parse(data);

    // Zufälligen Gegner auswählen
    const randomIndex = Math.floor(Math.random() * enemies.length);
    const enemy = enemies[randomIndex];

    // Charakter und Gegner-Daten zurückgeben
    return res.status(200).json({
      character: {
        stats: character.stats, // Nur relevante Daten
        equipment: character.equipment,
        name: character.name,
        level: character.level,
        _id: character._id,
      },
      enemy: {
        ...enemy,
      },
    });
  } catch (error) {
    console.error("Fehler beim Kampf:", error);
    res.status(500).json({ message: "Fehler beim Kampf", error });
  }
}
