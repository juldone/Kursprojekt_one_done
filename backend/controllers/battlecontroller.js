// Importiere das User-Modell und notwendige Module
import User from "../data/User.js";
import fs from "fs/promises";
import path from "path";

const enemyDataPath = path.resolve("data/enemies/enemy.json"); // Pfad zur Gegner-JSON-Datei

// Utility: Lade Gegnerdaten aus der JSON-Datei
async function loadEnemyData() {
  try {
    const data = await fs.readFile(enemyDataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Fehler beim Laden der Gegnerdaten:", error);
    throw new Error("Gegnerdaten konnten nicht geladen werden.");
  }
}

// Utility: Finde einen Benutzer und Charakter basierend auf accountId und characterId
async function findUserAndCharacter(accountId, characterId) {
  const user = await User.findOne({ accountId }).select("materials characters");
  if (!user) throw new Error("Benutzer nicht gefunden");

  const character = user.characters.find(
    (char) => char.characterId.toString() === characterId
  );
  if (!character) throw new Error("Charakter nicht gefunden");

  return { user, character };
}

// Utility: Berechne den Angriffsschaden
function calculateAttack(attacker, defender) {
  return Math.max(0, attacker.stats.attack - defender.stats.defense);
}

// Utility: Berechne Materialdrops
function calculateDrops(enemy, user) {
  const drops = [];
  enemy.drops.forEach(({ material, chance, amount }) => {
    if (Math.random() <= chance) {
      const quantity =
        Math.floor(Math.random() * (amount[1] - amount[0] + 1)) + amount[0];
      user.materials[material] = (user.materials[material] || 0) + quantity;
      drops.push({ material, quantity });
    }
  });
  return drops;
}

// Hauptfunktion: Kampflogik
export async function battle(req, res) {
  try {
    const { characterId, accountId } = req.body;

    // Hole Benutzer, Charakter und Gegnerdaten
    const { user, character } = await findUserAndCharacter(
      accountId,
      characterId
    );
    const enemies = await loadEnemyData();

    // Wähle einen zufälligen Gegner
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];

    // Initialisiere Kampfwerte
    let characterHp = character.stats.hp;
    let enemyHp = enemy.stats.health;
    const battleLog = [];

    // Kampfschleife
    while (characterHp > 0 && enemyHp > 0) {
      // Charakter greift an
      const characterAttack = calculateAttack(character, enemy);
      enemyHp -= characterAttack;

      battleLog.push({
        round: battleLog.length + 1,
        characterAttack,
        enemyAttack: 0,
        characterHp,
        enemyHp: Math.max(0, enemyHp),
      });

      if (enemyHp <= 0) {
        const materialDrops = calculateDrops(enemy, user);
        await user.save(); // Speichere Änderungen an Materialien
        return res.status(200).json({
          battleSummary: {
            winner: "character",
            message: `${character.name} hat ${enemy.name} besiegt!`,
          },
          character: {
            name: character.name,
            stats: { ...character.stats, hp: characterHp },
          },
          enemy: {
            name: enemy.name,
            stats: { ...enemy.stats, hp: enemyHp },
          },
          battleLog,
          rewards: {
            drops: materialDrops,
            updatedMaterials: user.materials,
          },
        });
      }

      // Gegner greift an
      const enemyAttack = calculateAttack(enemy, character);
      characterHp -= enemyAttack;

      battleLog.push({
        round: battleLog.length + 1,
        characterAttack: 0,
        enemyAttack,
        characterHp: Math.max(0, characterHp),
        enemyHp,
      });

      if (characterHp <= 0) {
        return res.status(200).json({
          battleSummary: {
            winner: "enemy",
            message: `${enemy.name} hat ${character.name} besiegt!`,
          },
          character: {
            name: character.name,
            stats: { ...character.stats, hp: 0 },
          },
          enemy: {
            name: enemy.name,
            stats: { ...enemy.stats, hp: enemyHp },
          },
          battleLog,
        });
      }
    }
  } catch (error) {
    console.error("Fehler beim Kampf:", error);
    res
      .status(500)
      .json({ message: "Fehler beim Kampf", error: error.message });
  }
}
