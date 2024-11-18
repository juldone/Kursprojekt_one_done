import Character from "../data/character/character.js";
import fs from "fs/promises"; // Verwende fs.promises für Promises
import path from "path";
import User from "../data/User.js"; // Pfad anpassen

const enemyDataPath = path.resolve("data/enemies/enemy.json"); // Pfad zur JSON-Datei

export async function battle(req, res) {
  try {
    const { characterId } = req.body;

    // Lade den Charakter aus der Datenbank
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden" });
    }

    // Lade die Gegnerdaten
    const data = await fs.readFile(enemyDataPath, "utf-8");
    const EnemyData = JSON.parse(data); // JSON-Daten auslesen

    // Wähle einen zufälligen Gegner aus den geladenen Daten
    const randomIndex = Math.floor(Math.random() * EnemyData.length);
    const enemy = EnemyData[randomIndex];

    // Lade den Benutzer basierend auf der `accountId` des Charakters
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Initialisiere die Startwerte
    let characterHp = character.stats.hp;
    let enemyHp = enemy.stats.health;

    // Kampfschleife
    while (characterHp > 0 && enemyHp > 0) {
      // Charakter greift Gegner an
      const characterAttack = character.stats.attack - enemy.stats.defense;
      enemyHp -= Math.max(0, characterAttack); // Verhindert negativen Schaden

      // Überprüfen, ob der Gegner besiegt ist
      if (enemyHp <= 0) {
        // Materialien aus den Drops hinzufügen, wenn der Gegner besiegt wird
        const materialDrops = [];
        enemy.drops.forEach((drop) => {
          const { material, chance, amount } = drop;

          // Überprüfen auf fehlende oder ungültige Werte
          if (
            !material ||
            typeof chance !== "number" ||
            !Array.isArray(amount)
          ) {
            console.error(`Ungültige Drop-Daten für ${enemy.name}:`, drop);
            return; // Überspringe diesen Drop, wenn ungültige Daten vorhanden sind
          }

          // Zufallszahl zur Überprüfung der Drop-Wahrscheinlichkeit
          if (Math.random() <= chance) {
            const quantity =
              Math.floor(Math.random() * (amount[1] - amount[0] + 1)) +
              amount[0];

            // Materialien zum aktuellen Bestand addieren
            user.materials[material] =
              (user.materials[material] || 0) + quantity;

            materialDrops.push({ material, quantity });
          }
        });

        // Wenn es Material-Drops gab, speichern
        if (materialDrops.length > 0) {
          await user.save();
        }

        return res.status(200).json({
          message: `${character.name} hat ${enemy.name} besiegt!`,
          drops: materialDrops, // Rückgabe der tatsächlich erhaltenen Drops
          userMaterials: user.materials, // Aktualisierte Materialien des Benutzers
        });
      }

      // Gegner greift Charakter an
      const enemyAttack = enemy.stats.attack - character.stats.defense;
      characterHp -= Math.max(0, enemyAttack);

      // Überprüfen, ob der Charakter besiegt ist
      if (characterHp <= 0) {
        return res.status(200).json({
          message: `${enemy.name} hat ${character.name} besiegt!`,
        });
      }
    }
  } catch (error) {
    console.error("Fehler beim Kampf:", error);
    res.status(500).json({ message: "Fehler beim Kampf", error });
  }
}
