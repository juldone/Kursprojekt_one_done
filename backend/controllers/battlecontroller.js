// Importiere das User-Modell
import User from "../data/User.js";
import fs from "fs/promises"; // Verwende fs.promises für Promises
import path from "path";

// Pfad zur JSON-Datei für Gegnerdaten
const enemyDataPath = path.resolve("data/enemies/enemy.json");

export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

    console.log("Received accountId:", accountId);
    console.log("Received characterId:", characterId);

    // 1. Benutzer abrufen
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // 2. Charakter überprüfen
    const character = user.characters.find(
      (char) => char.characterId.toString() === characterId
    );
    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden" });
    }

    // 3. Gegnerdaten laden
    const data = await fs.readFile(enemyDataPath, "utf-8").catch((err) => {
      console.error("Fehler beim Lesen der Gegnerdaten:", err);
      throw new Error("Gegnerdaten konnten nicht geladen werden.");
    });
    const enemies = JSON.parse(data);

    // 4. Zufälligen Gegner auswählen
    const randomIndex = Math.floor(Math.random() * enemies.length);
    const enemy = enemies[randomIndex];
    console.log("Gegner ausgewählt:", enemy);

    // 5. Kampflogik initialisieren
    let characterHp = character.stats.hp;
    let enemyHp = enemy.stats.health;
    const battleLog = [];

    // 6. Kampfschleife
    while (characterHp > 0 && enemyHp > 0) {
      // Charakter greift an
      const characterAttack = Math.max(
        0,
        character.stats.attack - enemy.stats.defense
      );
      enemyHp -= characterAttack;
      battleLog.push({
        round: battleLog.length + 1,
        characterAttack,
        enemyAttack: 0,
        characterHp,
        enemyHp: Math.max(0, enemyHp),
      });

      // Prüfen, ob Gegner besiegt ist
      if (enemyHp <= 0) {
        const rewards = await handleRewards(user, enemy);
        return res
          .status(200)
          .json(
            createBattleResponse(
              character,
              enemy,
              battleLog,
              "character",
              rewards,
              characterHp
            )
          );
      }

      // Gegner greift an
      const enemyAttack = Math.max(
        0,
        enemy.stats.attack - character.stats.defense
      );
      characterHp -= enemyAttack;
      battleLog.push({
        round: battleLog.length + 1,
        characterAttack: 0,
        enemyAttack,
        characterHp: Math.max(0, characterHp),
        enemyHp,
      });

      // Prüfen, ob Charakter besiegt ist
      if (characterHp <= 0) {
        return res
          .status(200)
          .json(createBattleResponse(character, enemy, battleLog, "enemy"));
      }
    }
  } catch (error) {
    console.error("Fehler beim Kampf:", error);
    res.status(500).json({ message: "Fehler beim Kampf", error });
  }
}

// Helper-Funktion: Belohnungen verarbeiten
async function handleRewards(user, enemy) {
  const materialDrops = [];

  for (const drop of enemy.drops) {
    const { material, chance, amount } = drop;

    if (!material || typeof chance !== "number" || !Array.isArray(amount)) {
      console.error(`Ungültige Drop-Daten für ${enemy.name}:`, drop);
      continue;
    }

    if (Math.random() <= chance) {
      const quantity =
        Math.floor(Math.random() * (amount[1] - amount[0] + 1)) + amount[0];
      user.materials[material] = (user.materials[material] || 0) + quantity;
      materialDrops.push({ material, quantity });
    }
  }

  if (materialDrops.length > 0) {
    await user.save();
  }

  return materialDrops;
}

// Helper-Funktion: Kampfantwort erstellen
function createBattleResponse(
  character,
  enemy,
  battleLog,
  winner,
  rewards = null,
  remainingHp = null
) {
  return {
    battleSummary: {
      winner,
      message:
        winner === "character"
          ? `${character.name} hat ${enemy.name} besiegt!`
          : `${enemy.name} hat ${character.name} besiegt!`,
    },
    character: {
      name: character.name,
      stats: {
        ...character.stats,
        hp: winner === "character" ? remainingHp : 0,
      },
    },
    enemy: {
      name: enemy.name,
      stats: {
        ...enemy.stats,
        hp: winner === "character" ? 0 : enemy.stats.health,
      },
    },
    battleLog,
    ...(rewards
      ? { rewards: { drops: rewards, updatedMaterials: User.materials } }
      : {}),
  };
}
