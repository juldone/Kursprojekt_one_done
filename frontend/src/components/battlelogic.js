// src/utils/battleLogic.js

// Berechnung des Schadens
export const calculateDamage = (attack, defense) => {
  console.log(attack);
  return Math.max(0, attack - defense);
};

// Kampfrunde verarbeiten
export const processRound = (character, enemy) => {
  const characterAttack = calculateDamage(
    character.stats.attack,
    enemy.stats.defense
  );
  const enemyAttack = calculateDamage(
    enemy.stats.attack,
    character.stats.defense
  );

  // Update des HP-Werts nach der Runde
  character.stats.hp -= enemyAttack;
  enemy.stats.health -= characterAttack;

  return {
    characterAttack,
    enemyAttack,
    characterHp: character.stats.hp,
    enemyHp: enemy.stats.health,
  };
};
