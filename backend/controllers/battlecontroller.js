// Importiere die Modelle für den Charakter, den Gegner und den Benutzer
import Character from "../data/character/character.js";
import Enemy from "../data/enemies/enemy.js";
import User from "../data/User.js"; // Pfad anpassen

export async function battle(req, res) {
  try {
    const { characterId, enemyId } = req.body;

    // Lade den Charakter und den Gegner aus der Datenbank
    const character = await Character.findById(characterId);
    const enemy = await Enemy.findOne({ enemyid: enemyId });

    if (!character || !enemy) {
      return res
        .status(404)
        .json({ message: "Charakter oder Gegner nicht gefunden" });
    }

    // Lade den Benutzer basierend auf der `accountId` des Charakters
    const user = await User.findOne({ accountId: character.accountId });
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
        enemy.drops.forEach((drop) => {
          const { material, chance, amount } = drop;

          // Zufallszahl zur Überprüfung der Drop-Wahrscheinlichkeit
          if (Math.random() <= chance) {
            const quantity =
              Math.floor(Math.random() * (amount[1] - amount[0] + 1)) +
              amount[0];
            // Materialien zum aktuellen Bestand addieren
            user.materials[material] =
              (user.materials[material] || 0) + quantity;
          }
        });

        await user.save();

        return res.status(200).json({
          message: `${character.name} hat ${enemy.name} besiegt!`,
          drops: enemy.drops, // Drops zurückgeben, wenn der Gegner besiegt wird
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
