// Ein Objekt, das die Seltenheitsgrade und ihre Wahrscheinlichkeiten enthält
const rarityChanceTable = {
  common: 50, // 50 % wahrscheinlichkeit für gewöhnliche Items
  uncommon: 30, // 30 % Wahrscheinlichkeit für ungewöhnliche Items
  rare: 15, // 15 % Wahrscheinlichkeit für seltene Items
  epic: 4, // 4 % Wahrscheinlichkeit für epische Items
  legendary: 1, // 1 % Wahrscheinlichkeit für legendäre Items
};

// Funktion, die basierend auf dem Chance-Table eine Seltenheit zurückgibt
export function getRandomRarity() {
  const randomNumber = Math.random() * 100; // Zufallszahl zwischen 0 und 100
  let cumulativeChance = 0;

  for (const [rarity, chance] of Object.entries(rarityChanceTable)) {
    cumulativeChance += chance; // Addiert die Wahrscheinlichkeit jedes Seltenheitsgrads
    if (randomNumber <= cumulativeChance) {
      return rarity; // Gibt den Seltenheitsgrad zurück, wenn die Zufallszahl kleiner oder gleich der kumulierten Wahrscheinlichkeit ist
    }
  }
  return "common"; // Standardwert, falls keine Übereinstimmung gefunden wird
}

export default { getRandomRarity };
