// Importiere das User-Modell
import User from "../data/User.js";
import fs from "fs/promises"; // Verwende fs.promises für Promises
import path from "path";
const enemyDataPath = path.resolve("data/enemies/enemy.json"); // Pfad zur JSON-Datei

export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

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

    const data = await fs.readFile(enemyDataPath, "utf-8");
    const enemies = JSON.parse(data);

    // Zufälligen Gegner auswählen
    const randomIndex = Math.floor(Math.random() * enemies.length);
    const enemy = enemies[randomIndex];

    // Belohnungslogik auslagern
    const rewards = await handleRewards(user, enemy);

    // Übergabe der Belohnungen und wichtigen Daten ins Frontend
    return res.status(200).json({
      character,
      enemy,
      battleLog: [], // Leerer Log, da die Rundenlogik ins Frontend geht
      rewards,
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Kampf", error });
  }
}
