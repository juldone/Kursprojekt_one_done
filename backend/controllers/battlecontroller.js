import User from "../data/User.js";
import fs from "fs/promises";
import path from "path";

// Definiere den Pfad zur Gegner-Daten-Datei
const enemyDataPath = path.resolve("data/enemies/enemy.json"); // Verwende `path.resolve` für plattformübergreifende Pfadkompatibilität

export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

    // Hole den Benutzer und Charakter
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const character = user.characters.find(
      (char) => char.characterId.toString() === characterId
    );
    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden" });
    }

    // Lade Gegnerdaten
    const data = await fs.readFile(enemyDataPath, "utf-8");
    const EnemyData = JSON.parse(data);
    const randomIndex = Math.floor(Math.random() * EnemyData.length);
    const enemy = EnemyData[randomIndex];

    // Gebe die Ausgangsdaten zurück (keine Berechnungen, nur Daten)
    return res.status(200).json({
      character: { ...character.stats, name: character.name },
      enemy: { ...enemy.stats, name: enemy.name },
    });
  } catch (error) {
    console.error("Fehler beim Starten des Kampfes:", error);
    res.status(500).json({ message: "Fehler beim Starten des Kampfes", error });
  }
}
