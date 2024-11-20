// Importiere das User-Modell
import User from "../data/User.js";
import fs from "fs/promises"; // Verwende fs.promises für Promises
import path from "path";
const enemyDataPath = path.resolve("data/enemies/enemy.json"); // Pfad zur JSON-Datei

export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

    // Logge die empfangenen Werte
    console.log("Received accountId:", accountId);
    console.log("Received characterId:", characterId);

    // Hole den Benutzer mit der accountId
    const user = await User.findOne({ accountId });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Überprüfe, ob der Charakter mit characterId existiert
    const character = user.characters.find(
      (char) => char.characterId.toString() === characterId // Vergewissere dich, dass die ID als String verglichen wird
    );

    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden" });
    }

    // Lade die Gegnerdaten
    const data = await fs.readFile(enemyDataPath, "utf-8");
    const EnemyData = JSON.parse(data); // JSON-Daten auslesen

    // Wähle einen zufälligen Gegner aus den geladenen Daten
    const randomIndex = Math.floor(Math.random() * EnemyData.length);
    const enemy = EnemyData[randomIndex];

    // Initialisiere die Startwerte
    let characterHp = character.stats.hp;
    let enemyHp = enemy.stats.health;

    // Kampfschleife
    while (characterHp > 0 && enemyHp > 0) {
      // Charakter greift Gegner an
      const characterAttack = character.stats.attack - enemy.stats.defense;
      enemyHp -= Math.max(0, characterAttack); // Verhindert negativen Schaden

      // Innerhalb der while-Schleife, nach dem Kampf
      if (enemyHp <= 0) {
        const materialDrops = [];
        enemy.drops.forEach((drop) => {
          const { material, chance, amount } = drop;
          if (
            !material ||
            typeof chance !== "number" ||
            !Array.isArray(amount)
          ) {
            console.error(`Ungültige Drop-Daten für ${enemy.name}:`, drop);
            return; // Überspringe diesen Drop, wenn ungültige Daten vorhanden sind
          }

          if (Math.random() <= chance) {
            const quantity =
              Math.floor(Math.random() * (amount[1] - amount[0] + 1)) +
              amount[0];

            user.materials[material] =
              (user.materials[material] || 0) + quantity;

            materialDrops.push({ material, quantity });
          }
        });

        if (materialDrops.length > 0) {
          await user.save();
        }

        return res.status(200).json({
          message: `${character.name} hat ${enemy.name} besiegt!`,
          characters: {
            name: character.name,
            stats: character.stats, // Sende die vollständigen Stats des Charakters
          },
          enemy: {
            name: enemy.name,
            stats: {
              health: enemy.stats.health,
              attack: enemy.stats.attack,
              defense: enemy.stats.defense,
            },
          },
          drops: materialDrops,
          userMaterials: user.materials,
        });
      }

      if (characterHp <= 0) {
        return res.status(200).json({
          message: `${enemy.name} hat ${character.name} besiegt DRECK!!`,
        });
      }

      // Gegner greift an
      const enemyAttack = enemy.stats.attack - character.stats.defense;
      characterHp -= Math.max(0, enemyAttack);

      if (characterHp <= 0) {
        return res.status(200).json({
          message: `${enemy.name} hat ${character.name} besiegt DRECK!!`,
        });
      }
    }
  } catch (error) {
    console.error("Fehler beim Kampf:", error);
    res.status(500).json({ message: "Fehler beim Kampf", error });
  }
}
